import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col, Form, Nav } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import { sendOtp } from './sendOtp';

const SignUpOtp = (props) => {
  const navigate = useNavigate();
 
  const [data, setData] = useState({
    otpCode: '',
  });

  const [errField, setErrField] = useState({
    otpCodeErr: '',
  });

  const handleOtpSend = async () => {
    try {
      const message = await sendOtp(props.email); // Pass the email here
      alert(message);
    } catch (error) {
      alert(error.message);
    }
  };

  const validForm = () => {
    let formIsValid = true;
    setErrField({
      otpCodeErr: '',
    });

    if (data.otpCode === '') {
      formIsValid = false;
      setErrField(prevState => ({
        ...prevState,
        otpCodeErr: 'Please Enter OTP'
      }));
    }
    return formIsValid;
  };

  const submit = async (e) => {
    e.preventDefault();

    if (validForm()) {
      const url = 'http://localhost:5000/users/signup-verification';
      const options = {
        method: 'POST',
        url: url,
        data: { ...data, email: props.email }
      };

      try {
        const response = await Axios(options);
        console.log(response);

        if (response.data.statusText === 'Success') {
          <Alert  variant='primary'>
          Verification Completed
        </Alert>
          navigate("/");
          
        } else {
          alert(response.data.message);
        }
      } catch (e) {
        console.log("Error running:", e);
        alert("INVALID REQUEST");
      }
    } else {
      alert("INVALID FORM");
    }
  };

  const handle = e => {
    const newData = { ...data };
    newData[e.target.id] = e.target.value;
    setData(newData);
  };

  return (
    <Row>
      <Col></Col>
      <Col>
        <Form autoComplete="off" onSubmit={submit} >
          <Form.Label style={{ color: 'yellow' }}>OTP Code</Form.Label>
          <Form.Control
            type="text"
            onChange={handle}
            id="otpCode"
            value={data.otpCode}
            placeholder="OTP CODE"
            onBlur={()=>validForm()}
          />
          {errField.otpCodeErr.length > 0 && (
            <span className="error" style={{ color: 'red' }}>{errField.otpCodeErr}</span>
          )}
         <br/>

          <br/>
          
               
            
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "2rem", margin: "2rem" }}>
              <Button onClick={handleOtpSend} variant="warning">Resend OTP</Button>
              <Button type="submit"  variant="primary" className="mb-3">Confirm OTP</Button>
              <Nav.Link href="/" style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: "5px", color: "#007bff", textDecoration: "none" }}>Sign In</Nav.Link>
            </div>
          
        </Form>
      </Col>
      <Col></Col>
    </Row>
  );
};

export default SignUpOtp;
