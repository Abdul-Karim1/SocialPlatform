import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FormSignUp from "./Pages/Registeration/FormSignUp";
import FormSignIn from "./Pages/Registeration/FormSignIn";
import ForgotPassword from "./Pages/Registeration/ForgotPassword";
import SignUpOtp from "./Pages/Registeration/SignUpOtp";
import UserProfile from "./Pages/UserProfile";
import EditProfile from "./Pages/EditProfile";
import ChangePassword from "./Pages/ChangePassword";
import { useSelector } from "react-redux";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "./Store/Slices/UserSlices";
import PageNotFound from "./Pages/PageNotFound";

function App() {
  const dispatch = useDispatch();

  const token = localStorage.getItem("key");
  console.log("TOKEN ON APP.JS--->", token);
  const data = useSelector((state) => state.users || null);
  console.log("USER DATA APP", data);

  const getUser = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/users/context-handling",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = res.data;
      console.log("IMP------------------->", data);
      dispatch(addUser(data));
    } catch (error) {
      console.error("An error occurred:", error);
      // Handle the error as needed
    }
  };

  useEffect(() => {
    if (token) {
      getUser();
    }
  }, []);

  return (
    <Router>
      <Routes>
        {token && (
          <>
            <Route path="/UserProfile" element={<UserProfile />} />
            <Route path="/EditProfile" element={<EditProfile />} />
            <Route path="/ChangePassword" element={<ChangePassword />} />
          </>
        )}
        {!token && (
          <>
            <Route path="/SignUp" element={<FormSignUp />} />
            <Route path="/" element={<FormSignIn />} />
            <Route path="/ForgotPassword" element={<ForgotPassword />} />
            <Route path="/OtpVerification" element={<SignUpOtp />} />
          </>
        )}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
