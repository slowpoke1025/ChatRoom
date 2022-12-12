
import { useEffect, useRef, useState } from "react";
import ChatRoomContainer from "../style/ChatRoomContainer";
import { axiosFile, axiosMsg } from "../utils/AxiosInstance";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import Messages from "./Message";
import { RiCloseCircleFill } from "react-icons/ri"
import { FaVideo } from "react-icons/fa"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom";

const ChatRoom = ({ user, chat, socket, message, setMessage, dispatch, chatKeys, generateChatKeys }) => {

    const navigate = useNavigate()

    useEffect(() => {
        const controller = new AbortController()
        const getAllMessage = async () => {
            try {
                const res = await axiosMsg.post("/getMessage", { from: user._id, to: chat._id }, { signal: controller.signal })
                setMessage(res.data)
                console.log(res.data);

            } catch (error) {
                console.log(error.message)
            }
        }
        getAllMessage()

        return () => controller.abort()
        //eslint-disable-next-line
    }, [chat])




    const sendMessage = async (text) => {
        const formatMsg = { from: user._id, to: chat._id, text: text, }
        try {
            const result = await axiosMsg.post("/addMessage", formatMsg)
            const formatMsgInfo = {
                ...formatMsg,
                _id: result.data._id,
                type: "text"
            }
            // socket.current.emit("addMessage", formatMsgInfo, () => {
            //     setMessage(msg => [...msg, { ...formatMsgInfo, fromself: true }])
            // })
            setMessage(msg => [...msg, { ...formatMsgInfo, fromself: true }])
            if (chatKeys[chat._id] !== 0)
                dispatch({ type: "POP_UP", data: { id: chatKeys.current[chat._id], generateChatKeys } })
            console.log({ ...formatMsgInfo, fromself: true })
        } catch (error) {
            console.log(error);
        }
    }

    const sendFile = async (file) => {
        console.log(file)
        const form = new FormData();
        form.append("file", file)
        form.append("from", user._id)
        form.append("to", chat._id)
        let type = file.type.split("/")[0]
        if (type !== "image" && type !== "video")
            type = "file";

        try {
            const res = await axiosFile.post(`upload`, form, {
                onUploadProgress: e => {
                    console.log(100 * e.loaded / e.total)
                }
            })
            console.log(res.data)

            const { _id, link, filename } = res.data
            setMessage(msg => [...msg, {
                fromself: true,
                _id, link, type, filename,
                from: user._id,
                to: chat._id
            }])
            if (chatKeys[chat._id] !== 0)
                dispatch({ type: "POP_UP", data: { id: chatKeys.current[chat._id], generateChatKeys } })
        } catch (error) {
            console.log(error);
        }
    }
    const chatRef = useRef();
    const [imgOpen, setImgOpen] = useState(false)
    const [imgSrc, setImgSrc] = useState()
    const [scrollTop, setScrollTop] = useState()
    const handleImageClick = (e) => {
        setImgOpen(true)
        setImgSrc(e.target.src)
        setScrollTop(chatRef.current.scrollTop)
    }
    useEffect(() => {
        if (chatRef.current) {
            setTimeout(() => {
                chatRef.current.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" })
            }, 50)
        }

    }, [message])
    useEffect(() => {
        if (!imgOpen) {
            chatRef.current.scrollTo(0, scrollTop)
        }
    }, [imgOpen, scrollTop])

    return (
        <ChatRoomContainer>
            <div className="chat-header">
                <div className="chat-info">
                    <div className="avatar">
                        <div className={`online ${chat.online ? "" : "off"}`}></div>
                        <img src={`data:image/svg+xml;base64,${chat.members[0].image}`} alt="" />
                    </div>
                    <div className="username">
                        <h3>{chat.members[0].username}</h3>
                    </div>
                </div>
                <div className="chat-btns">
                    {chat.online ?
                        <FaVideo className="video-call" onClick={() => {
                            socket.current.emit("videoCall", { from: user._id, to: chat._id })
                            socket.current.close()
                            navigate("/test", { state: { user, chat, flag: true } })
                        }} /> : ""}
                    <Logout socket={socket} />
                </div>
            </div>
            <div className="chat-body" ref={chatRef}>
                {
                    imgOpen ?
                        <div className="img-display">
                            <RiCloseCircleFill className="close" onClick={() => {
                                setImgOpen(false)
                            }} />
                            <img src={imgSrc} alt="" />
                        </div> :
                        <Messages message={message} chatRef={chatRef} handleImageClick={handleImageClick} />
                }
            </div>
            <div className="chat-input">
                <ChatInput sendMessage={sendMessage} sendFile={sendFile} />
            </div>
        </ChatRoomContainer>
    )

}


export default ChatRoom;
