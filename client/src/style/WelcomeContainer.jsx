import styled from "styled-components"

const WelcomeContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    flex-direction: column;
    background-color: #00000076;

    img {
        width: 20rem;
        /* max-width:80%; */
    }
    span {
        color: var(--blue);
    }
`



export default WelcomeContainer;