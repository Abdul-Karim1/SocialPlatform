const express = require("express");
const {
  createCommunity,
  deleteCommunity,
  readCommunity,
  updateCommunity,
  joinCommunity,
  readAllCommunities,
} = require("../Controllers/CommunityController");

const communityRouter = express.Router();

// Use POST for creating a new community
communityRouter.post("/createCommunity", createCommunity);

// Use DELETE for deleting a community
communityRouter.delete("/deleteCommunity/:id", deleteCommunity);

// Use GET for reading a community or communities
communityRouter.get("/readCommunity/:id", readCommunity);

// Use GET for reading all communities
communityRouter.get("/readAllCommunities", readAllCommunities);

// Use PUT or PATCH for updating a community
communityRouter.put("/updateCommunity/:id", updateCommunity);

// Use POST or PUT for joining a community (based on semantics)
communityRouter.post("/joinCommunity/:id", joinCommunity);
module.exports = communityRouter;
