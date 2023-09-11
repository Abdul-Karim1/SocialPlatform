const communityModel = require("../Models/Community");
const chatModel = require("../Models/Chat");
const commentModel = require("../Models/Comment");

const createChatMessage = async (req, res) => {
  const community_id = req.params.id;
  try {
    console.log(req.body);
    const { message, user } = req.body;
    console.log(req.body);

    // Check if the user is a member of the community
    const userId = user._id;
    const community = await communityModel
      .findById(community_id)
      .populate("users");
    console.log("-->", community);

    const isUserInCommunity = community.users.some((user) =>
      user._id.equals(userId)
    );
    console.log("CHECK--->>", isUserInCommunity);

    if (!community || !isUserInCommunity) {
      return res.status(400).json({
        message:
          "User cannot send the message. Join the community to post Messages.",
        error: "User not found in the community",
      });
    }

    const chat = await chatModel.create({
      user: user,
      message: message,
      community: community,
    });

    await chat.save();

    return res.status(201).json(chat);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

const readChatMessage = async (req, res) => {
  const community_id = req.params.id;
  try {
    const chat = await chatModel
      .find({ community: community_id })
      .populate("user");
    console.log("------------------------------>", chat);
    res.status(200).json({ chat });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const deleteChatMessage = async (req, res) => {
  const chatId = req.params.id;
  console.log("REQUESTed DATA--->", req.body); // Access user data as req.body
  const user = req.body.user;
  console.log("bbbbbbbb", user);
  try {
    const chat = await chatModel.findOne({
      _id: chatId,
    });

    console.log("chat--->", chat);
    console.log("userId--->", user._id);
    console.log("haha-->", chat.user.toString());
    console.log("MATCH:", user._id !== chat.user.toString());

    if (user._id !== chat.user._id.toString()) {
      return res.status(401).json({
        message:
          "Unauthorized: Only the user who had messaged can perform this action.",
      });
    }

    console.log("chatID-->", chatId);

    const deletedChat = await chatModel.findByIdAndDelete(chatId); // Use chatId directly

    console.log("DELETED CHAT", deletedChat);

    if (!deletedChat) {
      return res.status(404).json({ message: "CHAT not found!!!" });
    }

    return res.status(200).json({ message: "CHAT deleted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred." });
  }
};

module.exports = {
  createChatMessage,
  readChatMessage,
  deleteChatMessage,
};
