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
    }
    .chat-input{
        background-color: #8da5;
        min-height:10%;
        flex-grow:1;
        display: flex;
        align-items: center;
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
            img{
                width:3rem;
            }
        }
        .username>h3{
            color:white;
        }
    }
    
`



export default ChatRoomContainer;