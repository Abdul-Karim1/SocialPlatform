const userModel = require("../Models/User");
const communityModel = require("../Models/Community");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "MYAPI";
var randomstring = require("randomstring");
const multer = require("multer");

//     name: {
//       type: String,
//       required: true,
//     },
//     interest: {
//       type: String,
//       required: true,
//     },
//     picture: {
//       type: String,
//     },
//     users: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//       },
//     ],
//   },

const createCommunity = async (req, res) => {
  try {
    const { name, interest, picture, users, createdBy } = req.body;

    const existingCommunity = await communityModel.findOne({ name: name });

    if (existingCommunity) {
      return res.status(400).json({ message: "Community already exists" });
    }

    const result = await communityModel.create({
      name: name,
      interest: interest,
      picture: picture,
      users: users,
      createdBy: createdBy,
    });

    res.status(201).json({ community: result }); // Send success response with the created community
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" }); // Send error response in case of an exception
  }
};

const deleteCommunity = async (req, res) => {
  const communityId = req.params.id;
  console.log("REQUEST DATA--->", req.body); // Access user data as req.body
  const user = req.body;
  try {
    const community = await communityModel.findOne({
      _id: communityId,
    });
    if (user._id !== community.createdBy.toString()) {
      return res.status(401).json({
        message: "Unauthorized user only admin can perform this operation",
      });
    }
    const deletedCommunity = await communityModel.findByIdAndDelete({
      _id: communityId,
    });

    if (!deletedCommunity) {
      return res.status(404).json({ message: "Community not found!!!" });
    }

    return res.status(200).json({ message: "Community deleted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred." });
  }
};

// const updateCommunity = async (req, res) => {
//   // PUT request to edit a community

//   const communityId = req.params.id;
//   const { name, interest, picture } = req.body;

//   try {
//     const updatedCommunity = await communityModel.findOne({
//       _id: communityId,
//     });

//     console.log("updTED", updateCommunity);

//     if (updatedCommunity) {
//       updatedCommunity.name = name;
//       updatedCommunity.interest = interest;
//       updatedCommunity.picture = picture;
//     }
//     await updatedCommunity.save();

//     if (!updatedCommunity) {
//       return res.status(404).json({ message: "Community not found!!!." });
//     }
//     res.status(200).json({ community: updatedCommunity });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "An error occurred." });
//   }
// };

const updateCommunity = async (req, res) => {
  // PUT request to edit a community

  const communityId = req.params.id;
  console.log(req.body.data);
  const { name, interest, picture, users } = req.body.data;

  console.log(name, interest, picture, users);

  try {
    const updatedCommunity = await communityModel.findOne({
      _id: communityId,
    });

    console.log("find", updatedCommunity);
    if (users._id !== updateCommunity.createdBy.toString()) {
      return res.status(401).json({
        message: "Unauthorized user only admin can perform this operation",
      });
    }

    if (updatedCommunity) {
      updatedCommunity.name = req.body.data.name || updateCommunity.name;
      updatedCommunity.interest =
        req.body.data.interest || updateCommunity.interest;
      updatedCommunity.picture =
        req.body.data.picture || updateCommunity.picture;
      await updatedCommunity.save().then((community) => {
        res.status(200).json({ community: community });
      });
    } else {
      return res.status(404).json({ message: "Community not found!!!" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred." });
  }
};

const readCommunity = async (req, res) => {
  const id = req.params.id;
  try {
    const community = await communityModel.findOne({ _id: id });
    console.log("------------------------------>", community.createdBy);

    // Assuming 'createdBy' is an ObjectId reference to a User
    const createdBy = await userModel.findById(community.createdBy);
    console.log("Created By--->", createdBy);

    res.status(200).json({ community, createdBy });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const readAllCommunities = async (req, res) => {
  try {
    const communities = await communityModel.find({});
    res.status(200).json({ communities });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const joinCommunity = async (req, res) => {
  const communityId = req.params.id;
  const userId = req.body.userId; // Assuming you send userId in the request body

  try {
    const community = await communityModel.findById(communityId);

    if (!community) {
      return res.status(404).json({ message: "Community not found!!!" });
    }

    // Check if user is already in the community
    if (community.users.includes(userId)) {
      return res
        .status(400)
        .json({ message: "User already in the community." });
    }
    console.log(userId);
    community.users.push(userId);
    await community.save();

    return res.status(200).json({ message: "User joined the community." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred." });
  }
};

module.exports = {
  createCommunity,
  deleteCommunity,
  updateCommunity,
  readCommunity,
  joinCommunity,
  readAllCommunities,
};
