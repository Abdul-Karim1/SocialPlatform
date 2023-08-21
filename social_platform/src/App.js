import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FormSignUp from './Component/FormSignUp'; 
import FormSignIn from './Component/FormSignIn';
import ForgotPassword from './Component/ForgotPassword';
import SignUpOtp from './Component/SignUpOtp'; // Updated component name to start with capital letter
import Home from './Component/home'; // Updated component name to start with capital letter

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/SignUp" element={<FormSignUp />} />
        <Route path="/" element={<FormSignIn />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/OtpVerification" element={<SignUpOtp />} />
      </Routes>
    </Router>
  );
}

export default App;
