const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String, default: "" },
    online: { type: Boolean, default: false }
})

module.exports.User = mongoose.model("User", userSchema, "User")