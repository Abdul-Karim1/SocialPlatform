const userModel = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "MYAPI";
const Otp = require("../Models/otp");
var randomstring = require("randomstring");

const signup = async (req, res) => {
  try {
    const { name, email, password, interest } = req.body;

    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "User Already Exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    var result = await userModel.create({
      name: name,
      email: email,
      password: hashedPassword,
      interest: interest,
    });

    // const token = jwt.sign({ email: result.email, id: result._id }, SECRET_KEY);

    await Otp.deleteMany();
    let otpcode = Math.floor(Math.random() * 10000) + 1;
    let otpData = new Otp({
      email: req.body.email,
      code: otpcode,
      expireIn: new Date().getTime() + 300 * 1000,
    });
    await otpData.save();

    mailer(email, otpcode);

    res.status(201).json({ user: result }); // Send success response here
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" }); // Send error response here
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    var existingUser = await userModel.findOne({ email: email });
    if (!existingUser) {
      return res.status(404).json({ message: "USER NOT FOUND" });
    }
    const matchPassword = bcrypt.compareSync(password, existingUser.password);
    if (!matchPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    if (!existingUser.isVerified) {
      return res.status(400).json({ message: "User not Verified" });
    }

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      SECRET_KEY
    );
    console.log("token is ", token);

    existingUser.token = token;
    await existingUser.save();
    res.status(200).json({ user: existingUser });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

const changeLoggedInPassword = async (req, res) => {
  try {
    console.log("--------------------------", req.body);

    const { email, oldpassword, newpassword } = req.body;

    const response = {};

    let user = await userModel.findOne({ email });

    if (user) {
      const isOldPasswordValid = await bcrypt.compare(
        oldpassword,
        user.password
      );

      if (isOldPasswordValid) {
        const hashedPassword = await bcrypt.hash(newpassword, 10);
        user.password = hashedPassword;
        await user.save();
        response.message = "Password Changed Successfully";
        response.statusText = "success";
        console.log("Password changed successfully");
        return res.status(200).json(response);
      } else {
        response.message = "Old password is Incorrect";
        response.statusText = "error";
        console.log("Old password is incorrect");
        return res.status(401).json(response);
      }
    } else {
      response.message = "User not found";
      response.statusText = "error";
      console.log("User not found");
      return res.status(404).json(response);
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "An error occurred" });
  }
};

const emailSend = async (req, res) => {
  try {
    let data = await userModel.findOne({ email: req.body.email });

    console.log("data find", data);
    const responseType = {};
    if (data) {
      let otpcode = Math.floor(Math.random() * 10000) + 1;
      let otpData = new Otp({
        email: req.body.email,
        code: otpcode,
        expireIn: new Date().getTime() + 300 * 1000,
      });
      await Otp.deleteMany();
      let otpResponse = await otpData.save();
      responseType.statusText = "Success";
      mailer(req.body.email, otpcode);
      responseType.message = "Please Check your email id";
      res.status(200).json(responseType);
    } else {
      console.log("error exists");
      responseType.statusText = "Error";
      responseType.message = "Email Id does not exist !!!!";
      res.status(400).json(responseType);
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      statusText: "Error",
      message: "Internal Server Error",
    });
  }
};

const SignUpOtp = async (req, res) => {
  try {
    console.log("Received OTP verification request:", req.body);
    const data = await Otp.find({
      email: req.body.email,
      code: req.body.otpCode,
    });
    const response = {};

    console.log("Found OTP data:", data);

    if (data && data.length > 0) {
      const currentTime = new Date().getTime();
      const diff = data[0].expireIn - currentTime;

      if (diff < 0) {
        response.message = "Token has expired";
        response.statusText = "error";
        res.status(200).json(response);
      } else {
        const user = await userModel.findOne({ email: req.body.email });
        if (user) {
          user.isVerified = true;
          await user.save();
          response.message = "Email verification completed successfully";
          response.statusText = "Success";
          res.status(200).json(response);
        } else {
          response.message = "User not found";
          response.statusText = "error";
          res.status(404).json(response);
        }
      }
    } else {
      response.message = "Invalid OTP";
      response.statusText = "error";
      res.status(400).json(response);
      console.log(
        "Invalid OTP for email:",
        req.body.email,
        "and code:",
        req.body.otpCode
      );
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      statusText: "error",
      message: "Internal Server Error",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    console.log("--------------------------", req.body);
    let data = await Otp.find({
      email: req.body.email,
      code: req.body.otpCode,
    });
    const response = {};
    console.log("DAhhfhgfghfhgTA:", data);

    if (data && data.length > 0) {
      let currentTime = new Date().getTime();
      let diff = data[0].expireIn - currentTime;

      if (diff < 0) {
        response.message = "Token error";
        response.statusText = "error";
        res.status(200).json(response);
      } else {
        let user = await userModel.findOne({ email: req.body.email });
        if (user) {
          const hashedPassword = await bcrypt.hash(req.body.password, 10);
          user.password = hashedPassword;
          user.passwordResetToken = randomstring.generate(7);
          await user.save();
          response.message = "Password Changed Successfully";
          response.statusText = "success";
          res.status(200).json(response);
        } else {
          response.message = "User not found";
          response.statusText = "error";
          res.status(201).json(response);
        }
      }
    } else {
      response.message = "Invalid Otp";
      response.statusText = "error";
      res.status(400).json(response);
      console.log(req.body.email);
      console.log(req.body.otpCode);
    }
  } catch (e) {
    res.send("I-----------------------");
  }
};

const mailer = (email, otp) => {
  var nodemailer = require("nodemailer");
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "akrajian1@gmail.com", // Replace with your Gmail email
      pass: "lnscntvyhggycrgx", // Replace with your Gmail app-specific password or use a secure method
    },
  });

  var mailOptions = {
    from: "akrajian1@gmail.com", // Replace with your Gmail email
    to: email, // Use the recipient email passed as an argument
    subject: "OTP Code",
    text: `Your OTP code is: ${otp}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

const contextHandling = async (req, res, next) => {
  try {
    const userId = req.userId; // Assuming userId is the ObjectId string
    const user = await userModel.findOne({ _id: userId }); // Query using _id field
    if (!user) {
      return res.status(404).send("User not found");
    }
    return res.status(200).send(user);
  } catch (error) {
    console.error("An error occurred:", error);
    return res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  contextHandling,
  signup,
  signin,
  emailSend,
  changePassword,
  SignUpOtp,
  changeLoggedInPassword,
};
