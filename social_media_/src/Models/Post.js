const mongoose = require("mongoose");

const PostSchema = mongoose.Schema(
  {
    postText: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    community: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Communities",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
