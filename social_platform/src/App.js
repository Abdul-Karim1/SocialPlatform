import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FormSignUp from "./Component/FormSignUp";
import FormSignIn from "./Component/FormSignIn";
import ForgotPassword from "./Component/ForgotPassword";
import SignUpOtp from "./Component/SignUpOtp"; // Updated component name to start with capital letter
import Home from "./Component/home"; // Updated component name to start with capital letter
import UserProfile from "./Component/UserProfile";
import EditProfile from "./Component/EditProfile";
import ChangePassword from "./Component/ChangePassword";
import { useSelector } from "react-redux";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "./Store/Slices/UserSlices";

function App() {
  const dispatch = useDispatch();
  const token = localStorage.getItem("key");
  console.log("---", token);
  const data = useSelector((state) => {
    return state.users;
  });

  const getUser = async () => {
    const res = axios.get("http://localhost:5000/users//context-handling", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    console.log("IMP------------------->", data);
    dispatch(addUser(data));
  };

  useEffect(() => {
    if (token) {
      getUser();
    }
  });

  return (
    <Router>
      <Routes>
        <Route path="/SignUp" element={<FormSignUp />} />
        <Route path="/" element={<FormSignIn />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/OtpVerification" element={<SignUpOtp />} />
        <Route path="/UserProfile" element={<UserProfile />}></Route>
        <Route path="/EditProfile" element={<EditProfile />}></Route>
        <Route path="/ChangePassword" element={<ChangePassword />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
