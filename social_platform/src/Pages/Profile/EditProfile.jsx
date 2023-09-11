import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import { Row, Col, Nav } from "react-bootstrap";
import { UseSelector, useSelector } from "react-redux/es/hooks/useSelector";
import { useDispatch } from "react-redux";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS
import { updateUser } from "../../Store/Slices/UserSlices";
import { Form } from "react-bootstrap";
import TopMenu from "../Navbar/TopMenu";
import axios from "axios";
const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userData = useSelector((state) => {
    return state.users;
  });
  const dummy = {
    name: "",
    interest: "",
    picture: "",
  };
  const [fileSelected, setFileSelected] = useState(false);
  const [image, setImage] = useState("");
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
            nameErr: "Please Enter your Name",
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
            interestErr: "Please Enter Your Interest",
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
      formdata.append("file", file); // Use 'file' directly

      axios
        .post("http://localhost:5000/uploadCommunity", formdata)
        .then((res) => {
          const updatedData = { ...data, picture: res.data };
          console.log("--->", res.data);
          setData(updatedData);
          const uploadedFileUrl = res.data;
          setImage(uploadedFileUrl);
          setFileSelected(true);
        })
        .catch((err) => console.log(err));
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
    event.preventDefault();
    dispatch(updateUser({ data }));
    navigate("/UserProfile");
  };

  return (
    <div>
      <TopMenu />
      <Container fluid style={styleOb}>
        <Row>
          <Col></Col>
          <Col>
            {" "}
            <h1>UPDATE USER PROFILE</h1>
            <Form onSubmit={handleUpdate}>
              <Form.Group controlId="profilePicture">
                <Form.Label>Choose Profile Picture</Form.Label>
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
                    fileSelected
                      ? image
                      : "http://localhost:5000/" + userData?.user?.picture
                  }
                  alt="Profile"
                  className="rounded-circle img-fluid"
                  style={{ maxWidth: "150px" }}
                />
              </div>
              <br />

              <Form.Label htmlFor="name">Name</Form.Label>
              <Form.Control
                type="text"
                onKeyUp={() => validForm("name")}
                onBlur={() => validForm("name")}
                id="name"
                onChange={(e) => handle(e)}
                value={data.name}
                placeholder={userData?.user?.name}
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
                <option value="">{userData?.user?.interest}</option>
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

              <center>
                <button
                  type="submit"
                  name="submit"
                  className="btn btn-primary mb-3"
                  disabled={!selectedFile || isFormValid()} // Disable if no image is selected or form is invalid
                >
                  {" "}
                  Save Changes
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

export default EditProfile;
