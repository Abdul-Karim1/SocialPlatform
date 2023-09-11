import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Form, Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import TopMenu from "../Navbar/TopMenu";

const AddComments = ({ _id, setAdded }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const userData = useSelector((state) => {
    return state.users;
  });

  const dummy = {
    user: "",
    text: "",
    post: "",
  };

  const [commentCount, setCommentCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(dummy);
  const [errField, setErrField] = useState({
    textErr: "",
  });

  const validForm = (fieldName) => {
    let formIsValid = true;

    switch (fieldName) {
      case "text":
        if (data.text === "") {
          formIsValid = false;
          setErrField((prevState) => ({
            ...prevState,
            textErr: "Please Enter the Comment",
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

  const handleComment = async () => {
    fetchComments();

    if (validForm()) {
      const updatedData = {
        ...data,
        post: id,
        user: userData.user,
      };

      axios
        .post(
          `http://localhost:5000/comments/createComment/${_id}`,
          updatedData
        )
        .then((res) => {
          console.log("COMMENT DATA", updatedData);

          setData(dummy); // Reset the form data here

          console.log("RESPONSE---->", res);
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Your Comment has been posted",
            showConfirmButton: false,
            timer: 1500,
          });
          // Increment the comment count and trigger setAdded(true)
          setCommentCount(commentCount + 1);
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
      toast.error("INVALID FORM"); // Display an error toast for an invalid form
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/comments/readComment/${id}`
      );
      console.log("RESPONSEEEEEEEEEEEEEEEE--->", response);
      const { comments } = response.data;
      console.log("COMMENTTTTTTTTTTTTTTT---->", comments);
      setComments(comments);
      setLoading(false); // Set loading to false once data is fetched
    } catch (error) {
      console.error("Error fetching Comment:", error);
      setLoading(false); // Set loading to false in case of an error
    }
  };

  useEffect(() => {
    const updatedData = {
      ...data,
      post: id,
      user: userData.user,
    };
    setData(updatedData);
    console.log(updatedData);
    console.log(data);
  }, []);

  useEffect(() => {
    // When the commentCount changes, trigger setAdded(true)
    if (commentCount > 0) {
      setAdded(true);
    }
  }, [commentCount, setAdded]);

  return (
    <div>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          handleComment();
        }}
      >
        <Form.Control
          type="text"
          onKeyUp={() => validForm("text")}
          onBlur={() => validForm("text")}
          id="text"
          onChange={(e) => handle(e)}
          value={data.text}
          placeholder={"Enter Comment"}
        />
        {errField.textErr.length > 0 && (
          <span className="error" style={{ color: "red" }}>
            {errField.textErr}
          </span>
        )}
        <button
          type="submit"
          name="submit"
          className="btn btn-primary mb-3"
          disabled={isFormValid()}
        >
          Post
        </button>
      </Form>
    </div>
  );
};

export default AddComments;
