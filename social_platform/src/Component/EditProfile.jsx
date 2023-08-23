import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import { Row, Col, Nav } from "react-bootstrap";
import { UseSelector, useSelector } from "react-redux/es/hooks/useSelector";
import { useDispatch } from "react-redux";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS
import { updateUser } from "../Store/Slices/UserSlices";

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userData = useSelector((state) => {
    return state.users;
  });
  const dummy = {
    name: "",
    interest: "",
  };

  const [data, setData] = useState(dummy);
  const [errField, setErrField] = useState({
    nameErr: "",
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
  function handle(e) {
    const newData = { ...data };
    newData[e.target.id] = e.target.value;
    setData(newData);
  }
  const isFormValid = () => {
    return !(
      errField.interestErr.length === 0 && errField.nameErr.length === 0
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
  const handleUpdate = (event) => {
    event.preventDefault();
    dispatch(updateUser({ data }));
    navigate("/UserProfile");
  };
  return (
    <Container fluid style={styleOb}>
      <Row>
        <Col></Col>
        <Col>
          {" "}
          <h1>UPDATE USER PROFILE</h1>
          <form onSubmit={handleUpdate}>
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              onKeyUp={() => validForm("name")}
              onBlur={() => validForm("name")}
              id="name"
              onChange={(e) => handle(e)}
              value={data.name}
              placeholder="Name"
            />

            {errField.nameErr.length > 0 && (
              <span className="error" style={{ color: "red" }}>
                {errField.nameErr}
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
              onKeyUp={() => validForm("interest")}
              onBlur={() => validForm("interest")}
              onChange={(e) => handle(e)}
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

            <center>
              <button
                type="submit"
                name="submit"
                class="btn btn-primary mb-3"
                disabled={isFormValid()}
              >
                Save Changes
              </button>
            </center>
          </form>
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
};

export default EditProfile;
