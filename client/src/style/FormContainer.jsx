import styled from "styled-components"
const FormContainer = styled.div`
    height:100vh;
    width:100vw;
    display: flex;
    flex-direction:column;
    justify-content: center;
    align-items: center;
    gap:1rem;
    background-color: #131324;
    
    form{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction:column;
        background-color: #00000076;
        border-radius:2rem;
        padding:3rem 6rem;
        gap:2rem;
        input{
            background-color: rgba(0,0,0,0);
            padding:1rem;
            border:0.1rem solid var(--blue);
            border-radius:0.4rem;
            color:white;
            width:100%;
            font-size:1rem;
            &:focus{
                outline:none;
                border-color: var(--purple);
            }
        }
        /* button{
            background-color: var(--purple);
            color:#fff;
            padding:1rem 2rem;
            border: none;
            cursor: pointer;
            border-radius:0.4rem;
            font-size:1rem;
            font-weight: bold;
            text-transform: uppercase;
            transition:background-color 0.3s ease-in-out;
            &:hover{
                background-color: var(--blue);
            }
        } */
        span{
            color:#fff;
            text-transform: uppercase;
            font-weight: bold;
            font-size:.5rem;
            text-decoration:none;
        }
    }
    .brand{
        display: flex;
        justify-content: center;
        align-items: center;
        gap:1rem;
        user-select:none;
        &>img{
            height:5rem;
            -webkit-user-drag:none;
        }
        &>h1{
            color:#fff;
        }
    }

    
`
export default FormContainer;