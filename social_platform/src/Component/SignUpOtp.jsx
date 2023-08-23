import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col, Form, Nav } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { sendOtp } from "./sendOtp";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const SignUpOtp = (props) => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    otpCode: "",
  });

  const [errField, setErrField] = useState({
    otpCodeErr: "",
  });

  const handleOtpSend = async () => {
    try {
      const message = await sendOtp(props.email); // Pass the email here
      toast.success(message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const validForm = () => {
    let formIsValid = true;
    setErrField({
      otpCodeErr: "",
    });

    if (data.otpCode === "") {
      formIsValid = false;
      setErrField((prevState) => ({
        ...prevState,
        otpCodeErr: "Please Enter OTP",
      }));
    } else {
      setErrField((prevState) => ({
        ...prevState,
        otpCodeErr: "",
      }));
    }
    return formIsValid;
  };

  const submit = async (e) => {
    e.preventDefault();

    if (validForm()) {
      const url = "http://localhost:5000/users/signup-verification";
      const options = {
        method: "POST",
        url: url,
        data: { ...data, email: props.email },
      };

      try {
        const response = await Axios(options);
        console.log(response);
        let timerInterval;
        if (response.data.statusText === "Success") {
          Swal.fire({
            title: "Verification completed",
            html: "I will close in <b></b> milliseconds.",
            timer: 2000, // Set timer to 2 seconds
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading();
              const b = Swal.getHtmlContainer().querySelector("b");
              const timerInterval = setInterval(() => {
                b.textContent = Swal.getTimerLeft();
              }, 100);
              Swal.getPopup()
                .querySelector(".swal2-close")
                .addEventListener("click", () => {
                  clearInterval(timerInterval);
                });
            },
            willClose: () => {
              clearInterval(timerInterval);
            },
          }).then((result) => {
            if (result.dismiss === Swal.DismissReason.timer) {
              console.log("I was closed by the timer");
            }
            navigate("/");
            console.log("R1");
          });
        } else {
          toast.error(response.data.message); // Display an error toast
        }
      } catch (error) {
        console.log("Error running:", error);
        toast.error(error.response.data.message); // Display an error toast
      }
    } else {
      toast.warn("INVALID FORM"); // Display a warning toast
    }
  };

  const handle = (e) => {
    const newData = { ...data };
    newData[e.target.id] = e.target.value;
    setData(newData);
  };

  const isFormValid = () => {
    return errField.otpCodeErr.length === 0;
  };

  return (
    <Row>
      <ToastContainer />
      <Col></Col>
      <Col>
        <Form autoComplete="off" onSubmit={submit}>
          <Form.Label style={{ color: "yellow" }}>OTP Code</Form.Label>
          <Form.Control
            type="text"
            onChange={handle}
            id="otpCode"
            value={data.otpCode}
            placeholder="OTP CODE"
            onBlur={() => validForm()}
            onKeyUp={() => validForm()}
          />
          {errField.otpCodeErr.length > 0 && (
            <span className="error" style={{ color: "red" }}>
              {errField.otpCodeErr}
            </span>
          )}
          <br />

          <br />

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "2rem",
              margin: "2rem",
            }}
          >
            <Button onClick={handleOtpSend} variant="warning">
              Resend OTP
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="mb-3"
              disabled={!isFormValid()}
            >
              Confirm OTP
            </Button>
            <Nav.Link
              href="/"
              style={{
                padding: "1rem",
                border: "1px solid #ccc",
                borderRadius: "5px",
                color: "#007bff",
                textDecoration: "none",
              }}
            >
              Sign In
            </Nav.Link>
          </div>
        </Form>
      </Col>
      <Col></Col>
    </Row>
  );
};

export default SignUpOtp;
