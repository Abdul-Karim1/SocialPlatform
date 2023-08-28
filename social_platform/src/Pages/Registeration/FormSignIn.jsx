import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import { Row, Col, Nav } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { useDispatch } from "react-redux";
import { addUser } from "../../Store/Slices/UserSlices";

const FormSignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const url = "http://localhost:5000/users/signin";
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [errField, setErrField] = useState({
    emailErr: "",
    passwordErr: "",
  });
  const [userData, setUserData] = useState(null);

  console.log("errors", errField);
  const validForm = (fieldName) => {
    let formIsValid = true;

    switch (fieldName) {
      case "email":
        if (
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i.test(data.email) ||
          data.email === ""
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
        if (data.password === "") {
          formIsValid = false;
          setErrField((prevState) => ({
            ...prevState,
            passwordErr: "Please Enter Password",
          }));
        }
        if (data.password.length <= "4") {
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
    }
    return formIsValid;
  };

  function submit(e) {
    e.preventDefault();
    if (validForm()) {
      Axios.post(url, {
        email: data.email,
        password: data.password,
      })
        .then((res) => {
          let timerInterval;

          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Logged In",
            showConfirmButton: false,
            timer: 1500,
          });
          dispatch(addUser(res.data.user));
          console.log("USER token------>", res.data.user.token);
          const key = "";
          localStorage.setItem("key", res.data.user.token);
          console.log("Saved Token-->", res.data.user.token);
          setUserData(res.data.user);
          navigate("/UserProfile");
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
      toast.error("Invalid Form"); // Display an error toast for invalid form
    }
  }

  function handle(e) {
    const newData = { ...data };
    newData[e.target.id] = e.target.value;
    setData(newData);
    console.log(newData);
  }

  const isFormValid = () => {
    return errField.emailErr.length === 0 && errField.passwordErr.length === 0;
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
          {" "}
          <center>
            <h1 style={{ padding: "2rem", color: "yellow" }}>LOGIN</h1>
          </center>
          <form onSubmit={(e) => submit(e)}>
            {/* <h3 style={{padding:"2rem",color:"yellow"}}>Sign In</h3> */}
            <label
              for="exampleFormControlInput1"
              class="form-label"
              style={{ color: "yellow" }}
            >
              Email address
            </label>
            <input
              type="email"
              class="form-control"
              onChange={(e) => handle(e)}
              id="email"
              onKeyUp={() => validForm("email")}
              onBlur={() => validForm("email")}
              value={data.email}
              placeholder="Email"
            />
            {errField.emailErr.length > 0 && (
              <span className="error" style={{ color: "red" }}>
                {errField.emailErr}
              </span>
            )}
            <br />
            <label
              for="exampleFormControlInput1"
              class="form-label"
              style={{ color: "yellow" }}
            >
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

            <div style={{ display: "flex", gap: "10rem" }}>
              <label style={{ padding: "1rem", color: "yellow" }}>
                <Nav.Link href="/SignUp">SignUpNow</Nav.Link>
              </label>
              <label style={{ padding: "1rem", color: "yellow" }}>
                <Nav.Link href="/ForgotPassword">ForgetPassword?</Nav.Link>
              </label>
            </div>
            <center>
              <button
                name="submit"
                class="btn btn-primary mb-3"
                disabled={!isFormValid()}
              >
                Sign In
              </button>
            </center>
          </form>
        </Col>
        <Col>
          {/*<h3 style={{color:"yellow"}}>Email:{email} </h3><h3 style={{color:"yellow"}}>Password:{password} </h3>*/}
        </Col>
      </Row>
    </Container>
  );
};

export default FormSignIn;
