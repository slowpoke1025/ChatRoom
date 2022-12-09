const mongoose = require("mongoose")

const chatroomSchema = new mongoose.Schema({
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    isGroup: { type: Boolean, default: false },
    // lastMessage: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Message",
    // }
})

module.exports.ChatRoom = mongoose.model("ChatRoom", chatroomSchema, "ChatRoom")