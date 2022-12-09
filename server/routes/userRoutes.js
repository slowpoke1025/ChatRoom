const { register, login, avatar, getAllUser } = require("../controllers/userController");

const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.post("/set/avatar/:id", avatar);
router.get("/get/users/:id", getAllUser);


module.exports.userRoutes = router