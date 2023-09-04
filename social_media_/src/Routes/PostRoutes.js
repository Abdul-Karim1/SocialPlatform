const express = require("express");
const {
  createPost,
  deletePost,
  viewPost,
  updatePost,
  viewAllPost,
} = require("../Controllers/PostController");

const postRouter = express.Router();

// Use POST for creating a new community
postRouter.post("/createPost", createPost);

// Use DELETE for deleting a community
postRouter.delete("/deletePost/:id", deletePost);

// Use GET for reading a community or communities
postRouter.get("/viewPost/:id", viewPost);

// Use GET for reading all communities
postRouter.get("/viewAllPost", viewAllPost);

// Use PUT or PATCH for updating a community
postRouter.put("/UpdatePost/:id", updatePost);

module.exports = postRouter;
