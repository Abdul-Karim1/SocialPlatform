const express = require("express");
const app = express();
// const PORT = 4000;

// //New imports
// const http = require("http").Server(app);
// const cors = require("cors");

// app.use(cors());

// app.get("/api", (req, res) => {
//   res.json({
//     message: "Hello world",
//   });
// });

// http.listen(PORT, () => {
//   console.log(`Server listening on ${PORT}`);
// });

// const socketIO = require("socket.io")(http, {
//   cors: {
//     origin: "http://localhost:3000",
//   },
// });

// //Add this before the app.get() block
// const connect = socketIO.on("connection", (socket) => {
//   console.log(`⚡: ${socket.id} user just connected!`);

//   socket.on("disconnect", () => {
//     console.log("🔥: A user disconnected");
//   });
// });

// connect.emit("hello", "world");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected");
  });
};
