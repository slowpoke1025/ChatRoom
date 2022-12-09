
import { useEffect, useRef } from "react";
import ChatRoomContainer from "../style/ChatRoomContainer";
import { axiosFile, axiosMsg } from "../utils/AxiosInstance";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import Messages from "./Message";


const ChatRoom = ({ user, chat, socket, message, setMessage }) => {


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

    // useEffect(() => {
    //     socket.current.on("receiveMessage", data => {
    //         console.log({ ...data, fromself: false })
    //         const arrivalMsg = { ...data, fromself: false }
    //         if (chat._id === data.to)
    //             setMessage(msg => msg.concat(arrivalMsg))
    //         else {

    //         }
    //     })
    //     return () => socket.current.off("receiveMessage")
    // }, [])
    useEffect(() => {
        socket.current.on("receiveFile", data => {
            console.log({ ...data, fromself: false })
            const arrivalMsg = { ...data, fromself: false }
            if (chat._id === data.to)
                setMessage(msg => msg.concat(arrivalMsg))
        })
        return () => socket.current.off("receiveFile")
    }, [])


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
        } catch (error) {
            console.log(error);
        }
    }
    const chatRef = useRef();
    // useEffect(() => {
    //     let timeout;
    //     if (chatRef.current)

    //         //     scrollRef.current.scrollIntoView({ behavior: "smooth" })
    //         // console.log(scrollRef.current);
    //         // timeout = setTimeout(() => {
    //         chatRef.current?.scrollTo({
    //             left: 0,
    //             top: chatRef.current.scrollHeight,
    //             behavior: "smooth"
    //         })
    //     // }, 100)
    //     return () => clearTimeout(timeout)
    // }, [message, chatRef])
    return (
        <ChatRoomContainer>
            <div className="chat-header">
                <div className="chat-info">
                    <div className="avatar">
                        <img src={`data:image/svg+xml;base64,${chat.members[0].image}`} alt="" />
                    </div>
                    <div className="username">
                        <h3>{chat.members[0].username}</h3>
                    </div>
                </div>
                <Logout socket={socket} />
            </div>
            <div className="chat-body" ref={chatRef}>
                <Messages message={message} chatRef={chatRef} />
            </div>
            <div className="chat-input">
                <ChatInput sendMessage={sendMessage} sendFile={sendFile} />
            </div>
        </ChatRoomContainer>
    )

}

export default ChatRoom;
