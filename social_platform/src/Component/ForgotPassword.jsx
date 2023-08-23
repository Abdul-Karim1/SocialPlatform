import React, { useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Nav } from "react-bootstrap";
import Axios from "axios";
import PasswordForm from "./PasswordForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS

const ForgotPassword = () => {
  const emailRef = useRef();
  const [otpForm, setShowOtpForm] = useState(true);
  const [errField, setErrField] = useState({
    emailErr: "",
  });

  const sendOtp = async () => {
    try {
      const response = await Axios.post(
        "http://localhost:5000/users/emailsend",
        {
          email: emailRef.current.value,
        }
      );

      const record = response.data;
      if (record.statusText === "Success") {
        showToast("success", record.message);
        setShowOtpForm(false);
      } else {
        showToast("error", record.message);
      }
    } catch (error) {
      if (error.response) {
        showToast("error", `Error: ${error.response.data.message}`);
      } else {
        showToast("error", "Something went wrong! User does not exist.");
        console.error("Error:", error);
      }
    }
  };

  // Toast function using react-toastify
  const showToast = (type, message) => {
    switch (type) {
      case "success":
        toast.success(message);
        break;
      case "error":
        toast.error(message);
        break;
      // Add more cases for other toast types if needed
      default:
        toast(message);
    }
  };

  const validateEmail = () => {
    let formIsValid = true;

    if (!emailRef.current.value) {
      formIsValid = false;
      setErrField((prevState) => ({
        ...prevState,
        emailErr: "Please Enter Valid Email",
      }));
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i.test(emailRef.current.value)
    ) {
      formIsValid = false;
      setErrField((prevState) => ({
        ...prevState,
        emailErr: "Please Enter Valid Email",
      }));
    } else {
      setErrField((prevState) => ({
        ...prevState,
        emailErr: "",
      }));
    }
    return formIsValid;
  };

  const isFormValid = () => {
    return errField.emailErr.length === 0;
  };

  return (
    <Container
      fluid
      style={{
        height: "100vh",
        backgroundImage: "url(Image/pic2.jpg)",
        backgroundSize: "cover",
        alignItems: "center",
        justifyContent: "center",
        padding: "150px",
      }}
    >
      <ToastContainer />
      <Row>
        <Col></Col>
        <Col>
          <center>
            <h1 style={{ padding: "1rem", color: "yellow" }}>
              FORGET PASSWORD
            </h1>
          </center>
          {otpForm ? (
            <form>
              <label className="form-label" style={{ color: "yellow" }}>
                Email address
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Email"
                onBlur={validateEmail}
                onKeyUp={validateEmail}
                ref={emailRef}
              />
              {errField.emailErr && (
                <span className="error" style={{ color: "red" }}>
                  {errField.emailErr}
                </span>
              )}

              <center>
                <button
                  disabled={!isFormValid()}
                  type="button"
                  name="submit"
                  className="btn btn-primary mb-3"
                  onClick={sendOtp}
                >
                  Confirm Email Address
                </button>
              </center>
            </form>
          ) : (
            <PasswordForm email={emailRef.current.value} />
          )}
        </Col>
        <Col>
          {/* <h3 style={{color:"yellow"}}>Email:{email} </h3><h3 style={{color:"yellow"}}>Password:{password} </h3> */}
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword;
