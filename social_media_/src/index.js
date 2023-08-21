const bodyParser = require('body-parser')
const express = require('express')
const mongoose = require('mongoose')
const userRouter = require("./Routes/UserRoutes");
const app = express()
const jwt = require("jsonwebtoken");
const cors = require("cors");
const userModel = require("./Models/User");
var nodemailer = require('nodemailer');

app.use(cors());


mongoose.set("strictQuery", false);
app.use((req, res, next) => {
  console.log("HTTP METHOD -" + req.method + ",URL -" + req.url);
  next();
})
app.use(bodyParser.urlencoded({ extended: false }))


// app.use(bodyParser.json())
app.use(express.json());

mongoose.set("strictQuery", false);

app.get("/", (req, res) => {
  res.send("HELLO");
});

app.use("/users", userRouter);


mongoose.connect("mongodb+srv://admin:londoneye@cluster0.30rnjg1.mongodb.net/")
  .then(() => {
    app.listen(5000, () => {
      console.log("server started at port 5000");
    });
  })
  .catch((error) => {
    console.log(error);
  })

// app.post('/ForgotPassword', (req, res) => {
//   const { email } = req.body;
//   UserModel.findOne({ email: email })
//     .then(user => {
//       if (!user) {
//         return res.send({ Status: "User Not Existed" })
//       }
//       const token = jwt.sign({ id: user._id }, "jwt_secret_key", { expiresIn: "1d" })
//       console.log(token)

//       var transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//           user: 'leonydus.10@gmail.com',
//           pass: 'abdulkarim'
//         }
//       });

//       var mailOptions = {
//         from: 'leonydus.10@gmail.com',
//         to: 'akrajian1@gmail.com',
//         subject: 'Reset Your Password',
//         text: `http://localhost:5000/ForgotPassword/reset-password/${user._id}/${token}`
//       };

//       transporter.sendMail(mailOptions, function (error, info) {
//         if (error) {
//           console.log(error);
//         } else {
//           return res.send({ Status: "Success" })
//         }
//       });
//     })
// })