import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import TopMenu from "../Navbar/TopMenu";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import AddComments from "../Comments/AddComment";
import ViewComment from "../Comments/ViewComment";
import TopMenu1 from "../Navbar/TopMenu1";

const ViewSpecificPost = () => {
  const userData = useSelector((state) => {
    return state.users;
  });

  const [post, setPost] = useState(null); // Initialize as null

  const [added, setAdded] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/posts/viewSpecificPost/${id}`)
      .then((response) => {
        console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrr", response);
        const post = response.data.posts;
        console.log("---->", post);
        setPost(post);
      })
      .catch((error) => {
        console.error("Error fetching Post:", error);
      });
  }, []);

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

  const communityItemStyle = {
    cursor: "pointer",
    padding: "10px",
    border: "1px solid #ccc",
    marginBottom: "5px",
    borderRadius: "5px",
  };

  console.log("hamza", added);
  return (
    <div>
      <ToastContainer />
      <TopMenu1 />
      <div style={containerStyle}>
        <Card style={cardStyle}>
          <Card.Title style={headingStyle}>POSTS</Card.Title>
          <div>
            {post && ( // Use conditional rendering to check if post is not null
              <div style={communityItemStyle}>
                <h1>{post.postedBy.name}</h1>
                <p>{post.postText}</p>
                <div className="text-center mb-4">
                  <img
                    src={post.picture}
                    alt="Profile"
                    style={{ maxWidth: "500px" }}
                  />
                  <AddComments _id={id} setAdded={setAdded} />
                </div>
              </div>
            )}
            {!post && <p>Loading...</p>}
          </div>
          <ViewComment postId={id} added={added} />
        </Card>
      </div>
    </div>
  );
};

export default ViewSpecificPost;
