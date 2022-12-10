import React, { useEffect } from 'react';
import { DataConnection, Peer } from "peerjs";
import { useState } from 'react';
import { useRef } from 'react';
import styled from 'styled-components';


const VideoContainer = styled.div`
    margin:0 auto;
    width:80vw;
    height:100vh;
    justify-content: center;
    align-items: start;
    display: flex;
    gap:1rem;
    video{
        width:100%;
        height:100%;
        border:3px solid #333;
    }
`


const Test = () => {
    const [peerID, setPeerID] = useState();
    const peerRef = useRef()
    const remoteRef = useRef()
    const localRef = useRef()
    const localStream = useRef()
    const closeFunc = useRef()
    useEffect(() => {
        const peer = new Peer({
            secure: false
        });
        peerRef.current = peer;

        peer.on("open", id => {
            setPeerID(id)
            console.log(id)
        })
        peer.on("connection", dataConnection => {
            console.log(dataConnection)
        })
        /* answerRemotePeer */
        const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        peer.on('call', function (call) {
            console.log(call);
            getUserMedia({ video: true, audio: true }, function (stream) {
                localStream.current = stream
                localRef.current.muted = true;
                localRef.current.srcObject = stream;
                localRef.current.play();
                call.answer(stream); // Answer the call with an A/V stream.

                call.on('stream', function (remoteStream) {
                    // console.log(remoteStream)
                    remoteRef.current.srcObject = remoteStream;
                    remoteRef.current.onloadedmetadata = () => {
                        remoteRef.current.play()
                    }
                });

            }, function (err) {
                console.log('Failed to get local stream', err);
            });
            closeFunc.current = () => { call.close() }
            call.on("iceStateChanged", (state) => {
                console.log(state)
            })
            call.on("close", () => {
                console.log("receiver close")
            })
        });


        return () => peerRef.current.destroy()


    }, []);
    const callRemotePeer = (remoteID) => {

        const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        getUserMedia({ video: true, audio: true },
            function (stream) {
                localStream.current = stream
                localRef.current.muted = true;
                localRef.current.srcObject = stream;
                localRef.current.play();
                let rm;
                const call = peerRef.current.call(remoteID, stream);
                closeFunc.current = () => { call.close() }
                call.on('stream', function (remoteStream) {
                    // console.log(remoteStream)
                    rm = remoteStream
                    remoteRef.current.srcObject = remoteStream;
                    remoteRef.current.onloadeddata = () => {
                        remoteRef.current.play()
                    }

                });
                call.on("iceStateChanged", (state) => {
                    console.log(state)
                })
                call.on("close", () => {
                    console.log("caller close", rm)
                })
            },
            function (err) {
                console.log('Failed to get local stream', err)
            }
        )

    }

    const inputRef = useRef()
    return (
        <div>
            <input type="text" ref={inputRef} />
            <button onClick={() => callRemotePeer(inputRef.current.value)}>call</button>
            {peerID ?? "test"}
            <button onClick={() => {
                if (localStream.current && localStream.current.getTracks()) {
                    localStream.current.getVideoTracks().forEach((track) => {
                        track.enabled = !track.enabled
                    })
                    console.log(localStream.current.getVideoTracks())
                }
            }}>camera</button>
            <button onClick={() => {
                if (localStream.current && localStream.current.getTracks()) {
                    localStream.current.getAudioTracks().forEach((track) => {
                        track.enabled = !track.enabled
                    })
                    console.log(localStream.current.getVideoTracks())
                }
            }}>Audio</button>
            <button onClick={() => {
                closeFunc.current();
            }}>close</button>
            <VideoContainer>
                <video ref={localRef}></video>
                <video ref={remoteRef} src=""></video>
            </VideoContainer>
        </div>
    );
};




export default Test;
