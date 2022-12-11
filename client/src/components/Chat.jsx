import { useEffect, useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ChatContainer from "../style/ChatContainer";
import { axiosContact, URL } from "../utils/AxiosInstance";
import ChatRoom from "./ChatRoom";
import Contact from "./Contact";
import Welcome from "./Welcome";
import { io } from "socket.io-client"
import { useReducer } from "react";
import chatReducer from "../reducer/chatReducer";
import { toast } from "react-toastify"
import Call from "./Call";


const Chat = () => {


    const socket = useRef()
    const navigate = useNavigate()
    const [user, setUser] = useState()
    const [contacts, dispatch] = useReducer(chatReducer, []);
    const [chat, setChat] = useState();
    const [message, setMessage] = useState([])
    const chatKeys = useRef({})
    const generateChatKeys = (data) => {
        const map = {}
        data.forEach((d, i) => {
            map[d._id] = i;
        })
        chatKeys.current = map;
    }
    useEffect(() => {
        if (!localStorage.getItem("user"))
            navigate("/login")
        else
            (async () => await setUser(JSON.parse(localStorage.getItem("user"))))()

        // eslint-disable-next-line 
    }, [])

    useEffect(() => {
        const getAllContacts = async () => {
            try {
                const res = await axiosContact.post("/", { id: user._id });
                if (res.data) {
                    console.log(res.data)
                    dispatch({ type: "INIT", data: res.data });
                    generateChatKeys(res.data)
                }
            } catch (error) {
                console.log(error)
            }
        }
        if (user)
            if (user.image === "")
                navigate("/setAvatar")
            else
                getAllContacts()

        // eslint-disable-next-line 
    }, [user])

    useEffect(() => {
        if (user) {
            socket.current = io(URL)
            socket.current.emit("online", user._id)
        }
    }, [user])

    useEffect(() => {

        if (socket.current) {
            socket.current.on("receiveMessage", data => {
                console.log({ ...data, fromself: false })
                const arrivalMsg = { ...data, fromself: false }

                if (chat?._id === data.to) {
                    if (chatKeys.current[chat._id] !== 0)
                        dispatch({ type: "POP_UP", data: { id: chatKeys.current[data.to], generateChatKeys } });
                    setMessage(msg => msg.concat(arrivalMsg))
                    socket.current.emit("read", { from: user._id, to: data.to });
                }
                else {
                    dispatch({ type: "ADD_UNREAD", data: { id: chatKeys.current[data.to], generateChatKeys } });
                }
            })
            socket.current.on("videoCall", data => {
                const peer = contacts[chatKeys.current[data.to]].members[0]
                const accept = () => {
                    socket.current.close()
                    navigate("/test", { state: { user, chat: contacts[chatKeys.current[data.to]], flag: false } })
                }
                const reject = () => {
                    socket.current.emit("reject", { from: user._id, to: peer._id })
                }
                toast.info(<Call accept={accept} chat={peer} reject={reject} />, { autoClose: 12000, onClose: reject })





            })

            socket.current.on("read", data => {
                console.log("read")
            })
            socket.current.on("online", data => {
                dispatch({ type: "ONLINE", data: { ...data, id: chatKeys.current[data.room] } })
            })
            socket.current.on("offline", data => {
                dispatch({ type: "OFFLINE", data: { ...data, id: chatKeys.current[data.room] } })
            })


            return () => {
                socket.current.off("receiveMessage")
                socket.current.off("read")
                socket.current.off("offline")
                socket.current.off("online")
                socket.current.off("receiveFile")
                socket.current.off("videoCall")
            }
        }
    }, [chat, user, contacts])

    const handleContacts = (id) => {
        setChat(chat => {

            dispatch({ type: "SELECT", data: { origin: chatKeys.current?.[chat?._id], id } })
            return contacts[id]
        });
        if (contacts[id].unread !== 0) {

            dispatch({ type: "RM_UNREAD", data: { id } })
        }
    }
    return (
        <ChatContainer>
            <div className="container">
                <Contact contacts={contacts} user={user} handleContacts={handleContacts} />
                {chat == null ? <Welcome user={user} /> :
                    <ChatRoom
                        user={user}
                        chat={chat}
                        socket={socket}
                        message={message} setMessage={setMessage}
                        dispatch={dispatch} chatKeys={chatKeys} generateChatKeys={generateChatKeys} />
                }
            </div>
        </ChatContainer>
    );
}

export default Chat;
