const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name:{
        type: String
    },
    interest:{
        type: String
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    passwordResetToken: {
        type: String,
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false
    },
  

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
