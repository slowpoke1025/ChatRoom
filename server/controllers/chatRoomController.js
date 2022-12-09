const { ChatRoom } = require("../models/ChatRoom")
const { User } = require("../models/User")
const mongoose = require("mongoose")
const getAllChatRoom = async (req, res, next) => {

    // const { id } = req.params
    // try {
    //     const users = await ChatRoom.find({ "members": id })
    //         .populate({ path: "members", select: "-password", match: { _id: { $ne: id } } });
    //     res.json(users)
    // } catch (error) {
    //     next(error)
    // }

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
                        // {
                        //     $match: {
                        //         read: { $ne: mongoose.Types.ObjectId(id) },
                        //         // sender: { $ne: mongoose.Types.ObjectId(id) }
                        //     }
                        // },
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
                                cond: {
                                    $and: [{ $ne: ["$$msg.read", [mongoose.Types.ObjectId(id)]] }, //KEY
                                    { $ne: ["$$msg.sender", mongoose.Types.ObjectId(id)] }
                                    ]
                                },
                                as: "msg",
                            }
                        }
                    }

                }
            }
        ])
        const resp = await User.populate(contacts, { path: "members", select: "-password -__v", match: { _id: { $ne: id } } })
        res.json(resp)

    } catch (error) {
        next(error)
    }
}

module.exports = { getAllChatRoom }