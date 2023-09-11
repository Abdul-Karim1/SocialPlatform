import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FormSignUp from "./Pages/Registeration/FormSignUp";
import FormSignIn from "./Pages/Registeration/FormSignIn";
import ForgotPassword from "./Pages/Registeration/ForgotPassword";
import SignUpOtp from "./Pages/Registeration/SignUpOtp";
import UserProfile from "./Pages/Profile/UserProfile";
import EditProfile from "./Pages/Profile/EditProfile";
import ChangePassword from "./Pages/Profile/ChangePassword";
import { useSelector } from "react-redux";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "./Store/Slices/UserSlices";
import PageNotFound from "./Pages/Profile/PageNotFound";
import AddCommunity from "./Pages/Community/AddCommunity";
import ViewCommunity from "./Pages/Community/ViewCommunity";
import CommunityViewAll from "./Pages/Community/CommunityViewAll";
import UpdateCommunity from "./Pages/Community/UpdateCommunity";
import AddPosts from "./Pages/Posts/AddPosts";
import ViewPosts from "./Pages/Posts/ViewPosts";
import UpdatePost from "./Pages/Posts/UpdatePost";
import AddComment from "./Pages/Comments/AddComment";
import ViewSpecificPost from "./Pages/Posts/ViewSpecificPost";
import UpdateComment from "./Pages/Comments/UpdateComment";
import ViewInterestedCommunity from "./Pages/Profile/ViewInterestedCommunity";

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
            <Route path="/addCommunity" element={<AddCommunity />} />
            <Route path="/viewCommunity/:id" element={<ViewCommunity />} />
            <Route path="/viewAllCommunity" element={<CommunityViewAll />} />
            <Route path="/updateCommunity/:id" element={<UpdateCommunity />} />
            <Route
              path="/viewInterestedCommunity"
              element={<ViewInterestedCommunity />}
            />
            <Route path="/addPost/:id" element={<AddPosts />} />
            <Route path="/viewPost/:id" element={<ViewPosts />} />
            <Route
              path="/viewSpecificPost/:id"
              element={<ViewSpecificPost />}
            />

            <Route path="/updatePost/:id" element={<UpdatePost />} />
            <Route path="/createComment/:id" element={<AddComment />} />
            <Route path="/updateComment/:id" element={<UpdateComment />} />
            {/* <Route path="/updateCommen/:id" element={<UpdateComment />} /> */}
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
