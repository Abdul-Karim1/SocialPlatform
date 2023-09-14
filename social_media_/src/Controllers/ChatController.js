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
    mySocket.emit("new-message", "Check");

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
  const user = req.body.user;

  try {
    const chat = await chatModel.findOne({
      _id: chatId,
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found." });
    }

    if (user._id.toString() !== chat.user.toString()) {
      return res.status(401).json({
        message:
          "Unauthorized: Only the user who sent the message can delete it.",
      });
    }

    const deletedChat = await chatModel.findByIdAndDelete(chatId);

    if (!deletedChat) {
      return res
        .status(500)
        .json({ message: "Failed to delete the chat message." });
    }

    return res
      .status(200)
      .json({ message: "Chat message deleted successfully." });
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
