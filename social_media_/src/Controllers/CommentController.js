const userModel = require("../Models/User");
const CommentController = require("../Models/Comment");
const communityModel = require("../Models/Community");
const Post = require("../Models/Post");
const commentModel = require("../Models/Comment");

const createComment = async (req, res) => {
  try {
    console.log(req.body);
    const { text, user, post } = req.body;
    console.log(req.body);

    // Check if the user is a member of the post's community
    const userId = user._id;
    const postCommunity = await Post.findOne({ _id: post }).populate(
      "community"
    );
    console.log("-->", postCommunity);
    console.log("IMP---->", postCommunity.community[0].users.includes(userId));

    if (!postCommunity || !postCommunity.community[0].users.includes(userId)) {
      return res.status(400).json({
        message:
          "User cannot post a comment. Join the community to post comments.",
      });
    }

    const comment = await commentModel.create({
      user: user,
      text: text,
      post: post,
    });

    await comment.save();

    return res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const readComment = async (req, res) => {
  const id = req.params.id;
  try {
    const comments = await commentModel.find({ post: id }).populate("user");

    console.log("------------------------------>", comments);
    res.status(200).json({ comments });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const readSpecificComment = async (req, res) => {
  const commentId = req.params.id;
  try {
    const comment = await commentModel
      .findOne({ _id: commentId })
      .populate("user");

    console.log("------------------------------>", comment);
    res.status(200).json({ comment });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const deleteComment = async (req, res) => {
  const commentId = req.params.id;
  console.log("REQUESTed DATA--->", req.body); // Access user data as req.body
  const user = req.body;
  try {
    const comment = await commentModel.findOne({
      _id: commentId,
    });
    console.log("comment--->", comment);
    console.log("userId--->", user._id);
    console.log("haha-->", comment.user.toString());
    console.log("MATCH:", user._id !== comment.user.toString());

    if (user._id !== comment.user._id.toString()) {
      return res.status(401).json({
        message:
          "Unauthorized: Only the user who had commented can perform this action.",
      });
    }
    console.log("commentID-->", commentId);
    const deletedComment = await commentModel.findByIdAndDelete({
      _id: commentId,
    });
    console.log("DELETED POST", deletedComment);
    if (!deletedComment) {
      return res.status(404).json({ message: "Comment not found!!!" });
    }

    return res.status(200).json({ message: "Comment deleted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred." });
  }
};

const updateComment = async (req, res) => {
  // PUT request to edit a post

  const commentId = req.params.id;
  const { data, userData } = req.body; // Destructure the data object directly

  console.log("req", req.body.data);
  console.log("___>", data, userData);

  try {
    const updatedComment = await commentModel
      .findOne({ _id: commentId })
      .populate("user");

    // console.log("Updated-------------", updatedPost);
    console.log("Updated", userData);

    // Check if the post exists
    if (!updatedComment) {
      return res.status(404).json({ message: "Comment not found!!!" });
    }

    // Check if the user making the request is the creator of the post
    if (userData.user._id.toString() !== updatedComment.user._id.toString()) {
      return res.status(401).json({
        message:
          "Unauthorized user, only the comment creator can edit the comment",
      });
    }

    // Update post data
    updatedComment.text = data.text || updatedComment.text;

    // Save the updated post
    const savedComment = await updatedComment.save();

    // Send the updated post as a response
    res.status(200).json({ comment: savedComment });
  } catch (error) {
    console.error("----------------", error);
    res.status(500).json({ message: "An error occurred." });
  }
};

module.exports = {
  createComment,
  readComment,
  updateComment,
  deleteComment,
  readSpecificComment,
};
