import React, { useState } from "react";
import { Container, Card, Toast, Button, Form } from "react-bootstrap";

import TopMenu from "../Navbar/TopMenu";
import axios from "axios";
import { useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const ViewPosts = () => {
  const userData = useSelector((state) => {
    return state.users;
  });
  const [posts, setPosts] = useState({});

  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`http://localhost:5000/posts/viewPost/${id}`)
      .then((response) => {
        console.log(response.data);
        const { posts } = response.data;
        console.log("---->", posts);

        setPosts(posts);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching Post:", error);
        setLoading(false);
      });
  }, []);

  const handleUpdateClick = (postId) => {
    console.log("Clicked on Post with ID:", postId);
    navigate(`/updatePost/${postId}`);
  };

  const handlePostClick = (postId) => {
    console.log("Clicked on post with ID:", postId);
    navigate(`/viewSpecificPost/${postId}`);
  };

  const handleDeleteClick = async (postId) => {
    try {
      const postIndex = posts.findIndex((post) => post._id === postId);

      // If the postIndex is found (not -1), remove the post from the array
      if (postIndex !== -1) {
        const updatedPosts = [...posts]; // Create a copy of the original array
        updatedPosts.splice(postIndex, 1); // Remove 1 element at the postIndex
        setPosts(updatedPosts); // Update the state with the updated array
      }
      const userReq = userData.user; // Make sure userData.user contains the user data including _id
      console.log("userdata-->", userReq);
      const response = await axios.delete(
        `http://localhost:5000/posts/deletePost/${postId}`,
        {
          data: userReq, // Pass user data in the 'data' property
        }
      );
      toast.success(response.data.message);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Handle 401 Unauthorized error with the message from the server
        toast.error("Unauthorized: " + error.response.data.message);
      } else {
        // Handle other errors
        toast.error("Error deleting community: " + error.message);
      }
    }
  };

  // const handleDeleteClick = (postId) => {
  //   console.log("Clicked on Post with ID:", postId);
  //   navigate(`/deletePost/${postId}`);
  // };
  const buttonStyle = {
    margin: "2rem ", // Add 1rem top and bottom margin
  };
  const containerStyle = {
    backgroundImage: "url(Image/picSignUp.jpg)",
    backgroundSize: "cover",
    minHeight: "calc(100vh - 56px)", // Adjust for navbar height
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0",
    margin: "0",
  };

  const cardStyle = {
    width: "80%",
    padding: "30px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
  };

  const headingStyle = {
    textAlign: "center",
    marginBottom: "20px",
  };

  const profileButtonStyle = {
    width: "100%",
  };

  const communityItemStyle = {
    cursor: "pointer",
    padding: "10px",
    border: "1px solid #ccc",
    marginBottom: "5px",
    borderRadius: "5px",
  };
  return (
    <div>
      <ToastContainer />
      <TopMenu />
      <div style={containerStyle}>
        <Card style={cardStyle}>
          <Card.Title style={headingStyle}>POSTS</Card.Title>
          <div>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div>
                {posts.map((post) => (
                  <div style={communityItemStyle}>
                    <h1>{post.postedBy.name}</h1>
                    <p>{post.postText}</p>
                    <div className="text-center mb-4">
                      <img
                        src={post.picture}
                        alt="Profile"
                        style={{ maxWidth: "500px" }}
                      />
                    </div>
                    <Button
                      variant="primary"
                      style={buttonStyle}
                      key={post._id}
                      onClick={() => handlePostClick(post._id)}
                    >
                      - VIEW POST
                    </Button>
                    <Button
                      variant="outline-danger"
                      style={buttonStyle}
                      key={post._id}
                      onClick={() => handleDeleteClick(post._id)}
                    >
                      Delete Post
                    </Button>
                    <Button
                      variant="outline-warning"
                      key={post._id}
                      onClick={() => handleUpdateClick(post._id)}
                      style={buttonStyle}
                    >
                      Update Post
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ViewPosts;
