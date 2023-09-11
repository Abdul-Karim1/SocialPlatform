const express = require("express");
const chatRouter = express.Router();
const {
  createChatMessage,
  readChatMessage,
  deleteChatMessage,
} = require("../Controllers/ChatController");

chatRouter.post("/createChatMessage/:id", createChatMessage);
chatRouter.get("/readChatMessage/:id", readChatMessage);
chatRouter.delete("/deleteChatMessage/:id", deleteChatMessage);

module.exports = chatRouter;
