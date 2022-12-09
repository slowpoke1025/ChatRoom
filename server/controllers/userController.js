const { User } = require("../models/User")
const bcrypt = require("bcrypt")
const { ChatRoom } = require("../models/ChatRoom")

const register = async (req, res, next) => {
    console.log(req.body)
    const { username, email, password } = req.body
    try {
        if (await User.exists({ username }))
            return res.json({ status: false, message: "username exists" })
        if (await User.exists({ email }))
            return res.json({ status: false, message: "email exists" })

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({ ...req.body, password: hashedPassword })

        /******************************************************************** */
        try {
            const users = await User.find({ _id: { $ne: user._id } }).select("_id")
            users.map(async u => {
                if (true || Math.random() >= 0.5) {
                    const chatroom = await ChatRoom.create({ members: [user._id, u._id] })
                }

            })

        } catch (error) {
            console.log("error.message")
            return next(error)
        }

    } catch (error) {
        console.log(error.message)
        return next(error)
    }


    res.json({ status: true, message: "Register successfully" })
}

const login = async (req, res, next) => {
    console.log(req.body)
    const { email, password } = req.body

    try {
        const user = await User.findOne({ email })
        if (!user)
            return res.json({ status: false, message: "User doesn't exist" })
        if (!bcrypt.compareSync(password, user.password))
            return res.json({ status: false, message: "wrong password" })

        res.json({ status: true, message: "Login successfully", user })
    } catch (error) {
        next(error)
    }
}
const avatar = async (req, res, next) => {

    const { id } = req.params
    const { image } = req.body

    try {
        const user = await User.findByIdAndUpdate(id, { image })
        res.json({ status: true, message: "avatar is set successfully" })
    } catch (error) {
        next(error)
    }
}
const getAllUser = async (req, res, next) => {

    const { id } = req.params
    console.log("hi")
    try {
        const users = await User.find({ _id: { $ne: id } }).select("-password")
        console.log(users)
        res.json(users)
    } catch (error) {
        next(error)
    }
}

module.exports = { register, login, avatar, getAllUser }