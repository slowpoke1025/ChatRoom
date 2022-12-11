import styled from "styled-components"

const ChatRoomContainer = styled.div`
     display: flex;
    /* grid-template-rows:10% 75% 15%; */
    height:100%;
    overflow-y:hidden;   //KEY !!!!
    color: white;
    flex-direction: column;
    
    .chat-body{
        background-color: #8a5;
        position: relative;
        height:75%;
        padding:1rem 2rem;
        display: flex;
        flex-direction:column;
        gap:1rem;
        overflow-y:auto;
        overflow-x:hidden;
        box-sizing:border-box;
        &::-webkit-scrollbar {
            width: 0.4rem;
            &-thumb {
                background-color: #ffffff77;
                border-radius: 1rem;
            }
        }
        .img-display{
            overflow:hidden;
            position: absolute;
            inset:0;
            padding:2.5rem;
            background-color: #00000088;
            .close{
                position: absolute;
                top:2rem;
                right:2rem;
                transform:translate(50%,-50%);
                color:#ff0000;
                cursor: pointer;
                font-size:1.5rem;
                background-color: #fff;
                border-radius:50%;
                aspect-ratio:1/1;
                transition:all .3s;
                &:hover{
                    transform:scale(1.1) translate(50%,-50%);
                    transform-origin:center;
                }
            }
            img{
                width:100%;
                height:100%;
                object-fit:contain;
            }
        }
    }
    .chat-input{
        background-color: #8da5;
        min-height:10%;
        flex-grow:1;
        display: flex;
        align-items: center;
    }
    .chat-btns{
        display: flex;
        align-items: center;
        gap:1rem;
        .video-call{
            font-size:1.8rem;
            cursor: pointer;
            transition:all .3s;
            &:hover{
                color:#21bb21;
                margin-top:-.5rem;
             
            }
        }
    }
    .chat-header{
        display: flex;
        justify-content:space-between;
        align-items:center;
        padding:0 2rem;
        height:10%;
        flex-shrink:0;
        background-color: #ffde00;
        .chat-info{
            display: flex;
            align-items: center;
            gap:1rem;
        }
        .avatar{
            position: relative;
            img{
                width:3rem;
            }
            .online{
                position: absolute;
                width:1rem;
                aspect-ratio:1/1;
                background-color:#21bb21;
                border-radius:50%;
                bottom:0;
                right:0;
                &.off{
                    background-color:#eae2e2aa;
                }
            }
        }
        .username{
            color:white;
        }
    }
    
`



export default ChatRoomContainer;