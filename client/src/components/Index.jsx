import { Link } from "react-router-dom"

const Index = () => {
    return (
        <ul>
            <Link className="index" to="/register">register </Link>
            <Link className="index" to="/login">login </Link>
            <Link className="index" to="/chat">chat </Link>
            <Link className="index" to="/setAvatar">setAvatar </Link>
            <Link className="index" to="/test">test </Link>
            <Link className="index" onClick={() => localStorage.removeItem("user")}>logout </Link>
        </ul>
    );
}

export default Index;
