import React, { useState } from "react";
import { Container, Card, Toast, Button, Form } from "react-bootstrap";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { Link } from "react-router-dom";
import TopMenu from "../Navbar/TopMenu";
import axios from "axios";
import { useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";

const ViewCommunity = () => {
  const [community, setCommunity] = useState({});
  const [name, setName] = useState("");

  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`http://localhost:5000/communities/readCommunity/${id}`)
      .then((response) => {
        console.log(response.data);
        const { community } = response.data;
        console.log("---->", community);
        setName(response.data.createdBy.name);
        console.log("Name--->", response.data.createdBy.name);
        setCommunity(community);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching community:", error);
        setLoading(false);
      });
  }, [id]);

  const AddPost = () => {
    navigate(`/addPost/${community._id}`);
  };

  const ViewPost = () => {
    navigate(`/viewPost/${community._id}`);
  };
  console.log("comm", community);

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

  return (
    <div>
      <ToastContainer />
      <TopMenu />
      <div style={containerStyle}>
        <Card style={cardStyle}>
          <Card.Title style={headingStyle}>{community.name}</Card.Title>
          <div className="text-center mb-4">
            <img
              src={community.picture}
              alt="Profile"
              className="rounded-circle img-fluid"
              style={{ maxWidth: "150px" }}
            />
          </div>

          <Card.Text>
            <strong>Community Name:</strong> {community.name}
            <br />
            <strong>Community Interest:</strong> {community.interest}
            <br />
            <strong>Created By:</strong> {name}
          </Card.Text>

          <div>
            <Button
              variant="primary"
              style={buttonStyle}
              onClick={() => AddPost()}
            >
              + CREATE POST
            </Button>
          </div>
          <div>
            <Button
              variant="primary"
              style={buttonStyle}
              onClick={() => ViewPost()}
            >
              + VIEW POSTS
            </Button>
            <Button variant="info" style={buttonStyle}>
              [-] POSTS
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ViewCommunity;
