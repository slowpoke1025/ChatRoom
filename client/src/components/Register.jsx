import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import brand from "../assets/brand.svg"
import FormContainer from "../style/FormContainer"
import { toast } from "react-toastify"
import { axiosAuth } from "../utils/AxiosInstance"
import { Button } from "../style/Button"

const Register = () => {

    const navigate = useNavigate()
    const [obj, setObj] = useState({
        username: "",
        email: "",
        password: "",
        confirm_password: ""
    })
    const handleChange = e => {
        setObj({ ...obj, [e.target.name]: e.target.value })
    }
    const handleSubmit = async e => {
        e.preventDefault();
        if (handleValidate()) {

            const { password, username, email } = obj;
            try {
                const res = await axiosAuth.post("/register", { password, username, email })
                if (!res.data.status)
                    toast.error(res.data.message)
                else {
                    const tid = toast.success(res.data.message, { autoClose: false })
                    setTimeout(() => {
                        toast.dismiss(tid)
                        navigate("/login");
                    }, 2000)
                }

            } catch (error) {
                toast.error("register failed");
            }

        }
    }
    const handleValidate = (e) => {
        const { password, confirm_password, username } = obj;
        if (username.length < 2) {
            toast.error("username should be greater than 2 ch");
            return false;
        }
        if (password.length < 2) {
            toast.error("password should be greater than 2 ch");
            return false;
        }
        if (password !== confirm_password) {
            toast.error("password confirmed failed");
            return false;
        }
        return true
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
                    <h1>Register</h1>
                </div>

                <input
                    type="text"
                    placeholder="Username"
                    name="username"
                    onChange={e => handleChange(e)}
                />
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
                <input
                    type="password"
                    placeholder="confirm password"
                    name="confirm_password"
                    onChange={e => handleChange(e)}
                />

                <Button type="submit">Register</Button>
                <span>Already have account ? <Link to="/login"> Login</Link></span>
            </form>
        </FormContainer>
    );
}

export default Register;
