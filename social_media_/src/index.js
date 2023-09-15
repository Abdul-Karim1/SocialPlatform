const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./Routes/UserRoutes");
const communityRouter = require("./Routes/CommunityRoutes");
const postRouter = require("./Routes/PostRoutes");
const commentRouter = require("./Routes/CommentRoutes");
const chatRouter = require("./Routes/ChatRoutes");
const notificationRouter = require("./Routes/NotificationRoutes");
const app = express();
const jwt = require("jsonwebtoken");
const cors = require("cors");
const userModel = require("./Models/User");
var nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
const communityModel = require("./Models/Community");

const http = require("http");
const server = http.createServer(app);

//console.log("hello join", path.join(__dirname, "/public/Images"));

app.use(express.static(path.join(__dirname, "/public/Images")));
//console.log("hello join-->", __dirname);
mongoose.set("strictQuery", false);
app.use((req, res, next) => {
  //console.log("HTTP METHOD -" + req.method + ",URL -" + req.url);
  next();
});
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());

mongoose.set("strictQuery", false);

app.get("/", (req, res) => {
  res.send("HELLO");
});
// Configure CORS middleware for Express app
const corsOptions = {
  origin: (origin, callback) => {
    // console.log("--->aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");

    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
      console.log("--->aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    } else {
      callback(new Error("Not allowed by CORS"));
      console.log("--->aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    }
  },
};
// Apply CORS middleware to your Express app
app.use(cors(corsOptions));

app.use("/users", userRouter);
app.use("/communities", communityRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);
app.use("/chats", chatRouter);
app.use("/notifications", notificationRouter);

const io = require("socket.io")(server);

// Define allowed origins for CORS
const allowedOrigins = ["http://localhost:3000"]; // Add your allowed origins here

mongoose
  .connect("mongodb+srv://admin:londoneye@cluster0.30rnjg1.mongodb.net/")
  .then(() => {
    global.globalServer = server.listen(5000, () => {
      console.log("server started at port 5000");
    });
    console.log("----->", globalServer);
    console.log("Server----->", server);
    io.on("connection", (socket) => {
      console.log("a user connected");

      // Apply CORS middleware for Socket.io
      socket.on("new-message", (data, callback) => {
        const origin = data.headers.origin;
        console.log("ABCDEFGHIJKLM-->", origin);
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
          callback({ allowed: true });
        } else {
          callback({ allowed: false });
        }
      });

      socket.on("disconnect", () => {
        console.log("user disconnected");
      });
    });
  })
  .catch((error) => {
    console.log(error);
  });

global.mySocket = require("socket.io")(server, {
  cors: {
    credentials: true,
    origin: function (origin, callback) {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      // console.log("ORIGIN", origin);
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  },
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
  //console.log("file name is :", req.file);

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
      //console.log(err);
      res.status(500).json({ message: "An error occurred." }); // Internal server error
    });
});

app.post("/uploadCommunity", upload.single("file"), (req, res) => {
  if (req.file) {
    const filename = req.file.filename;
    //console.log("File name is:", filename);

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
