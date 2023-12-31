import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import { Row, Col, Nav } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS
import { Form } from "react-bootstrap";
import TopMenu from "../Navbar/TopMenu";
import axios from "axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import TopMenu1 from "../Navbar/TopMenu1";
const AddCommunity = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userData = useSelector((state) => {
    return state.users;
  });
  const dummy = {
    name: "",
    interest: "",
    picture: "",
    users: "",
    createdBy: "",
  };
  const [selectedFile, setSelectedFile] = useState(null);
  const [data, setData] = useState(dummy);
  const [errField, setErrField] = useState({
    nameErr: "",
    interestErr: "",
    pictureErr: "",
  });

  const validForm = (fieldName) => {
    let formIsValid = true;

    switch (fieldName) {
      case "name":
        if (data.name === "") {
          formIsValid = false;
          setErrField((prevState) => ({
            ...prevState,
            nameErr: "Please Enter the Name of Community",
          }));
        } else {
          setErrField((prevState) => ({
            ...prevState,
            nameErr: "",
          }));
        }

        break;

      case "interest":
        if (data.interest === "") {
          formIsValid = false;
          setErrField((prevState) => ({
            ...prevState,
            interestErr: "Please Enter Community Interest",
          }));
        } else {
          setErrField((prevState) => ({
            ...prevState,
            interestErr: "",
          }));
        }
        break;

      case "picture":
        if (data.interest === "" && !selectedFile) {
          formIsValid = false;
          setErrField((prevState) => ({
            ...prevState,
            pictureErr: "Please Choose Image",
          }));
        } else {
          setErrField((prevState) => ({
            ...prevState,
            pictureErr: "",
          }));
        }
        break;
    }

    return formIsValid;
  };
  function handle(e) {
    const newData = { ...data };
    newData[e.target.id] = e.target.value;
    setData(newData);
    console.log(newData);
  }
  const isFormValid = () => {
    return !(
      errField.interestErr.length === 0 &&
      errField.nameErr.length === 0 &&
      errField.pictureErr.length === 0
    );
  };

  const styleOb = {
    height: "100vh",
    backgroundImage: "url(Image/picSignUp.jpg)",
    backgroundSize: "cover",
    alignItems: "center",
    justifyContent: "center",
    padding: "180px",
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const allowedFileTypes = ["image/jpeg", "image/png"];

    if (file && allowedFileTypes.includes(file.type)) {
      setSelectedFile(file);

      const formdata = new FormData();
      formdata.append("file", file);

      axios
        .post("http://localhost:5000/uploadCommunity", formdata)
        .then((res) => {
          console.log("File uploaded successfully:", res.data);

          // Save the fileUrl from the response in a variable
          const uploadedFileUrl = res.data;
          console.log("hfhfyhfh", uploadedFileUrl);

          const updatedData = {
            ...data,
            users: userData.user,
            createdBy: userData.user,
            picture: uploadedFileUrl,
          };
          setData(updatedData);
          // You can use the uploadedFileUrl as needed, for example, to display the image
          // on your page.
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
          // Handle error
        });
    }
  };

  // const handleUpload = (event) => {
  //   event.preventDefault();
  //   const formdata = new FormData();
  //   formdata.append("file", selectedFile);

  //   axios
  //     .post("http://localhost:5000/uploadLoggedIn", formdata)
  //     .then((res) => {
  //       const updatedData = { ...data, picture: res.data.imageName }; // Assuming the response has a property 'imageName'
  //       setData(updatedData);
  //     })
  //     .catch((err) => console.log(err));
  // };
  const handleUpdate = (event) => {
    if (validForm()) {
      event.preventDefault();

      axios
        .post("http://localhost:5000/communities/createCommunity", data)
        .then((res) => {
          console.log("COMMUNITY DATA", data);
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "New Community has been created",
            showConfirmButton: false,
            timer: 1500,
          });

          navigate("/viewAllCommunity");
          // Assuming ShowForm is a function to update the form state

          // You can remove the alert here since you're using toast for notifications
          // alert("DATA ADDED, Check Your Email for verification");
        })
        .catch((error) => {
          if (error.response) {
            const errorMessage = error.response.data.message;
            toast.error(errorMessage); // Display an error toast with the error message from the backend
          } else {
            toast.error("An error occurred. Please try again."); // Display a generic error toast
          }
        });
    } else {
      toast.error("INVALID FORM"); // Display an error toast for an invalid form
    }
  };

  return (
    <div>
      <TopMenu1 />
      <ToastContainer />
      <Container fluid style={styleOb}>
        <Row>
          <Col></Col>
          <Col>
            {" "}
            <h1>CREATE NEW COMMUNITY</h1>
            <br />
            <Form onSubmit={handleUpdate}>
              <Form.Label htmlFor="name">Name</Form.Label>
              <Form.Control
                type="text"
                onKeyUp={() => validForm("name")}
                onBlur={() => validForm("name")}
                id="name"
                onChange={(e) => handle(e)}
                value={data.name}
                placeholder={"Enter Community Name"}
              />
              {errField.nameErr.length > 0 && (
                <span className="error" style={{ color: "red" }}>
                  {errField.nameErr}
                </span>
              )}
              <br />
              <Form.Label htmlFor="interest">Interest</Form.Label>
              <Form.Select
                id="interest"
                value={data.interest}
                onKeyUp={() => validForm("interest")}
                onBlur={() => validForm("interest")}
                onChange={(e) => handle(e)}
              >
                <option value="">{"SELECT YOUR INTEREST"}</option>
                <option value="gaming">Gaming</option>
                <option value="books">Books</option>
                <option value="cars">Cars</option>
              </Form.Select>
              {errField.interestErr.length > 0 && (
                <span className="error" style={{ color: "red" }}>
                  {errField.interestErr}
                </span>
              )}
              <br />

              <Form.Group controlId="profilePicture">
                <Form.Label>Choose Community Profile Picture</Form.Label>
                <Form.Control
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleFileChange}
                  onKeyUp={() => validForm("picture")}
                  onBlur={() => validForm("picture")}
                />
              </Form.Group>
              {/* <button onClick={handleUpload}>Upload</button> */}
              {errField.pictureErr.length > 0 && (
                <span className="error" style={{ color: "red" }}>
                  {errField.pictureErr}
                </span>
              )}

              <br />
              <div className="text-center mb-4">
                <img
                  src={
                    selectedFile
                      ? URL.createObjectURL(selectedFile)
                      : "http://localhost:5000/" + data?.user?.picture
                  }
                  alt="Profile"
                  className="rounded-circle img-fluid"
                  style={{ maxWidth: "150px" }}
                />
              </div>

              <center>
                <button
                  type="submit"
                  name="submit"
                  className="btn btn-primary mb-3"
                  disabled={!selectedFile || isFormValid()} // Disable if no image is selected or form is invalid
                >
                  {" "}
                  Create Community
                </button>
              </center>
            </Form>
          </Col>
          <Col></Col>
        </Row>
      </Container>
    </div>
  );
};

export default AddCommunity;
