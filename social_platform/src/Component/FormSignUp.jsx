import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import  Axios from "axios";
import { useState,useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from 'react-bootstrap';
import {Row,Col,Nav} from 'react-bootstrap';
import SignUpOtp from './SignUpOtp';



const FormSignUp = () => {
  const[otpForm,ShowForm]= useState(true);
  const emailRef = useRef();
  const url = "http://localhost:5000/users/signup";
  const navigate = useNavigate();
  const [data,setData] = useState({
    name:"",
    email:"",
		password:"",
    cpassword:"",
    interest:"",
	})
  const [errField, setErrField] = useState({
    nameErr:"",
    emailErr: '',
    passwordErr: '',
    cpasswordErr: '',
    interestErr: '',
  });
  const validForm = (fieldName) => {
    let formIsValid = true;

    setErrField({
      nameErr:"",
      emailErr: '',
      passwordErr: '',
      cpasswordErr:'',
      interestErr: '',
    });
    switch (fieldName) {

      case 'name':
        if (data.name === '') {
          formIsValid = false;
          setErrField(prevState => ({
            ...prevState,
            nameErr: 'Please Enter your Name'
          }));
        }
        break;
      case 'email':
        if (data.email === '') {
          formIsValid = false;
          setErrField(prevState => ({
            ...prevState,
            emailErr: 'Please Enter Email'
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
        if (data.cpassword !== '' && data.password !== data.cpassword) {
          formIsValid = false;
          setErrField(prevState => ({
            ...prevState,
            cpasswordErr: 'Password does not match'
          }));
        }
        if (data.cpassword === '' ) {
          formIsValid = false;
          setErrField(prevState => ({
            ...prevState,
            cpasswordErr: 'Please enter password'
          }));
        }
        break; 
      case 'interest':
        if (data.interest === '') {
          formIsValid = false;
          setErrField(prevState => ({
            ...prevState,
            interestErr: 'Please Enter Your Interest'
          }));
        }
        break;
    }
    return formIsValid;
  };


  function submit(e){
		e.preventDefault();
    if(validForm()){
       Axios.post(url, {
        name:data.name,
        email: data.email,
        password: data.password,
        cpassword:data.password,
        interest:data.interest,
      })	
      .then(res=>{
        alert("DATA ADDED, Check Your Email for verification");
        ShowForm(false); // Add this line        
        // console.log(res.data.payload.token);
        // let token = res.data.payload.token;
        // localStorage.setItem("jwt", token);
          
      })
      .catch(error=>alert(error.message));
    }
    else{
      alert("INVALID FORM");
    }
  
    }

  function handle(e){
		const newData = {...data}
		newData[e.target.id] = e.target.value
		setData(newData)
		console.log(newData);
	}


  



    return (  
      <Container fluid style={{ height: '100vh',backgroundImage: "url(Image/picSignUp.jpg)",backgroundSize: "cover",alignItems: "center", justifyContent: "center",padding:"180px" }}>
  
          <Row>
            <Col>
               
            </Col>
            <Col> <h1>SIGN UP</h1>
            {otpForm? <form onSubmit={(e) =>submit(e)}>
						{/* <h3 style={{padding:"2rem",color:"yellow"}}>Sign In</h3> */}
             <label htmlFor="name" className="form-label">Name</label>
             <input type="text"className="form-control"onChange={(e) => handle(e)}  onBlur={() => validForm('name')}id="name"value={data.name}placeholder="Name"/>
             
						{errField.nameErr.length > 0 && (
            <span className="error" style={{ color: 'red' }}>{errField.nameErr}</span>
          )}
          <br/>
          <label for="exampleFormControlInput1" class="form-label" >Email address</label>
            <input type="email"  class="form-control" onChange={(e) =>handle(e)} id='email' value={data.email} ref={emailRef} onBlur={() => validForm('email')} placeholder="Email"/>
            {errField.emailErr.length > 0 && (
            <span className="error" style={{ color: 'red' }}>{errField.emailErr}</span>
          )}
          <br/>
						<label for="exampleFormControlInput1" class="form-label" >Password</label>
            <input type="password"class="form-control" onChange={(e) =>handle(e)} id='password' value={data.password} onBlur={() => validForm('password')} placeholder="PASSWORD"/>
            {errField.passwordErr.length > 0 && (
            <span className="error" style={{ color: 'red' }}>{errField.passwordErr}</span>
          )}
          <br/>
            <Form.Label >Confirm Password</Form.Label>
          <Form.Control type="password"onChange={handle}id="cpassword"value={data.cpassword}onBlur={() => validForm('cpassword')}placeholder="Confirm PASSWORD"/>
          {errField.cpasswordErr.length > 0 && (
            <span className="error" style={{ color: 'red' }}>{errField.cpasswordErr}</span>
          )}
          <br/>
            <label htmlFor="interest" className="form-label">Interest</label>
          <select className="form-control"id="interest"value={data.interest}onChange={(e) => handle(e)} onBlur={() => validForm('interest')}>
          <option value="">Select an interest</option>
          <option value="gaming">Gaming</option>
          <option value="books">Books</option>
          <option value="cars">Cars</option>
          </select>
          {errField.interestErr.length > 0 && (
          <span className="error" style={{ color: 'red' }}>{errField.interestErr}</span>
          )}
          <br/>
            <div style={{ display: "flex", gap: "10rem" }}>
              <label style={{ padding: "1rem", color: "blue" }}><Nav.Link href="/">AlreadyHaveAnAccount</Nav.Link></label>
              <label style={{ padding: "1rem", color: "blue" }}><Nav.Link href="/ForgotPassword">ForgetPassword?</Nav.Link></label>
            </div>      
						<center><button type="submit" name="submit" class="btn btn-primary mb-3" >Sign Up</button></center>
            
					</form>
          :<SignUpOtp email={emailRef.current.value}/>
          }
              </Col>
            <Col>
           
            </Col>
          </Row>
       
        </Container>
        

    );
}

export default FormSignUp;
