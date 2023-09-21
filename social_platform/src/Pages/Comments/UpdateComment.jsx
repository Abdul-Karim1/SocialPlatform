import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import { Row, Col, Nav } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS
import { Form } from "react-bootstrap";
import TopMenu from "../Navbar/TopMenu";
import TopMenu1 from "../Navbar/TopMenu1";
import axios from "axios";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const UpdateComment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userData = useSelector((state) => {
    return state.users;
  });
  const dummy = {
    text: "",
  };

  const [data, setData] = useState(dummy);
  const [comment, setComment] = useState();
  const { id } = useParams();
  const [errField, setErrField] = useState({
    textErr: "",
  });

  useEffect(() => {
    axios
      .get(`http://localhost:5000/comments/readSpecificComment/${id}`)
      .then((response) => {
        console.log(response.data);
        const { comment } = response.data;
        console.log("RESPONSE COMMENT---->", comment);
        setComment(comment);
      })
      .catch((error) => {
        console.error("Error fetching Post:", error);
      });
  }, []);
  const validForm = (fieldName) => {
    let formIsValid = true;

    switch (fieldName) {
      case "text":
        if (data.text === "") {
          formIsValid = false;
          setErrField((prevState) => ({
            ...prevState,
            textErr: "Please Enter the Comment Text",
          }));
        } else {
          setErrField((prevState) => ({
            ...prevState,
            textErr: "",
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
    console.log(newData);
  }

  const isFormValid = () => {
    return !(errField.textErr.length === 0);
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
    if (validForm()) {
      event.preventDefault();
      const userReq = userData.user;
      console.log("userdata-->", userReq);
      axios
        .put(`http://localhost:5000/comments/UpdateComment/${id}`, {
          data,
          userData,
        })
        .then((response) => {
          toast.success("Comment Updated:", response.data);

          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Comment Updated",
            showConfirmButton: false,
            timer: 1500,
          });
          navigate(`/viewSpecificPost/${comment.post}`);
          // Navigate to view specific community page or perform other actions
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            // Handle 401 Unauthorized error with the message from the server
            toast.error("Unauthorized: " + error.response.data.message);
          } else {
            // Handle other errors
            toast.error("Error updating community: " + error.message);
          }
        });
    } else {
      toast.error("INVALID FORM"); // Display an error toast for an invalid form
    }
  };

  return (
    <div>
      <TopMenu1 />
      <ToastContainer />
      <Container fluid style={styleOb}>
        <Row>
          <Col></Col>
          <Col>
            {" "}
            <h1>UPDATE COMMENT</h1>
            <br />
            <Form onSubmit={handleUpdate}>
              <Form.Label htmlFor="name">Comment Text</Form.Label>
              <Form.Control
                type="text"
                onKeyUp={() => validForm("text")}
                onBlur={() => validForm("text")}
                id="text"
                onChange={(e) => handle(e)}
                value={data.text}
                placeholder={comment?.text}
              />
              {errField.textErr.length > 0 && (
                <span className="error" style={{ color: "red" }}>
                  {errField.textErr}
                </span>
              )}
              <br />

              <center>
                <button
                  type="submit"
                  name="submit"
                  className="btn btn-primary mb-3"
                  disabled={isFormValid()} // Disable if no image is selected or form is invalid
                >
                  {" "}
                  Save Changes
                </button>
              </center>
            </Form>
          </Col>
          <Col></Col>
        </Row>
      </Container>
    </div>
  );
};

export default UpdateComment;
