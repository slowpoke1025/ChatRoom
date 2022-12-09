import styled from "styled-components"

const ChatInputContainer = styled.div`
    width:100%;
    display: flex;
    /* grid-template-columns:5% auto; */
    align-items: center;
    padding:1rem;
    gap:.8rem;
    .button-container{
        display: flex;
        gap:.8rem;
    }
    .upload{
        cursor: pointer;
        input[type=file]{
            display: none;
        }
        svg{
            font-size:1.5rem;
            /* background-color: #00000033; */
        }
        &:hover svg{
            background-color: #00000033;
            border-radius:.3rem;
        }
        
    }
    @media screen and (min-width: 720px) and (max-width:1080px){}
    .emoji{
        width:20px;
    }
    .emoji-box{
        position: relative;
        text-align: center;
        svg{
            font-size:1.5rem;
            color:#ffff00c8;
            cursor: pointer;
        }
      
        .EmojiPickerReact{
            position: absolute;
            top:-400px;
            border:1.5px solid var(--purple);
            .epr-preview{
                display: none;
            }
            background-color: #080420;
            box-shadow:0 5px 10px var(--purple);
            .epr-body::-webkit-scrollbar{
                background-color: #080420;
                width:0.4rem;
                &-thumb{
                    background-color: var(--purple);
                    border-radius:1rem;
                }
            }
            --epr-emoji-size:25px;
        }
    }
`

export const Input = styled.div`
    position: relative;
     &:empty:not(:focus)::before{
        content:attr(placeholder);
        color:#ddd;
        position: absolute;
    }
    br::selection{
        background-color: var(--purple);
    }
    &::selection{
        background-color: var(--purple);
    }
    outline:none;
   
    /* background-color: #fff; */
    color:rgb(8, 2, 2);
    width:100%;
    box-sizing:border-box;
    min-height:1.5rem;
    max-height:6rem;
    overflow-y:auto;
    font-size:1.2rem;
    line-height:1.5rem;
    &::-webkit-scrollbar {
        width: 0.4rem;
        &-thumb {
            background-color: #33333377;
            border-radius: 1rem;
        }
    }
`
export const InputForm = styled.form`
    display: flex;
    /* background-color: #000; */
    gap:0.5rem;
    overflow-x: hidden;
    flex-grow:1;
    .input-box{
        /* width:92%; */
        flex:1 1 92%;
        display: flex;
        align-items: center;
        /* transition:all .5s; */
        padding: 0.5rem 1rem;
        border-radius:1.5rem;
        font-size:1.3rem;
        background-color: #fff;
        overflow-x: hidden;
      
        &:hover{
            width:150%;
        }
    }
    .send{
        /* width:8%; */
        flex:0 1 8%;
        svg{
            font-size:1.8rem;
        }
        display: flex;
        align-items:center;
        
        justify-content: center;
        /* align-self: end; */
        color:#fff;
        background-color: var(--purple);
        border-radius:1rem;
        border:none;
        transition:background-color 0.3s ease-in-out;
        cursor: pointer;
        &:hover{
            background-color: var(--blue);
        }
        @media screen and (min-width: 720px) and (max-width:1080px){
            padding:.3rem .5rem;
            /* align-self:center; */
            svg{
                font-size:1.3rem;
            }

        }
        @media screen and (min-width: 360px) and (max-width:480px){
            /* grid-template-columns:25% 75%; */
        }
    }
`

export default ChatInputContainer;