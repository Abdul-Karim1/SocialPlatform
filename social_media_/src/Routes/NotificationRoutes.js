const express = require("express");
const notificationRouter = express.Router();
const {
  createNotification,
  readNotifications,
  updateNotification,
  deleteNotification,
} = require("../Controllers/NotificationController");

notificationRouter.post("/createNotification", createNotification);
notificationRouter.get("/readNotification", readNotifications);
notificationRouter.put("/updateNotification/:id", updateNotification);
notificationRouter.delete("/deleteNotification/:id", deleteNotification);
module.exports = notificationRouter;
