const mongoose = require("mongoose");

const ChatSchema = mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Communities",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", ChatSchema);
