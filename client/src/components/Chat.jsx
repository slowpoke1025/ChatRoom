import { useEffect, useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ChatContainer from "../style/ChatContainer";
import { axiosContact, axiosMsg, URL } from "../utils/AxiosInstance";
import ChatRoom from "./ChatRoom";
import Contact from "./Contact";
import Welcome from "./Welcome";
import { io } from "socket.io-client"
import { useReducer } from "react";
import chatReducer from "../reducer/chatReducer";

const Chat = () => {

    const socket = useRef()
    const navigate = useNavigate()
    const [user, setUser] = useState()
    const [contacts, dispatch] = useReducer(chatReducer, []);
    // const [chatKeys, setChatKeys] = useState({})
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

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const getAllContacts = async () => {
            try {
                const res = await axiosContact.post("/", { id: user._id });
                if (res.data) {
                    console.log(res.data)
                    dispatch({ type: "INIT", data: res.data });
                    // const map = {}
                    // res.data.forEach((d, i) => {
                    //     map[d._id] = i;
                    // })
                    // console.log(map)
                    // setChatKeys(map)
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
            socket.current.on("receiveMessage", async data => {
                console.log({ ...data, fromself: false })
                const arrivalMsg = { ...data, fromself: false }
                console.log(chat)
                if (chat?._id === data.to) {
                    if (chatKeys.current[chat._id] !== 0)
                        dispatch({ type: "POP_UP", data: { id: chatKeys.current[data.to], generateChatKeys } });
                    setMessage(msg => msg.concat(arrivalMsg))
                    // const res = await axiosMsg.post("/readMessage", { from: user._id, to: data.to })
                    socket.current.emit("read", { from: user._id, to: data.to });
                }
                else {
                    console.log(contacts);

                    dispatch({ type: "ADD_UNREAD", data: { id: chatKeys.current[data.to], generateChatKeys } });
                }
            })
            socket.current.on("read", data => {
                console.log("read")
            })
            socket.current.on("online", data => {
                dispatch({ type: "ONLINE", data: { ...data, id: chatKeys.current[data.room] } })
            })
            socket.current.on("offline", data => {
                // console.log(chatKeys[data.room]);
                dispatch({ type: "OFFLINE", data: { ...data, id: chatKeys.current[data.room] } })
            })


            return () => {
                socket.current.off("receiveMessage")
                socket.current.off("read")
                socket.current.off("offline")
                socket.current.off("online")
            }
        }
    }, [chat, user, contacts])

    const handleContacts = (id) => {
        setChat(chat => {

            dispatch({ type: "SELECT", data: { origin: chatKeys.current?.[chat?._id], id } })
            return contacts[id]
        });
        if (contacts[id].unread !== 0) {
            // const _contact = [...contacts];
            // _contact[id].unread = 0;
            dispatch({ type: "RM_UNREAD", data: { id } })
        }
    }
    return (
        <ChatContainer>
            {/* {user && <img src={`data:image/svg+xml;base64,${user?.image}`} alt="" />} */}
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
