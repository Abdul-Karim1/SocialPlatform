import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col, Nav } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { sendOtp } from './sendOtp';

const PasswordForm = (props) => {
  const navigate = useNavigate();


 
  const [data, setData] = useState({
    otpCode: '',
    password: '',
    cpassword: ''
  });

  const [errField, setErrField] = useState({
    otpCodeErr: '',
    passwordErr: '',
    cpasswordErr: ''
  });
  const handleOtpSend = async () => {
    try {
      const message = await sendOtp(props.email); // Pass the email here
      alert(message);
    } catch (error) {
      alert(error.message);
    }
  };
  const validForm = (fieldName) => {
    let formIsValid = true;
    setErrField({
      otpCodeErr: '',
      passwordErr: '',
      cpasswordErr: ''
    });
    switch(fieldName){
      case 'otp':
        if (data.otpCode === '') {
          formIsValid = false;
          setErrField(prevState => ({
            ...prevState,
            otpCodeErr: 'Please Enter Otp'
          }));
        }
      break;
      case 'password':
        if (data.password === '') {
          formIsValid = false;
          setErrField(prevState => ({
            ...prevState,
            passwordErr: 'Please Enter Password'
          }));
        }
      break;
       case 'cpassword':
        if (data.cpassword === '') {
          formIsValid = false;
          setErrField(prevState => ({
            ...prevState,
            cpasswordErr: 'Please Enter Password'
          }));
        }
    
        if (data.cpassword !== '' && data.password !== data.cpassword) {
          formIsValid = false;
          setErrField(prevState => ({
            ...prevState,
            cpasswordErr: 'Password does not match'
          }));
        }
      break;  
    }






 

    return formIsValid;
  };

  const submit = async (e) => {
    e.preventDefault();

    if(validForm()){
      const url = 'http://localhost:5000/users/change-password';
    let options ={
      method:'POST',
      url:url,headers:{

      },
      data:{...data,email:props.email}
    }
    try{
      let response = await Axios(options)
      console.log(response)
      if(response.data.statusText == 'Success'){
        alert("Password Changed Successsful")
        setTimeout(()=>{
          navigate("/");
        },1500)
      }else{
        alert(response.data.message)
      }
      
    }
    catch(e){
      console.log("Error running")
      alert("INVALID REQUEST")
    }
    }else{
      alert("INVALID FORM");
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
          <Form.Label style={{ color: 'yellow' }}>Otp Code</Form.Label>
          <Form.Control
            type="text"
            onChange={handle}
            id="otpCode"
            value={data.otpCode}
            onBlur={()=>validForm('otp')}
            placeholder="OTP CODE"
          />
          {errField.otpCodeErr.length > 0 && (
            <span className="error" style={{ color: 'red' }}>{errField.otpCodeErr}</span>
          )}
          <br/>
          <Form.Label style={{ color: 'yellow' }}>Password</Form.Label>
          <Form.Control
            type="password"
            onChange={handle}
            id="password"
            value={data.password}
            onBlur={()=>validForm('password')}
            placeholder="PASSWORD"
          />
          {errField.passwordErr.length > 0 && (
            <span className="error" style={{ color: 'red' }}>{errField.passwordErr}</span>
          )}
          <br/>
          <Form.Label style={{ color: 'yellow' }}>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            onChange={handle}
            id="cpassword"
            value={data.cpassword}
            onBlur={()=>validForm('cpassword')}
            placeholder="Confirm PASSWORD"
          />
          {errField.cpasswordErr.length > 0 && (
            <span className="error" style={{ color: 'red' }}>{errField.cpasswordErr}</span>
          )}
          <br/>
          <Button onClick={handleOtpSend} variant="warning">Resend OTP</Button>
          <div style={{ display: "flex", gap: "10rem" }}>
              <label style={{ padding: "1rem", color: "yellow" }}><Nav.Link href="/">LOGIN</Nav.Link></label>
              <label style={{ padding: "1rem", color: "yellow" }}><Nav.Link href="/ForgotPassword">Again ForgetPassword?</Nav.Link></label>
            </div>     
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button type="submit" variant="primary" className="mb-3">
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
