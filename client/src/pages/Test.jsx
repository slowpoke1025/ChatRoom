import React, { useEffect } from 'react';
import { Peer } from "peerjs";
import { useState } from 'react';
import { useRef } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { io } from "socket.io-client"
import { URL } from '../utils/AxiosInstance';
import { toast } from 'react-toastify';
import { MdCallEnd } from "react-icons/md"
import { IoMicOff, IoMic, IoVideocamOutline, IoVideocamOffOutline } from "react-icons/io5";

const VideoContainer = styled.div`
    box-sizing:border-box;
    width:100vw;
    height:100vh;
    overflow: hidden;
    background-color: #131324;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    .btns{
        position: absolute;
        left:0;
        top:0;
    }
    .videos{
       
       
       display: grid;
       grid-template-columns:1fr 1fr;
       gap:2rem;
      
    }
    .ribbon{
        background-color: var(--purple);
        padding:1.3rem;
        border-radius:10px;
        height:3.5rem;
        
        display: flex;
        flex-direction:column;
        justify-content: center;
        align-items: center;
        gap:.5rem;
        
        img{
            height:100%;
            
        }
        .name{
            color:#ffffff;
            font-size:1.3rem;
        }
    }
    .controls{
        background-color: #ffde00;
        grid-column:1/3;
        height:3rem;
        border-radius:10px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap:2rem;
        font-size:2rem;
        padding:.3rem 0;
        svg{
            padding:.3rem;
            cursor: pointer;
            background-color: #fff;
            border-radius:50%;
            transition:all .3s;
            &:hover{
                box-shadow:0 0 3px #333;
                scale:1.1;
            }
            &.close{
                color:#ef3215
            }
        }
       
    
    }
    video{
        box-sizing:border-box;
        width:100%;
        aspect-ratio:4/3;
        /* object-position:top; */
        object-fit:cover;
        border-radius:10px;
        border:5px solid #ffffff;
        background-color: #fff;
    }
   
`


