const { addMessage, getAllMessage, readMessage } = require("../controllers/messageController");

const router = require("express").Router();

router.post("/addMessage", addMessage);
router.post("/getMessage", getAllMessage);
router.post("/readMessage", readMessage)


module.exports.messageRoutes = router