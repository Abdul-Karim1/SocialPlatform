import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import Axios from "axios";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import { Row, Col, Nav } from "react-bootstrap";
import SignUpOtp from "./SignUpOtp";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS

const FormSignUp = () => {
  const dummy = {
    name: "",
    email: "",
    password: "",
    cpassword: "",
    interest: "",
  };
  const [otpForm, ShowForm] = useState(true);
  const emailRef = useRef();
  const url = "http://localhost:5000/users/signup";
  const navigate = useNavigate();
  const [data, setData] = useState(dummy);
  const [errField, setErrField] = useState({
    nameErr: "",
    emailErr: "",
    passwordErr: "",
    cpasswordErr: "",
    interestErr: "",
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

      case "email":
        if (
          data.email === "" ||
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i.test(data.email)
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
        break;

      case "password":
        if (data.password === "" || data.password.length <= "4") {
          formIsValid = false;
          setErrField((prevState) => ({
            ...prevState,
            passwordErr:
              "Too short!!!The length of password shall be greater then 4",
          }));
        } else {
          setErrField((prevState) => ({
            ...prevState,
            passwordErr: "",
          }));
        }
        break;

      case "cpassword":
        if (data.cpassword !== "" && data.password !== data.cpassword) {
          formIsValid = false;
          setErrField((prevState) => ({
            ...prevState,
            cpasswordErr: "Password does not match",
          }));
        } else if (data.cpassword === "") {
          setErrField((prevState) => ({
            ...prevState,
            cpasswordErr: "Please enter Password ",
          }));
        } else {
          setErrField((prevState) => ({
            ...prevState,
            cpasswordErr: "",
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
    }
    return formIsValid;
  };

  function submit(e) {
    e.preventDefault();
    if (validForm()) {
      Axios.post(url, data)
        .then((res) => {
          toast.success("Check Your Email for verification");
          ShowForm(false); // Assuming ShowForm is a function to update the form state

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
      toast.error("INVALID FORM"); // Display an error toast for invalid form
    }
  }

  function handle(e) {
    const newData = { ...data };
    newData[e.target.id] = e.target.value;
    setData(newData);
    console.log(newData);
  }

  const isFormValid = () => {
    return !(
      errField.emailErr.length === 0 &&
      errField.passwordErr.length === 0 &&
      errField.interestErr.length === 0 &&
      errField.cpasswordErr.length === 0 &&
      errField.nameErr.length === 0
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

  return (
    <Container fluid style={styleOb}>
      <ToastContainer />
      <Row>
        <Col></Col>
        <Col>
          {" "}
          <h1>SIGN UP</h1>
          {otpForm ? (
            <form onSubmit={(e) => submit(e)}>
              {/* <h3 style={{padding:"2rem",color:"yellow"}}>Sign In</h3> */}
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => handle(e)}
                onKeyUp={() => validForm("name")}
                onBlur={() => validForm("name")}
                id="name"
                value={data.name}
                placeholder="Name"
              />

              {errField.nameErr.length > 0 && (
                <span className="error" style={{ color: "red" }}>
                  {errField.nameErr}
                </span>
              )}
              <br />
              <label for="exampleFormControlInput1" class="form-label">
                Email address
              </label>
              <input
                type="email"
                class="form-control"
                onChange={(e) => handle(e)}
                id="email"
                value={data.email}
                ref={emailRef}
                onKeyUp={() => validForm("email")}
                onBlur={() => validForm("email")}
                placeholder="Email"
              />
              {errField.emailErr.length > 0 && (
                <span className="error" style={{ color: "red" }}>
                  {errField.emailErr}
                </span>
              )}
              <br />
              <label for="exampleFormControlInput1" class="form-label">
                Password
              </label>
              <input
                type="password"
                class="form-control"
                onChange={(e) => handle(e)}
                id="password"
                value={data.password}
                onKeyUp={() => validForm("password")}
                onBlur={() => validForm("password")}
                placeholder="PASSWORD"
              />
              {errField.passwordErr.length > 0 && (
                <span className="error" style={{ color: "red" }}>
                  {errField.passwordErr}
                </span>
              )}
              <br />
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                onChange={handle}
                id="cpassword"
                value={data.cpassword}
                onKeyUp={() => validForm("cpassword")}
                onBlur={() => validForm("cpassword")}
                placeholder="Confirm PASSWORD"
              />
              {errField.cpasswordErr.length > 0 && (
                <span className="error" style={{ color: "red" }}>
                  {errField.cpasswordErr}
                </span>
              )}
              <br />
              <label htmlFor="interest" className="form-label">
                Interest
              </label>
              <select
                className="form-control"
                id="interest"
                value={data.interest}
                onChange={(e) => handle(e)}
                onKeyUp={() => validForm("interest")}
                onBlur={() => validForm("interest")}
              >
                <option value="">Select an interest</option>
                <option value="gaming">Gaming</option>
                <option value="books">Books</option>
                <option value="cars">Cars</option>
              </select>
              {errField.interestErr.length > 0 && (
                <span className="error" style={{ color: "red" }}>
                  {errField.interestErr}
                </span>
              )}
              <br />
              <div style={{ display: "flex", gap: "10rem" }}>
                <label style={{ padding: "1rem", color: "blue" }}>
                  <Nav.Link href="/">AlreadyHaveAnAccount</Nav.Link>
                </label>
                <label style={{ padding: "1rem", color: "blue" }}>
                  <Nav.Link href="/ForgotPassword">ForgetPassword?</Nav.Link>
                </label>
              </div>
              <center>
                <button
                  type="submit"
                  name="submit"
                  class="btn btn-primary mb-3"
                  disabled={isFormValid()}
                >
                  Sign Up
                </button>
              </center>
            </form>
          ) : (
            <SignUpOtp email={emailRef.current.value} />
          )}
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
};

export default FormSignUp;
