import { useNavigate } from "react-router-dom";
import { BiPowerOff } from "react-icons/bi";
import { LogoutButton } from "../style/LogoutButton"


const Logout = ({ socket }) => {
    const navigate = useNavigate()
    const handleClick = () => {
        socket.current.disconnect()
        localStorage.clear();
        navigate("/login");
        // navigate("/test")
    }
    return (
        <LogoutButton onClick={handleClick}>
            <BiPowerOff />
        </LogoutButton>
    )

}

export default Logout;
