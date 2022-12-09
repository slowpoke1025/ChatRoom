import React, { useEffect } from 'react';
import { useRef } from 'react';
import styled from 'styled-components';
import { IoMdDocument } from "react-icons/io"
import axios from 'axios';
const Messages = ({ message, chatRef }) => {
    const scrollRef = useRef()

    useEffect(() => {
        if (scrollRef.current) {
            setTimeout(() => {
                scrollRef.current.scrollIntoView({ behavior: "smooth" })
                console.log(scrollRef.current.textContent);
            }, 50)
        }

    }, [message, scrollRef])
    return message.map((msg, i) => {
        return (
            <MessageBox mode={`${msg.fromself ? "sended" : "received"}`} key={msg._id} ref={i + 1 === message.length ? scrollRef : null}>
                <div
                    className={`message ${msg.type !== "text" ? "media" : ""}`}
                >
                    {
                        msg.type === "text"
                            ?
                            <div className="text" dangerouslySetInnerHTML={{ __html: msg?.text }} />
                            : msg.type === "image"
                                ?
                                <img src={"http://localhost:5000/" + msg.link} alt="" />
                                : msg.type === "file"
                                    ?
                                    <div className='file'>

                                        <div href={"http://localhost:5000/" + msg.link}
                                            download={msg.filename}
                                            onClick={async () => {
                                                const res = await axios.get("http://localhost:5000/" + msg.link, { responseType: "blob" })
                                                const link = URL.createObjectURL(res.data)
                                                const a = document.createElement("a")
                                                a.href = link;
                                                a.download = msg.filename
                                                a.style.display = "none";
                                                document.body.append(a)
                                                a.click()
                                                URL.revokeObjectURL(res.data)
                                                a.remove()

                                            }}
                                        >
                                            <IoMdDocument />
                                            <div>{msg.filename}</div>
                                        </div>
                                    </div>
                                    :
                                    <video preload='none' src={"http://localhost:5000/" + msg.link} controls />

                    }
                </div>

            </MessageBox>
        );
    })
}

const MessageBox = styled.div`
    display: flex;
    /* align-items: center; */
    justify-content:${(props) => props.mode === "sended" ? "flex-end" : "flex-start"};
    width:100%;
    .message{
        max-width:40%;
        padding: 0.5rem 1rem .3rem 1rem;
        font-size:1.1rem;
        border-radius:.8rem;
        color:#112233;
        background-color: #fff;
        overflow-wrap:break-word;
        /* vertical-align: baseline; */
        line-height:1.5rem;
        
        br::selection{
            background-color: var(--purple);
        }
       
        .emoji{
            width:1.1rem;
            margin:0 1.5px;
        }
        .text{
            display: flex;
            align-items: center;
            ::selection{
            background-color: var(--purple);
        }
       
        }
        &.media{
        padding: 0.5rem;
        min-width:100px;
        max-height:200px;
        background-color: #ffffff33;
        }
        img{
            width:100%;
            object-fit:contain;
            height:100%;
            cursor: pointer;
            vertical-align: middle;
        }
        video{
            width:100%;
            vertical-align: middle;
        }
        .file>div{
            align-items: center;
            display: flex;
            cursor: pointer;
            svg{
                font-size:3rem;
                min-width:3rem;
                color:#ffffff;
                text-align: center;
            }
            div{
                line-height:1.2rem;
                /* width:70%; */
                font-size:1rem;
                color:var(--blue);
                padding-right:.5rem;
                word-break:break-word;
                /* overflow-wrap:break-word; */
            }

        }
    }
`

export default Messages;
