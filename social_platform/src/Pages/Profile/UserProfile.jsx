import React, { useState } from "react";
import { Container, Card, Toast, Button, Form } from "react-bootstrap";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { Link } from "react-router-dom";
import TopMenu from "../Navbar/TopMenu";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav"; // Import Nav

import { useDispatch } from "react-redux";

import { resetUser } from "../../Store/Slices/UserSlices";
import Navbar from "react-bootstrap/Navbar";

const UserProfile = () => {
  const data = useSelector((state) => {
    return state.users;
  });

  console.log("loggenInUser", data);

  const [selectedFile, setSelectedFile] = useState(null);
  const [successToast, setSuccessToast] = useState(false);
  const [errorToast, setErrorToast] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    // Dispatch the action to reset user data
    dispatch(resetUser());
    navigate("/"); // Redirect to the desired route after logout
  };
  const ChangePassword = () => {
    navigate("/ChangePassword");
  };
  const AddCommunity = () => {
    navigate("/addCommunity");
  };
  const ViewInterestedCommunity = () => {
    navigate("/viewInterestedCommunity");
  };
  const ViewAllCommunities = () => {
    navigate("/viewAllCommunity");
  };
  const buttonStyle = {
    margin: "3rem ", // Add 1rem top and bottom margin
    padding: "1rem",
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const allowedFileTypes = ["image/jpeg", "image/png"];

    if (file && allowedFileTypes.includes(file.type)) {
      setSelectedFile(file);
      setSuccessToast(true);
      setErrorToast(false);
    } else {
      setErrorToast(true);
      setSuccessToast(false);
    }
  };
  const handleUpload = () => {
    const formdata = new FormData();
    formdata.append("file", selectedFile);
    formdata.append("email", data.user.email);
    console.log("data email------------->", data.user.email);

    axios
      .post("http://localhost:5000/upload", formdata)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <Navbar className="bg-body-tertiary justify-content-between">
        <Nav>
          <Button variant="danger" className="mr-3" onClick={handleLogout}>
            Log Out
          </Button>
        </Nav>
      </Navbar>

      <div style={containerStyle}>
        <Card style={cardStyle}>
          <Card.Title style={headingStyle}>{data?.user?.name}</Card.Title>
          <div className="text-center mb-4">
            <img
              src={
                "http://localhost:5000/" + data?.user?.picture
                // selectedFile
                //   ? URL.createObjectURL(selectedFile)
                //   : data.user.profileImage
              }
              alt="Profile"
              className="rounded-circle img-fluid"
              style={{ maxWidth: "150px" }}
            />
          </div>
          {/* <Form.Group controlId="profilePicture">
            <Form.Label>Choose Profile Picture</Form.Label>
            <Form.Control
              type="file"
              accept=".jpg, .jpeg, .png"
              onChange={handleFileChange}
            />
          </Form.Group>
          <button onClick={handleUpload}>Upload</button>
          <br /> */}
          <Card.Text>
            <strong>Name:</strong> {data?.user?.name}
            <br />
            <strong>Interest:</strong> {data?.user?.interest}
            <br />
            <strong>Email:</strong> {data?.user?.email}
          </Card.Text>
          {errorToast && (
            <Toast onClose={() => setErrorToast(false)}>
              <Toast.Header>
                <strong className="me-auto">Error</strong>
              </Toast.Header>
              <Toast.Body>
                Invalid file type. Please choose a JPEG or PNG image.
              </Toast.Body>
            </Toast>
          )}
          {successToast && (
            <Toast onClose={() => setSuccessToast(false)}>
              <Toast.Header>
                <strong className="me-auto">Success</strong>
              </Toast.Header>
              <Toast.Body>File uploaded successfully.</Toast.Body>
            </Toast>
          )}
          <div className="d-grid gap-2">
            <Link
              to="/EditProfile"
              variant="primary"
              className="btn btn-primary"
              style={profileButtonStyle}
            >
              Edit Profile
            </Link>
          </div>
          <br />
          <Button variant="warning" className="mr-3" onClick={ChangePassword}>
            Change Password
          </Button>
          <br />
          <div>
            <Button
              variant="primary"
              style={buttonStyle}
              onClick={AddCommunity}
            >
              + CREATE COMMUNITY
            </Button>

            <Button
              variant="info"
              style={buttonStyle}
              onClick={ViewAllCommunities}
            >
              [--] COMMUNITIES
            </Button>
            <Button
              variant="info"
              style={buttonStyle}
              onClick={ViewInterestedCommunity}
            >
              [$] YOUR INTERESTS
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