const Test = () => {

    const state = useRef(useLocation().state)

    const [audio, setAudio] = useState(true)
    const [video, setVideo] = useState(true)

    const [peerID, setPeerID] = useState();
    const peerRef = useRef()
    const remoteRef = useRef()
    const localRef = useRef()
    const localStream = useRef()
    const remoteStream = useRef()
    const closeFunc = useRef()
    const navigate = useNavigate()
    const socket = useRef()
    useEffect(() => {
        if (state.current) {
            socket.current = io(URL)
            socket.current.emit("online", state.current.user._id)
            socket.current.on("reject", data => {
                console.log(data)
                localStream.current.getTracks().forEach(track => {
                    track.stop();
                })
                localRef.current.srcObject = null;
                const tid = toast.error("reject", { hideProgressBar: true })
                setTimeout(() => {
                    navigate("/chat", { state: { chat: state.current.chat } })
                    toast.dismiss(tid)
                }, 2000)
            })
            socket.current.on("videoClose", data => {
                alert("close", data)
                localStream.current.getTracks().forEach(track => {
                    track.stop();
                })
                remoteStream.current.getTracks().forEach(track => {
                    track.stop()
                })

                const tid = toast.error("close")
                setTimeout(() => {
                    navigate("/chat")
                    toast.dismiss(tid)
                }, 2000)
            })
        }

    }, [])
    const toggleVideo = () => {
        if (localStream.current) {
            console.log(remoteStream.current.getVideoTracks())
            localStream.current.getVideoTracks().forEach((track) => {
                track.enabled = !track.enabled

            })
            setVideo(video => !video)

        }
    }
    const toggleAudio = () => {
        if (localStream.current) {
            localStream.current.getAudioTracks().forEach((track) => {
                track.enabled = !track.enabled
            })
            setAudio(audio => !audio);
        }
    }
    const handleClose = () => {

        if (!closeFunc.current?.()) {
            socket.current.emit("cancelCall", { to: state.current.chat._id })
        }
        localStream.current.removeTrack()
        remoteStream.current.removeTrack()
        navigate("/chat")

    }
    useEffect(() => {

        console.log(state.current)
        const peer = new Peer(state.current.user._id, {
            host: "/",
            port: 3001
        });
        peerRef.current = peer;

        peer.on("open", id => {
            setPeerID(id)
            console.log(id)
        })

        /* answerRemotePeer */

        peer.on('call', function (call) {

            call.answer(localStream.current); // Answer the call with an A/V stream.

            call.on('stream', function (stream) {
                // console.log(remoteStream)
                remoteStream.current = stream
                remoteRef.current.srcObject = stream;
                remoteRef.current.onloadedmetadata = () => {
                    remoteRef.current.play()
                    console.dir(remoteRef.current)
                }

            });

            closeFunc.current = () => { call.close() }
            call.on("iceStateChanged", (state) => {
                console.log(state)
                console.dir(remoteRef.current)
            })
            call.on("close", () => {
                console.log("receiver close");
                socket.current.emit("videoClose", { to: state.current.chat.members[0]._id })

                localStream.current.getTracks().forEach(track => {
                    track.stop()
                })
                remoteStream.current.getTracks().forEach(track => {
                    track.stop()
                })
                navigate("/chat")
                // localRef.current.srcObject = null;
                // remoteRef.current.srcObject = null
            })
        });

        return () => peer.destroy()

    }, []);

    const callRemotePeer = async (remoteID) => {

        const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        getUserMedia({ video: true, audio: true },
            function (stream) {

                localStream.current = stream
                localRef.current.muted = true;
                localRef.current.srcObject = stream;
                localRef.current.onloadeddata = () => {
                    localRef.current.play();
                }
                const call = peerRef.current.call(remoteID, stream);
                closeFunc.current = () => { call.close() }
                call.on('stream', function (stream) {

                    remoteStream.current = stream
                    remoteRef.current.srcObject = stream;
                    remoteRef.current.onloadeddata = () => {
                        remoteRef.current.play()
                    }

                });
                call.on("iceStateChanged", (state) => {
                    console.log(state)
                })
                call.on("close", () => {
                    console.log("caller close")
                    socket.current.emit("videoClose", { from: state.current.user._id, to: state.current.chat.members[0]._id })
                    localStream.current.getTracks().forEach(track => {
                        console.log(track)
                        track.stop()
                    })
                    remoteStream.current.getTracks().forEach(track => {
                        track.stop()
                    })
                    navigate("/chat")
                    // localRef.current.srcObject = null;
                    // remoteRef.current.srcObject = null
                })
            },
            function (err) {
                console.log('Failed to get local stream', err)
            }
        )

    }
    useEffect(() => {
        if (!state.current) return
        if (state.current.flag === false)
            callRemotePeer(state.current.chat.members[0]._id)
        else {
            console.log("666")
            const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            getUserMedia({ video: true, audio: true },
                function (stream) {
                    localStream.current = stream
                    localRef.current.muted = true;
                    localRef.current.srcObject = stream;
                    localRef.current.onloadeddata = () => {
                        localRef.current.play();
                    }
                },
                function (err) {
                    console.log('Failed to get local stream', err)
                }
            )
        }
    }, [])

    return (
        <VideoContainer>



            <div className='videos'>
                <div className="ribbon my">
                    <img src={"data:image/svg+xml;base64," + state.current.user.image} alt="" />
                    <span className="name">{state.current.user.username}</span>
                </div>
                <div className="ribbon">
                    <img src={"data:image/svg+xml;base64," + state.current.chat.members[0].image} alt="" />
                    <span className="name">{state.current.chat.members[0].username}</span>

                </div>
                <video ref={localRef} poster={"data:image/svg+xml;base64," + state.current.user.image}></video>
                <video ref={remoteRef} poster={"data:image/svg+xml;base64," + state.current.chat.members[0].image}></video>
                <div className="controls">
                    {audio ? <IoMic onClick={toggleAudio} /> : <IoMicOff onClick={toggleAudio} />}
                    <MdCallEnd className='close' onClick={handleClose} />
                    {video ? <IoVideocamOutline onClick={toggleVideo} /> : <IoVideocamOffOutline onClick={toggleVideo} />}
                </div>
            </div>
        </VideoContainer>
    );
};




export default Test;
