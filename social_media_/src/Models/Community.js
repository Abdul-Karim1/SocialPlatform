const mongoose = require("mongoose");
const User = require("./User");
const communitySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    interest: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Communities", communitySchema);
