import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import loader from "../assets/loader.gif"
import { toast } from "react-toastify"
import { axiosSet } from "../utils/AxiosInstance"
import axios from "axios"
import { Buffer } from "buffer"
import AvatarContainer from "../style/AvatarContainer"
import { Button } from "../style/Button"
import { FiRefreshCw } from "react-icons/fi"
const SetAvatar = () => {
    const [avatars, setAvatars] = useState([])
    const [loading, setLoading] = useState(true)
    const [select, setSelect] = useState();
    const [refresh, setRefresh] = useState(0)
    const navigate = useNavigate()
    const handleSelect = async () => {
        if (select == null)
            return toast.error("Please select an avater")

        const user = await JSON.parse(localStorage.getItem("user"))

        try {
            const res = await axiosSet.post(`/avatar/${user._id}`, { image: avatars[select] })
            if (res.data.status) {
                user.image = avatars[select];
                localStorage.setItem("user", JSON.stringify(user))
                const tid = toast.success(res.data.message)

                setTimeout(() => {
                    toast.dismiss(tid)
                    navigate("/chat");
                }, 2000)
            }
        } catch (error) {
            toast.error("please reset again")
        }
    }

    useEffect(() => {
        if (!localStorage.getItem("user")) {
            return navigate("/login")
        }
    })
    useEffect(() => {
        async function getAvatar() {
            const data = []
            for (let i = 0; i < 4; i++) {
                try {
                    const id = Math.floor(Math.random() * 100000)
                    const res = await axios.get(`https://api.multiavatar.com/${id}.svg?apikey=LJ5oe6RIifbl1H`)
                    data.push(new Buffer(res.data).toString("base64"))
                } catch (error) {

                    toast.error("Network failed")
                    break;
                }
            }

            setAvatars(data)
            setLoading(false);
        }
        getAvatar()
    }, [refresh])


    return (
        <AvatarContainer>
            {loading ? <img src={loader} alt="" /> : (
                <>
                    <div className="title">
                        <h1>Pick an avatar as your profile picture</h1>
                    </div>
                    <div className="avatars">
                        {avatars.map((avt, i) => <img
                            key={i}
                            className={`avatar ${select === i ? "selected" : ""}`}
                            onClick={() => setSelect(i)}
                            src={`data:image/svg+xml;base64,${avt}`} alt="" />)}

                    </div>
                    <div className="btns">
                        <Button
                            className="submit-btn"
                            onClick={handleSelect}
                        >
                            Set as Profile Picture
                        </Button>
                        <FiRefreshCw onClick={() => {
                            setRefresh(n => n + 1)
                            setLoading(true)
                        }} />
                    </div>
                </>
            )}
        </AvatarContainer>
    );
}

export default SetAvatar;
