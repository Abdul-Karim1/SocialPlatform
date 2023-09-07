import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const ViewComment = ({ postId, added }) => {
  const userData = useSelector((state) => state.users);

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  console.log("comments in view component", comments);

  console.log("added in view componts", added);

  const handleUpdateClick = (commentId) => {
    console.log("Clicked on Comment with ID:", commentId);
    navigate(`/updateComment/${commentId}`);
  };

  const handleDeleteClick = async (commentId) => {
    try {
      const commentIndex = comments.findIndex(
        (comment) => comment._id === commentId
      );

      if (commentIndex !== -1) {
        const updatedComments = [...comments];
        updatedComments.splice(commentIndex, 1);
        setComments(updatedComments);
      }

      const userReq = userData.user;
      console.log("userdata-->", userReq);
      const response = await axios.delete(
        `http://localhost:5000/comments/deleteComment/${commentId}`,
        {
          data: userReq,
        }
      );
      toast.success(response.data.message);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Unauthorized: " + error.response.data.message);
      } else {
        toast.error("Error deleting Comment: " + error.message);
      }
    }
  };

  const buttonStyle = {
    margin: "2rem ",
  };

  const containerStyle = {
    backgroundImage: "url(Image/picSignUp.jpg)",
    backgroundSize: "cover",
    minHeight: "calc(100vh - 56px)",
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

  useEffect(() => {
    axios
      .get(`http://localhost:5000/comments/readComment/${postId}`)
      .then((response) => {
        console.log("RESPONSEEEEEEEEEEEEEEEE--->", response);
        const { comments } = response.data;
        console.log("COMMENTTTTTTTTTTTTTTT---->", comments);
        setComments(comments);
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch((error) => {
        console.error("Error fetching Comment:", error);
        setLoading(false); // Set loading to false in case of an error
      });
  }, [postId, added]);

  return (
    <div>
      <div style={containerStyle}>
        <Card style={cardStyle}>
          <Card.Title style={headingStyle}>COMMENTS</Card.Title>
          <div>
            {!comments ? (
              <p>No comments available.</p>
            ) : (
              <div>
                {comments.map((comment, index) => (
                  <div style={communityItemStyle} key={comment._id}>
                    <h1>{comment.user.name}</h1>
                    <p>{comment.text}</p>

                    <Button
                      variant="outline-danger"
                      style={buttonStyle}
                      key={comment._id}
                      onClick={() => handleDeleteClick(comment._id)}
                    >
                      Delete Comment
                    </Button>
                    <Button
                      variant="outline-warning"
                      key={comment._id}
                      onClick={() => handleUpdateClick(comment._id)}
                      style={buttonStyle}
                    >
                      Update Comment
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

export default ViewComment;
