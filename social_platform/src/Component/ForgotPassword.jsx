import React, { useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import Axios from "axios";
import PasswordForm from './PasswordForm';

const ForgotPassword = () => {
  const emailRef = useRef();
  const [otpForm, setShowOtpForm] = useState(true);
  const [errField, setErrField] = useState({
    emailErr: '',
  });

  const sendOtp = async () => {
    try {
      const response = await Axios.post('http://localhost:5000/users/emailsend', {
        email: emailRef.current.value
      });

      const record = response.data;
      if (record.statusText === 'Success') {
        alert(record.message);
        setShowOtpForm(false);
      } else {
        alert(record.message);
      }
    } catch (error) {
      alert("Something went wrong! User does not exist.");
      console.error("Error:", error);
    }
  };

  const validateEmail = () => {
    let formIsValid = true;
    setErrField({
      emailErr: '',
    });

    if (!emailRef.current.value) {
      formIsValid = false;
      setErrField(prevState => ({
        ...prevState,
        emailErr: 'Please Enter Email'
      }));
    }
    return formIsValid;
  };

  return (
    <Container fluid style={{ height: '100vh', backgroundImage: "url(Image/pic2.jpg)", backgroundSize: "cover", alignItems: "center", justifyContent: "center", padding: "150px" }}>
      <Row>
        <Col>
        </Col>
        <Col>
          <center><h1 style={{ padding: "1rem", color: "yellow" }}>FORGET PASSWORD</h1></center>
          {otpForm ? (
            <form>
              <label className="form-label" style={{ color: 'yellow' }}>
                Email address
              </label>
              <input type="email" className="form-control" id="email" placeholder="Email" onBlur={validateEmail} ref={emailRef} />
              {errField.emailErr && (
                <span className="error" style={{ color: 'red' }}>{errField.emailErr}</span>
              )}

              <label style={{ padding: '2rem' }}></label>
             
              <center>
                <button type="button" name="submit" className="btn btn-primary mb-3" onClick={sendOtp}>
                  Confirm Email Address
                </button>
              </center>
            </form>
          ) : (
            <PasswordForm email={emailRef.current.value} />
          )}
        </Col>
        <Col>{/* <h3 style={{color:"yellow"}}>Email:{email} </h3><h3 style={{color:"yellow"}}>Password:{password} </h3> */}</Col>
      </Row>
    </Container>
  );
}

export default ForgotPassword;
