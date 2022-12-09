const { Message } = require("../models/Message")
const mongoose = require("mongoose")

const addMessage = async (req, res, next) => {
    console.log(req.body)
    try {
        const { from, to, text } = req.body
        const data = await Message.create({
            chatroom: to,
            text: text,
            // users: [from, to],
            sender: from,
            // read: [from]
        })
        // console.log((await data.populate("sender", "username")))

        if (data) return res.json({ status: true, _id: data._id })

        return res.json({ status: false, msg: "failed" })

    } catch (error) {
        next(error)
    }
}
const addFile = async (req, res, next) => {
    try {
        console.log(req.file)
        console.log(req.body)
        const { from, to } = req.body
        let filename = req.file.originalname;
        const link = `${req.file.type}s/${req.file.filename}`;
        const data = await Message.create({
            sender: from,
            chatroom: to,
            type: req.file.type,
            link,
            filename
        })
        console.log("=============\n", data, "================\n")

        res.json({ _id: data._id, link, filename })
    } catch (error) {
        next(error)
    }
}

const getAllMessage = async (req, res, next) => {
    try {
        let cancel;
        req.socket.on("close", d => {
            cancel = true
        })
        const { from, to } = req.body;


        const msg = await Message.aggregate([
            { $match: { "chatroom": mongoose.Types.ObjectId(to) } },
            { $addFields: { "fromself": { $eq: ["$sender", mongoose.Types.ObjectId(from)] } } },
            { $project: { "__v": 0, "updatedAt": 0 } }
        ])

        const data = await Message.updateMany({ chatroom: to, sender: { $ne: from }, read: { $ne: from } }, { $push: { read: from } })

        if (cancel) return;
        if (data.modifiedCount !== 0) {
            io.of("/").sockets.get(onlineUsers.get(from)) // === io.sockets.sockets
                ?.to(to)
                .emit("read", req.body)
        }

        res.json(msg)


    } catch (error) {
        next(error)
    }
}

const readMessage = async (req, res, next) => {
    try {
        const { from, to } = req.body;
        // const resp = await Message.findByIdAndUpdate(msg, { $push: { read: from } })
        // console.log(resp)
        const data = await Message.updateMany({ chatroom: to, sender: { $ne: from }, read: { $ne: from } }, { $push: { read: from } })
        console.log(data)
        res.send(data);
    } catch (error) {
        next(error)
    }
}
module.exports = { addMessage, getAllMessage, addFile, readMessage }