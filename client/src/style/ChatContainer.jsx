import styled from "styled-components"

const ChatContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction:column;
    gap:1rem;
    background-color: #131324;
    height:100vh;
    width:100vw;
    *{
        /* box-sizing: border-box; */
    }
    .container{
        height:85%;
        width:85%;
        /* background-color: #00000076; */
        color:#fff;
        display: grid;
        grid-template-columns:25% 75%;
        gap:1.5rem;
        @media screen and (min-width: 720px) and (max-width:1080px){
            grid-template-columns:35% 65%;

        }
        @media screen and (min-width: 360px) and (max-width:480px){
            /* grid-template-columns:25% 75%; */
        }
    }
    .avatars{
        display: flex;
        justify-content: center;
        align-items: center;
        gap:2rem;
        border:1px solid #fff;
        .avatar{
            width:6rem;
            border:.4rem solid #00000000;
            cursor: pointer;
            padding:0.4rem;
            border-radius:50%;
            transition:0.5s ease-in-out;
            &:hover{
            border:0.4rem solid #11e01f;

            }
            &.selected{
            border:0.4rem solid var(--blue);

            }
        }
    }

`



export default ChatContainer;