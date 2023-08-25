import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Container, Row, Col, Form } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS
import TopMenu from "./TopMenu";

const ChangePassword = () => {
  const userData = useSelector((state) => state.users);

  const [data, setData] = useState({
    oldpassword: "",
    newpassword: "",
    cpassword: "",
    email: userData.user.email,
  });

  const [errField, setErrField] = useState({
    oldpasswordErr: "",
    newpasswordErr: "",
    cpasswordErr: "",
  });

  const validForm = (fieldName) => {
    let formIsValid = true;

    switch (fieldName) {
      case "oldpassword":
        if (data.oldpassword === "" || data.oldpassword.length <= 4) {
          formIsValid = false;
          setErrField((prevState) => ({
            ...prevState,
            oldpasswordErr:
              "Password too short. It should be greater than 4 letters.",
          }));
        } else {
          setErrField((prevState) => ({
            ...prevState,
            oldpasswordErr: "",
          }));
        }
        break;

      case "newpassword":
        if (data.newpassword === "" || data.newpassword.length <= 4) {
          formIsValid = false;
          setErrField((prevState) => ({
            ...prevState,
            newpasswordErr:
              "Password too short. It should be greater than 4 letters.",
          }));
        } else {
          setErrField((prevState) => ({
            ...prevState,
            newpasswordErr: "",
          }));
        }
        break;

      case "cpassword":
        if (data.cpassword !== data.newpassword) {
          formIsValid = false;
          setErrField((prevState) => ({
            ...prevState,
            cpasswordErr: "Passwords do not match.",
          }));
        } else if (data.cpassword === "") {
          formIsValid = false;
          setErrField((prevState) => ({
            ...prevState,
            cpasswordErr: "Please enter password.",
          }));
        } else {
          setErrField((prevState) => ({
            ...prevState,
            cpasswordErr: "",
          }));
        }
        break;

      default:
        break;
    }

    return formIsValid;
  };

  const isFormValid = () => {
    return (
      errField.oldpasswordErr.length === 0 &&
      errField.newpasswordErr.length === 0 &&
      errField.cpasswordErr.length === 0
    );
  };

  function submit(e) {
    e.preventDefault();

    if (validForm()) {
      console.log("DATA------>", data);
      axios
        .post("http://localhost:5000/users/change-user-password", data)
        .then((res) => {
          if (res.data.statusText === "success") {
            toast.success("Password changed successfully");
          } else {
            toast.error("An error occurred. Please try again.");
          }
        })
        .catch((error) => {
          if (error.response) {
            const errorMessage = error.response.data.message;
            toast.error(errorMessage);
          } else {
            toast.error("An error occurred. Please try again.");
          }
        });
    } else {
      toast.error("Please fix the errors in the form");
    }
  }

  const styleOb = {
    height: "100vh",
    backgroundImage: "url(Image/picSignUp.jpg)",
    backgroundSize: "cover",
    alignItems: "center",
    justifyContent: "center",
    padding: "180px",
  };

  function handleInputChange(e) {
    const { id, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
    validForm(id);
  }

  return (
    <div>
      <TopMenu />
      <Container fluid style={styleOb}>
        <ToastContainer />
        <Row>
          <Col></Col>
          <Col>
            <h1>CHANGE PASSWORD</h1>
            <Form onSubmit={(e) => submit(e)}>
              <Form.Label htmlFor="oldpassword">OLD PASSWORD</Form.Label>
              <Form.Control
                type="password"
                id="oldpassword"
                onChange={handleInputChange}
                value={data.oldpassword}
                placeholder="OLD PASSWORD"
                onBlur={() => validForm("oldpassword")}
                onKeyUp={() => validForm("oldpassword")}
              />

              {errField.oldpasswordErr && (
                <span className="error" style={{ color: "red" }}>
                  {errField.oldpasswordErr}
                </span>
              )}

              <br />

              <Form.Label htmlFor="newpassword">NEW PASSWORD</Form.Label>
              <Form.Control
                type="password"
                id="newpassword"
                onChange={handleInputChange}
                value={data.newpassword}
                placeholder="NEW PASSWORD"
                onBlur={() => validForm("newpassword")}
                onKeyUp={() => validForm("newpassword")}
              />

              {errField.newpasswordErr && (
                <span className="error" style={{ color: "red" }}>
                  {errField.newpasswordErr}
                </span>
              )}

              <br />

              <Form.Label htmlFor="cpassword">CONFIRM PASSWORD</Form.Label>
              <Form.Control
                type="password"
                id="cpassword"
                onChange={handleInputChange}
                value={data.cpassword}
                placeholder="CONFIRM PASSWORD"
                onBlur={() => validForm("cpassword")}
                onKeyUp={() => validForm("cpassword")}
              />

              {errField.cpasswordErr && (
                <span className="error" style={{ color: "red" }}>
                  {errField.cpasswordErr}
                </span>
              )}

              <br />

              <center>
                <button
                  type="submit"
                  name="submit"
                  className="btn btn-primary mb-3"
                  disabled={!isFormValid()}
                >
                  Change Password
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

export default ChangePassword;
