import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FormSignUp from "./Component/FormSignUp";
import FormSignIn from "./Component/FormSignIn";
import ForgotPassword from "./Component/ForgotPassword";
import SignUpOtp from "./Component/SignUpOtp"; // Updated component name to start with capital letter
import Home from "./Component/home"; // Updated component name to start with capital letter
import UserProfile from "./Component/UserProfile";
import EditProfile from "./Component/EditProfile";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/SignUp" element={<FormSignUp />} />
        <Route path="/" element={<FormSignIn />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/OtpVerification" element={<SignUpOtp />} />
        <Route path="/UserProfile" element={<UserProfile />}></Route>
        <Route path="/EditProfile" element={<EditProfile />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
