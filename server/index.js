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

app.post("/read", async (req, res, next) => {
    const { id } = req.body
    try {
        const contacts = await ChatRoom.aggregate([
            {
                $match: { members: mongoose.Types.ObjectId(id) }
            },
            {
                $lookup: {
                    from: "Message",
                    localField: "_id",
                    foreignField: "chatroom",
                    as: "messages",
                    pipeline: [
                        {
                            $match: {
                                read: { $ne: mongoose.Types.ObjectId(id) },
                                // sender: { $ne: mongoose.Types.ObjectId(id) }
                            }
                        },
                        {
                            $sort: { "_id": 1 }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    "messages": { $last: "$messages" },
                    "unread": {
                        $size: {
                            $filter: {
                                input: "$messages",
                                as: "msg",
                                cond: { $ne: ["$$msg.sender", mongoose.Types.ObjectId(id)] }
                            }
                        }
                    }
                }
            }
        ])
        const resp = await User.populate(contacts, { path: "members", select: "-password -__v", match: { _id: { $ne: id } } })
        res.json(resp)
        // const users = await ChatRoom.find({ "members": id })
        //     .populate({ path: "members", select: "-password", match: { _id: { $ne: id } } });
        // res.json(users)
    } catch (error) {
        next(error)
    }


})
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
global.onlineRoom = new Set()
io.on("connection", socket => {
    global.currentSocket = socket

    socket.on("online", async (id) => {
        if (onlineUsers.has(id)) return
        onlineUsers.set(id, socket.id)
        socket.data.id = id;
        const rooms = await ChatRoom.find({ "members": id }).select("_id")
        rooms.forEach(room => {
            const roomId = room._id.toString()
            onlineRoom.add(roomId)
            socket.join(roomId)
            socket.to(roomId).emit("online", { user: id, room: roomId });
        })
        console.log(onlineUsers)
        console.log(onlineRoom)
    })

    // socket.on("addMessage", (data, cb) => {
    //     const { from, to, message, _id } = data
    //     console.log(data)
    //     cb()
    //     socket.to(to).emit("receiveMessage", data)
    // })
    socket.on("read", async (data) => {
        const { from, to } = data
        const res = await Message.updateMany({ chatroom: to, sender: { $ne: from }, read: { $ne: from } }, { $push: { read: from } }, { new: true })
        console.log(res)
        socket.to(to).emit("read", data)
    })
    socket.on('disconnecting', () => {
        console.log(socket.rooms.size)
        // console.log(io.sockets.adapter.rooms)
        socket.rooms.forEach(room => {
            if (io.sockets.adapter.rooms.get(room).size === 1)
                onlineRoom.delete(room)
        })
        console.log(onlineRoom)
        // const sockets = await io.in(room).fetchSockets()
    });

    socket.on('disconnect', () => {
        console.log(socket.rooms.size)
        onlineUsers.delete(socket.data.id)
        console.log("disconnect")
        console.log(onlineUsers)
    });
})