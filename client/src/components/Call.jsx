import React from 'react';
import styled from 'styled-components';
import { BsFillTelephoneXFill, BsFillTelephoneInboundFill } from "react-icons/bs"
const Call = ({ accept, closeToast, reject, chat }) => {
    console.log(chat);
    return (
        <StyledCall>
            <div className="info">
                <img src={"data:image/svg+xml;base64," + chat.image} alt="" />
                <div className="name">{chat.username}</div>
            </div>
            <div className="btns">
                <BsFillTelephoneInboundFill className="accept" onClick={accept} />
                <BsFillTelephoneXFill className="reject" onClick={() => {
                    // reject()
                    closeToast()
                }} />
            </div>
        </StyledCall>
    );
}

const StyledCall = styled.div`
    display:flex;
    width:100%;
   
    
    .info{
        width:100%;
        text-align: center;
        img{
            width:40%;
        }
        .name{
            font-size:1.5rem;
        }
    }
    .btns{
        width:50%;
        font-size:1.8rem;
        display: flex;
        flex-direction:column;
        justify-content:space-around;
        svg{
            transition:all .3s;

            &:hover{
                scale:1.1;
            filter:drop-shadow(0 0 2px #555);

            }
        }
        .reject{
            color:#e53a3aed;
        }
        .accept{
            color:#11cb43;
        }
    }
`
export default Call;
