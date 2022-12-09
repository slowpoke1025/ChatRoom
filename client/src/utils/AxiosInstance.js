import axios from "axios"
export const URL = "http://localhost:5000"
export const axiosInstance = axios.create({
    baseURL: URL
})

export const axiosFile = axios.create({
    baseURL: URL,
    headers: {
        "Content-Type": "multipart/form-data"
    }
})
export const axiosContact = axios.create({
    baseURL: `${URL}/api/chatroom/`
})
export const axiosAuth = axios.create({
    baseURL: `${URL}/api/auth`
})
export const axiosSet = axios.create({
    baseURL: `${URL}/api/auth/set`
})
export const axiosGet = axios.create({
    baseURL: `${URL}/api/auth/get`
})

export const axiosMsg = axios.create({
    baseURL: `${URL}/api/message`
})