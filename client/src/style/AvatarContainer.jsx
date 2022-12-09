import styled from "styled-components"

const AvatarContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction:column;
    gap:3rem;
    background-color: #131324;
    height:100vh;
    width:100vw;
    .title{
        & > h1{
            color:#fff;
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



export default AvatarContainer;