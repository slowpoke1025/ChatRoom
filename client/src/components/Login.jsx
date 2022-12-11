import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import brand from "../assets/brand.svg"
import FormContainer from "../style/FormContainer"
import { toast } from "react-toastify"
import { axiosAuth } from "../utils/AxiosInstance"
import { Button } from "../style/Button"

const Login = () => {

    const navigate = useNavigate()
    const [obj, setObj] = useState({
        email: "",
        password: "",
    })
    const handleChange = e => {
        setObj({ ...obj, [e.target.name]: e.target.value })
    }
    const handleSubmit = async e => {
        e.preventDefault();

        const { password, email } = obj;
        try {
            const res = await axiosAuth.post("/login", { password, email })
            if (!res.data.status)
                toast.error(res.data.message)
            else {
                const tid = toast.success(res.data.message)
                const { user } = res.data;
                localStorage.setItem("user", JSON.stringify(user))
                const dest = user.image === "" ? "/setAvatar" : "/chat"
                setTimeout(() => {
                    navigate(dest);
                    toast.dismiss(tid)
                }, 2000)
            }

        } catch (error) {
            toast.error("Login failed");
        }
    }

    useEffect(() => {
        if (localStorage.getItem("user"))
            navigate("/")
        //eslint-disable-next-line
    }, [])

    return (
        <FormContainer onSubmit={e => handleSubmit(e)}>
            <form autoComplete="off">
                <div className="brand">
                    <img src={brand} alt="" />
                    <h1>Login</h1>
                </div>
                <input
                    type="email"
                    placeholder="email"
                    name="email"
                    onChange={e => handleChange(e)}
                />
                <input
                    type="password"
                    placeholder="password"
                    name="password"
                    onChange={e => handleChange(e)}
                />
                <Button type="submit">Login</Button>
                <span>Do not have account ? <Link to="/register"> Register</Link></span>
            </form>
        </FormContainer>
    );
}

export default Login;

