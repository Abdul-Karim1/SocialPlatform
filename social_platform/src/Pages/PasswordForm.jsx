import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col, Nav } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { sendOtp } from "./SendOtp";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PasswordForm = (props) => {
  const navigate = useNavigate();

  console.log("PORPS ", props);

  const [data, setData] = useState({
    otpCode: "",
    password: "",
    cpassword: "",
  });

  const [errField, setErrField] = useState({
    otpCodeErr: "",
    passwordErr: "",
    cpasswordErr: "",
  });
  const handleOtpSend = async () => {
    try {
      const message = await sendOtp(props.email); // Pass the email here
      toast.success(message);
    } catch (error) {
      toast.error(error.message);
    }
  };
  const validForm = (fieldName) => {
    let formIsValid = true;

    switch (fieldName) {
      case "otp":
        if (data.otpCode === "") {
          formIsValid = false;
          setErrField((prevState) => ({
            ...prevState,
            otpCodeErr: "Please Enter Otp",
          }));
        } else {
          setErrField((prevState) => ({
            ...prevState,
            otpCodeErr: "",
          }));
        }
        break;
      case "password":
        if (data.password === "" || data.password.length <= 4) {
          formIsValid = false;
          setErrField((prevState) => ({
            ...prevState,
            passwordErr: "Password shall be greater then 4 digits",
          }));
        } else {
          setErrField((prevState) => ({
            ...prevState,
            passwordErr: "",
          }));
        }
        break;
      case "cpassword":
        if (data.cpassword !== "" && data.cpassword !== data.password) {
          formIsValid = false;
          setErrField((prevState) => ({
            ...prevState,
            cpasswordErr: "Password shall be greater then 4 digits",
          }));
        } else if (data.cpassword === "") {
          setErrField((prevState) => ({
            ...prevState,
            cpasswordErr: "Please Enter Password",
          }));
        } else {
          setErrField((prevState) => ({
            ...prevState,
            cpasswordErr: "",
          }));
        }
        break;
    }

    return formIsValid;
  };

  const submit = async (e) => {
    e.preventDefault();

    if (validForm()) {
      const url = "http://localhost:5000/users/change-password";
      let options = {
        method: "POST",
        url: url,
        headers: {},
        data: { ...data, email: props.email },
      };

      try {
        let response = await Axios(options);
        console.log(response);

        if (response.data.statusText === "Success") {
          showToast(
            "Success",
            "Password Changed Successfully" + "--EMAIL:" + props.email
          );
          setTimeout(() => {
            navigate("/");
          }, 1500);
        } else {
          showToast("error", response.data.message);
        }
      } catch (error) {
        console.log("Error running", error);
        showToast("error", error.response.data.message);
        // showToast("error", "An error occurred. Please try again.");
      }
    } else {
      showToast("error", "INVALID FORM");
    }
  };

  // Toast function using react-toastify
  const showToast = (type, message) => {
    switch (type) {
      case "Success":
        toast.success(message);
        break;
      case "error":
        toast.error(message);
        break;
      // Add more cases for other toast types if needed
    }
  };

  // if (validForm()) {
  //   Object.assign(data,props)
  //   try {
  //     const response = await Axios.post(url, {
  //       otpCode: data.otpCode,
  //       password: data.password,
  //       cpassword: data.cpassword
  //     });

  //     if (response.data.success) {
  //       alert('Password changed successfully');
  //       navigate('/');
  //     } else {
  //       alert('Password change failed');
  //     }
  //   } catch (error) {
  //     console.error('An error occurred:', error);
  //     alert('An error occurred while changing the password');
  //   }
  // }

  const handle = (e) => {
    const newData = { ...data };
    newData[e.target.id] = e.target.value;
    setData(newData);
  };

  const isFormValid = () => {
    return (
      errField.otpCodeErr.length === 0 &&
      errField.passwordErr.length === 0 &&
      errField.cpasswordErr.length === 0
    );
  };

  return (
    <Row>
      <Col></Col>
      <Col>
        <Form autoComplete="off" onSubmit={submit}>
          <Form.Label style={{ color: "yellow" }}>Otp Code</Form.Label>
          <Form.Control
            type="text"
            onChange={handle}
            id="otpCode"
            value={data.otpCode}
            onBlur={() => validForm("otp")}
            onKeyUp={() => validForm("otp")}
            placeholder="OTP CODE"
          />
          {errField.otpCodeErr.length > 0 && (
            <span className="error" style={{ color: "red" }}>
              {errField.otpCodeErr}
            </span>
          )}
          <br />
          <Form.Label style={{ color: "yellow" }}>Password</Form.Label>
          <Form.Control
            type="password"
            onChange={handle}
            id="password"
            value={data.password}
            onBlur={() => validForm("password")}
            onKeyUp={() => validForm("password")}
            placeholder="PASSWORD"
          />
          {errField.passwordErr.length > 0 && (
            <span className="error" style={{ color: "red" }}>
              {errField.passwordErr}
            </span>
          )}
          <br />
          <Form.Label style={{ color: "yellow" }}>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            onChange={handle}
            id="cpassword"
            value={data.cpassword}
            onBlur={() => validForm("cpassword")}
            onKeyUp={() => validForm("cpassword")}
            placeholder="Confirm PASSWORD"
          />
          {errField.cpasswordErr.length > 0 && (
            <span className="error" style={{ color: "red" }}>
              {errField.cpasswordErr}
            </span>
          )}
          <br />
          <Button onClick={handleOtpSend} variant="warning">
            Resend OTP
          </Button>
          <div style={{ display: "flex", gap: "10rem" }}>
            <label style={{ padding: "1rem", color: "yellow" }}>
              <Nav.Link href="/">LOGIN</Nav.Link>
            </label>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              type="submit"
              variant="primary"
              className="mb-3"
              disabled={!isFormValid()}
            >
              Change Password
            </Button>
          </div>
        </Form>
      </Col>
      <Col></Col>
    </Row>
  );
};

export default PasswordForm;
