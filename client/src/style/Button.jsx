import styled from "styled-components"

export const Button = styled.button`
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
`