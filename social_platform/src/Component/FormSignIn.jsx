import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import  Axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from 'react-bootstrap';
import {Row,Col,Nav} from 'react-bootstrap';


const FormSignIn = () => {
  const navigate = useNavigate();
  

const url = "http://localhost:5000/users/signin";
const [data,setData] = useState({
    email:"",
    password:"",
  })
  const [errField, setErrField] = useState({
    emailErr: '',
    passwordErr: '',
  });
  const validForm = (fieldName) => {

    let formIsValid = true;
    setErrField({
      emailErr: '',
      passwordErr: '',
    });
    switch(fieldName){
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
    }
    return formIsValid;
  };  

  function submit(e){

  e.preventDefault();
  if(validForm()){
    
    Axios.post(url, {
      email: data.email,
      password: data.password
    })	
    .then(res=>{
      alert("LOGIN SUCESSFUL");
      //  console.log(res.data.payload.token);
      //  let token = res.data.payload.token;
      //  localStorage.setItem("jwt", token);
        navigate("/Home");
    })
    .catch(error=>alert("INVALID USER INPUT"));
  }else{
    alert("INVALID FORM")
  }
 
}

function handle(e){
  const newData = {...data}
  newData[e.target.id] = e.target.value
  setData(newData)
  console.log(newData);
}







  return ( 
    <Container fluid style={{ height: '100vh',backgroundImage: "url(Image/pic2.jpg)",backgroundSize: "cover",alignItems: "center", justifyContent: "center",padding:"150px" }}>
    <Row>
      <Col>
         
      </Col>
      <Col> <center><h1 style={{padding:"2rem",color:"yellow"}}>LOGIN</h1></center>
  <form onSubmit={(e) =>submit(e)}>
          {/* <h3 style={{padding:"2rem",color:"yellow"}}>Sign In</h3> */}
           <label for="exampleFormControlInput1" class="form-label" style={{color:"yellow",}}>Email address</label>
          <input type="email"  class="form-control" onChange={(e) =>handle(e)} id='email'onBlur={()=>validForm('email')} value={data.email} placeholder="Email"/>
          {errField.emailErr.length > 0 && (
            <span className="error" style={{ color: 'red' }}>{errField.emailErr}</span>
          )}
           <br/>
          <label for="exampleFormControlInput1" class="form-label" style={{color:"yellow"}}>Password</label>
          <input type="password"class="form-control" onChange={(e) =>handle(e)} id='password' value={data.password} onBlur={()=>validForm('password')} placeholder="PASSWORD"/>
          {errField.passwordErr.length > 0 && (
            <span className="error" style={{ color: 'red' }}>{errField.passwordErr}</span>
          )}
          
          <div style={{ display: "flex", gap: "10rem" }}>
          <label style={{ padding: "1rem", color: "yellow" }}><Nav.Link href="/SignUp">SignUpNow</Nav.Link></label>
        <label style={{ padding: "1rem", color: "yellow" }}><Nav.Link href="/ForgotPassword">ForgetPassword?</Nav.Link></label>
      </div>    
          <center><button name="submit" class="btn btn-primary mb-3" >Sign In</button></center>
        </form>


  
  </Col>
      <Col>{/*<h3 style={{color:"yellow"}}>Email:{email} </h3><h3 style={{color:"yellow"}}>Password:{password} </h3>*/}</Col>
    </Row>
    
        
  </Container>

   );
}

export default FormSignIn;
