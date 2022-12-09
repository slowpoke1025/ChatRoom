import { useEffect, useState } from "react";


import robot from "../assets/robot.gif"
import WelcomeContainer from "../style/WelcomeContainer";


const Welcome = ({ user }) => {
    const [username, setUserName] = useState()
    useEffect(() => {
        setUserName(user?.username)
    }, [user])
    return (
        username && <WelcomeContainer>
            <img src={robot} alt="" />
            <h1>
                Welcome, <span>{username}</span> !
            </h1>
            <h3>Please select a chat to Start messaging.</h3>
        </WelcomeContainer>
    )

}

export default Welcome;
