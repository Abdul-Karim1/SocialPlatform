const userModel = require("../Models/User");
const communityModel = require("../Models/Community");
const postModel = require("../Models/Post");

const createPost = async (req, res) => {
  try {
    // console.log("reqBody", req.body);
    const { postText, picture, postedBy, community } = req.body;

    const existingCommunity = await communityModel.findOne({
      _id: community,
    });

    const userId = postedBy._id;

    const userExistsInCommunity = existingCommunity.users.some(
      (communityUserId) => communityUserId.toString() === userId
    );

    console.log("user exist", userExistsInCommunity);

    if (!userExistsInCommunity) {
      return res
        .status(400)
        .json({ message: "First join the community to post in the community" });
    }

    const result = await postModel.create({
      postText: postText,
      picture: picture,
      postedBy: postedBy,
      community: community,
    });

    res.status(201).json({ community: result }); // Send success response with the created community
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" }); // Send error response in case of an exception
  }
};

const deletePost = async (req, res) => {
  const postId = req.params.id;
  console.log("REQUEST DATA--->", req.body); // Access user data as req.body
  const user = req.body;
  try {
    const post = await postModel.findOne({
      _id: postId,
    });
    console.log("post--->", post);
    console.log("userId--->", user._id);
    console.log("MATCH:", user._id !== post.postedBy.toString());

    if (user._id !== post.postedBy.toString()) {
      return res.status(401).json({
        message:
          "Unauthorized: Only the user who posted this can perform this action.",
      });
    }
    console.log("postID-->", postId);
    const deletedPost = await postModel.findByIdAndDelete({
      _id: postId,
    });
    console.log("DELETED POST", deletedPost);
    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found!!!" });
    }

    return res.status(200).json({ message: "Post deleted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred." });
  }
};

const viewPost = async (req, res) => {
  const id = req.params.id;
  try {
    const posts = await postModel.find({ community: id }).populate("postedBy");

    console.log("------------------------------>", posts);
    res.status(200).json({ posts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const viewAllPost = async (req, res) => {
  return res.status(200).send("UPDATE POST METHOD");
};

const updatePost = async (req, res) => {
  // PUT request to edit a post

  const postId = req.params.id;
  const { data, userData } = req.body; // Destructure the data object directly

  console.log("req", req.body.data);
  console.log("___>", data, userData);
  // console.log("----->PT", postText);
  // console.log("---->PIC", picture);
  // console.log("---->USER", user);

  try {
    const updatedPost = await postModel
      .findOne({ _id: postId })
      .populate("postedBy");

    // console.log("Updated-------------", updatedPost);
    console.log("Updated", userData);

    // Check if the post exists
    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found!!!" });
    }

    // Check if the user making the request is the creator of the post
    if (userData.user._id.toString() !== updatedPost.postedBy._id.toString()) {
      return res.status(401).json({
        message: "Unauthorized user, only the post creator can edit the post",
      });
    }

    // Update post data
    updatedPost.postText = data.postText || updatedPost.postText;
    updatedPost.picture = data.picture || updatedPost.picture;

    // Save the updated post
    const savedPost = await updatedPost.save();

    // Send the updated post as a response
    res.status(200).json({ post: savedPost });
  } catch (error) {
    console.error("----------------", error);
    res.status(500).json({ message: "An error occurred." });
  }
};

module.exports = { createPost, deletePost, viewPost, updatePost, viewAllPost };
