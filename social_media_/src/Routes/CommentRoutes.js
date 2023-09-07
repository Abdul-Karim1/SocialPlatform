const express = require("express");
const commentRouter = express.Router();
const {
  createComment,
  readComment,
  updateComment,
  deleteComment,
  readSpecificComment,
} = require("../Controllers/CommentController");

commentRouter.post("/createComment/:id", createComment);
commentRouter.get("/readComment/:id", readComment);
commentRouter.get("/readSpecificComment/:id", readSpecificComment);
commentRouter.put("/updateComment/:id", updateComment);
commentRouter.delete("/deleteComment/:id", deleteComment);

module.exports = commentRouter;
