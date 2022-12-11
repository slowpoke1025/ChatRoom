const { ChatRoom } = require("../models/ChatRoom");
const { Message } = require("../models/Message")


const setUpMessageListener = () => {
    Message
        .watch([], { fullDocument: "updateLookup" })
        .on("change", async (data) => {

            switch (data.operationType) {
                case "insert":
                    console.log("create")
                    const { _id, type, text, link, chatroom, sender, filename } = data.fullDocument;
                    const format = { _id, type, to: chatroom, from: sender, text, link, filename }
                    // console.log(await ChatRoom.findByIdAndUpdate(chatroom, { $set: { "lastMessage": _id } }))

                    // if (type === "text") {
                    io.of("/").sockets.get(onlineUsers.get(sender.toString())) // === io.sockets.sockets
                        ?.to(chatroom.toString())
                        .emit("receiveMessage", format)
                    console.log(format)

                    // } else {
                    //     io.of("/").sockets.get(onlineUsers.get(sender.toString())) // === io.sockets.sockets
                    //         ?.to(chatroom.toString())
                    //         .emit("receiveFile", {
                    //             link,
                    //             filename,
                    //             ...format
                    //         })
                    // }
                    break;
                case "update":
                    console.log("update")//data.updateDescription.updatedFields
            }
        })
}
module.exports = setUpMessageListener;