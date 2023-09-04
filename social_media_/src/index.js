const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./Routes/UserRoutes");
const communityRouter = require("./Routes/CommunityRoutes");
const postRouter = require("./Routes/PostRoutes");
const app = express();
const jwt = require("jsonwebtoken");
const cors = require("cors");
const userModel = require("./Models/User");
var nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
const communityModel = require("./Models/Community");

app.use(cors());
console.log("hello join", path.join(__dirname, "/public/Images"));

app.use(express.static(path.join(__dirname, "/public/Images")));
console.log("hello join-->", __dirname);
mongoose.set("strictQuery", false);
app.use((req, res, next) => {
  console.log("HTTP METHOD -" + req.method + ",URL -" + req.url);
  next();
});
app.use(bodyParser.urlencoded({ extended: false }));

// app.use(bodyParser.json())
app.use(express.json());

mongoose.set("strictQuery", false);

app.get("/", (req, res) => {
  res.send("HELLO");
});

app.use("/users", userRouter);
app.use("/communities", communityRouter);
app.use("/posts", postRouter);

mongoose
  .connect("mongodb+srv://admin:londoneye@cluster0.30rnjg1.mongodb.net/")
  .then(() => {
    app.listen(5000, () => {
      console.log("server started at port 5000");
    });
  })
  .catch((error) => {
    console.log(error);
  });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/public/Images");
  },
  filename: (req, file, cb) => {
    const filename = Date.now() + path.extname(file.originalname);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({
  storage: storage,
});
app.post("/upload", upload.single("file"), (req, res) => {
  const { email } = req.body;
  const picture = req.file.filename;
  console.log("file name is :", req.file);

  userModel
    .findOneAndUpdate(
      { email }, // Matching user with the provided email
      { $set: { picture } }, // Updating the user's picture field
      { new: true, upsert: false } // Return the updated user and don't create a new user if not found
    )
    .then((result) => {
      if (result) {
        res.json(result); // User found and updated
      } else {
        res.status(404).json({ message: "User not found." }); // User not found
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "An error occurred." }); // Internal server error
    });
});

app.post("/uploadCommunity", upload.single("file"), (req, res) => {
  if (req.file) {
    const filename = req.file.filename;
    console.log("File name is:", filename);

    // Return the filename in the response
    const fileUrl = "http://localhost:5000/" + filename;
    res.json(fileUrl);
  } else {
    res.status(400).json({ message: "No file uploaded." });
  }
});

app.post("/uploadLoggedIn", upload.single("file"), (req, res) => {
  if (req.file) {
    const imageName = req.file.filename;
    res.json({ imageName });
  } else {
    res.status(400).json({ message: "No file uploaded." });
  }
});
