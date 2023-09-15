const mongoose = require("mongoose");

const NotificationSchema = mongoose.Schema(
  {
    notification: {
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

module.exports = mongoose.model("Notification", NotificationSchema);
