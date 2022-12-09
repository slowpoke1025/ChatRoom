const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema({
    chatroom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChatRoom",
        required: true
    },
    type: { type: String, enum: ["text", "image", "video", "file"], default: "text" },
    text: { type: String },
    link: { type: String },
    filename: { type: String },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    read: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        required: true
    }
}, { timestamps: true })

module.exports.Message = mongoose.model("Message", messageSchema, "Message")