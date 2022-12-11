const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { userRoutes } = require("./routes/userRoutes");
const { messageRoutes } = require("./routes/messageRoutes");
const fs = require('fs')
const app = express();
const socket = require("socket.io")

require("dotenv").config();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use('/images', express.static('images'));


const multer = require("multer");
const { chatRoomRoutes } = require("./routes/chatRoomRoutes");
const { ChatRoom } = require("./models/ChatRoom");
const { Message } = require("./models/Message");
const setUpMessageListener = require("./watchers/messageWatcher");

const { addFile } = require("./controllers/messageController");

const { v4: uuidv4 } = require('uuid');
const { response } = require("express");
const { User } = require("./models/User");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        file.type = file.mimetype.split("/")[0]
        if (file.type !== "image" && file.type !== "video")
            file.type = "file"

        cb(null, `public/${file.type}s`)
    },
    filename: function (req, file, cb) {
        file.originalname = Buffer.from(file.originalname, "latin1").toString("utf8");
        const ext = file.originalname.match(/\.([\w]*)$/)[0];
        const name = uuidv4() + ext
        cb(null, name);
    }
})

// const upload = multer({ dest: 'public/images' })
const upload = multer({ storage })

app.post("/upload", upload.single("file"), addFile)


app.use("/api/auth/", userRoutes);
app.use("/api/message/", messageRoutes);
app.use("/api/chatroom/", chatRoomRoutes)

app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message, status: false });
})

const server = app.listen(process.env.PORT, async () => {
    console.log("listen to " + process.env.PORT);
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("connect to MongoDB sucessfully");

    } catch (error) {
        console.log("connect to MongoDB failed");
    }
})


mongoose.connection.once("open", () => {
    setUpMessageListener();
    console.log("set")
})

global.io = socket(server, {
    cors: "*",
    credential: true
})
global.onlineUsers = new Map()
global.tmpUsers = new Set()
global.onlineRoom = new Set()

io.on("connection", socket => {
    global.currentSocket = socket

    socket.on("online", async (id) => {  //之後改成watcher

        console.log("online")


        onlineUsers.set(id, socket.id)
        socket.data.id = id;
        console.log(onlineUsers)
        console.log(onlineRoom)
        const flag = tmpUsers.has(id)
        // if (tmpUsers.has(id)) return tmpUsers.delete(id);
        await User.findByIdAndUpdate(id, { online: true })
        const rooms = await ChatRoom.find({ "members": id }).select("_id")
        rooms.forEach(room => {
            const roomId = room._id.toString()
            onlineRoom.add(roomId)
            socket.join(roomId)
            if (!flag) socket.to(roomId).emit("online", { user: id, room: roomId });
        })
        console.log(onlineUsers)
        console.log(onlineRoom)

    })


    socket.on("read", async (data) => {
        const { from, to } = data
        const res = await Message.updateMany({ chatroom: to, sender: { $ne: from }, read: { $ne: from } }, { $push: { read: from } }, { new: true })
        console.log(res)
        socket.to(to).emit("read", data)
    })
    socket.on("videoCall", (data, cb) => {
        const { from, to } = data
        socket.to(to).emit("videoCall", data)
    })
    socket.on("videoClose", (data) => {
        const { from, to } = data
        socket.to(onlineUsers.get(to)).emit("videoClose", data)
    })

    socket.on("reject", (data) => {
        const { from, to } = data
        socket.to(onlineUsers.get(to)).emit("reject", data)
    })
    socket.on("test", (data) => {
        console.log(data)
    })
    socket.on('disconnecting', () => {

        // console.log(io.sockets.adapter.rooms)
        socket.data.rooms = socket.rooms.keys();


        // console.log(onlineRoom)
        // const sockets = await io.in(room).fetchSockets() 取socket
    });

    socket.on('disconnect', () => {

        const id = socket.data.id;
        const rooms = socket.data.rooms;
        onlineUsers.delete(id)
        tmpUsers.add(id)
        console.log("disconnect")
        console.log(id)


        setTimeout(async () => {
            tmpUsers.delete(id);
            if (onlineUsers.has(id)) return;


            await User.findByIdAndUpdate(id, { online: false })


            for (let room of rooms) {
                socket.to(room).emit("offline", { user: id, room });
                onlineRoom.delete(room)
                console.log("offline")
            }
            console.log(onlineUsers)
            console.log(onlineRoom)
            // rooms.forEach(room => {

            //     if (io.sockets.adapter.rooms.has(room)) //加上自己
            //     {
            //         onlineRoom.delete(room)
            //     }
            // })
        }, 5000)
    });
})