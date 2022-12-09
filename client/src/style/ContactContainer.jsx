import styled from "styled-components"

const ContactContainer = styled.div`
    display: grid;
    grid-template-rows:10% 75% 15%;
    overflow: hidden;
    background-color: #080420;
    .brand{
        display:flex;
        align-items:center;
        justify-content: center;
        gap:.8rem;
        img{
            height:2rem;
        }
        h3{
            color:white;
            text-transform: uppercase;
        }
    }
    .contacts{
        /* margin:0 auto; */
        display: flex;
        flex-direction:column;
        align-items: center;
        overflow-y: auto;
        gap:0.8em;
        padding-bottom:0.8em;
        &::-webkit-scrollbar {
            width: 0.4rem;
            &-thumb {
                background-color: #ffffff77;
                border-radius: 1rem;
            }
        }
        .contact {
            background-color: #ffffff39;
            width:88%;
            min-height:4rem;
            cursor: pointer;
            padding: 0.4rem 0.8rem;
            display: grid;
            grid-template-columns:1fr 2fr 1fr;
            
            gap:1rem;
            align-items:center;
            justify-content: center;
            border-radius:0.2rem;
            transition:0.5s ease-in-out;
            .avatar {
                img {
                    width:100%;
                    min-width:3rem;
                    vertical-align: middle;
                }
                
            }
            .username{
                color:white;
                padding-left: 1rem;
                vertical-align: middle;
            }
            .unread{
                background-color: #ff0000dd;
                border-radius:50%;
                aspect-ratio:1/1;
                /* min-width:1rem; */
                width:1rem;
                padding:.1rem;
                display: flex;
                align-items: center;
                justify-content: center;
                /* margin-left:auto; */
                justify-self:center;
                
            }
            &.select{
                background-color: var(--purple);
            }
        }
        
    }
    .user{
            background-color: #0d0d30;
            display: flex;
            justify-content: center;
            align-items: center;
            gap:1.5rem;
            
            .avatar{
              img{
                height:3.5rem;
                max-width:100%;
              }
            }
            .username{
                color:#fff;
            }
            @media screen and (min-width: 720px) and (max-width: 1080px) {
                /* gap:0.8rem; */
                .username{
                    h2{
                        font-size:1rem;
                    }
                }
            }
        }
        
`



export default ContactContainer;