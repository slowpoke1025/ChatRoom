
import ChatInputContainer from "../style/ChatInputContainer"
import { BsEmojiSmileFill } from "react-icons/bs"
import { IoMdSend } from "react-icons/io"
import { FiUpload } from "react-icons/fi"
import EmojiPicker from "emoji-picker-react"

import { useState } from "react"
import { useRef } from "react"
import { Input, InputForm } from "../style/ChatInputContainer"
import { axiosFile } from "../utils/AxiosInstance"

const ChatInput = ({ sendMessage, sendFile }) => {
    const inputRef = useRef()
    const fileRef = useRef();
    const [emojiOpen, setEmojiOpen] = useState(false)

    const handleEmojiClick = (obj) => {

        inputRef.current.innerHTML = inputRef.current.innerHTML.replace(/(<br>)$/, "") + obj.emoji; //`<img class="emoji" src=${obj.getImageUrl()}>`
        setEmojiOpen(false)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const msg = inputRef.current.innerHTML.replace(/^(&nbsp;|<br>|\s)+|(&nbsp;|<br>|\s)+$/g, "")
        if (msg !== "")
            sendMessage(msg.replace(/^(<br>)+|(<br>)+$/g, ""))
        inputRef.current.innerHTML = ""
    }
    const handleUpload = async (e) => {
        const data = fileRef.current.files[0]
        if (!data) return
        sendFile(data)
        fileRef.current.value = ""
    }
    return (
        <ChatInputContainer>
            <div className={"button-container"}>
                <div className="emoji-box">
                    <BsEmojiSmileFill onClick={() => setEmojiOpen(f => !f)} />
                    {emojiOpen && <EmojiPicker
                        onEmojiClick={handleEmojiClick}
                        width={"280px"} height={"350px"}
                        emojiStyle="google" theme="dark" />}
                </div>
                <label htmlFor="upload" className="upload">
                    <FiUpload />
                    <input type="file" id="upload" ref={fileRef} onChange={handleUpload} />
                </label>
            </div>
            <InputForm className="input-container" onSubmit={handleSubmit}>
                <div className="input-box">
                    <Input onFocus={() => { }}
                        onBlur={() => { }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                handleSubmit(e);
                            }
                        }}
                        ref={inputRef}
                        contentEditable
                        placeholder="Type your message here" />
                </div>
                <button className="send" type="submit">
                    <IoMdSend />
                </button>
            </InputForm>
        </ChatInputContainer>
    );
}


export default ChatInput;
