const { getAllChatRoom } = require("../controllers/ChatRoomController");


const router = require("express").Router();

router.post("/", getAllChatRoom);


module.exports.chatRoomRoutes = router