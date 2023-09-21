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
import axios from "axios";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import TopMenu1 from "../Navbar/TopMenu1";

const UpdatePost = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userData = useSelector((state) => {
    return state.users;
  });
  const dummy = {
    postText: "",
    picture: "",
  };
  const [selectedFile, setSelectedFile] = useState(null);
  const [data, setData] = useState(dummy);
  const [post, setPost] = useState(null);
  const [fileSelected, setFileSelected] = useState(null);
  const [picture, setPicture] = useState(null);
  const { id } = useParams();
  const [errField, setErrField] = useState({
    postTextErr: "",
    pictureErr: "",
  });

  useEffect(() => {
    axios
      .get(`http://localhost:5000/posts/viewSpecificPost/${id}`)
      .then((response) => {
        console.log(response.data);
        const { posts } = response.data;
        console.log("---->", posts);
        setPost(posts);
        console.log(post);
        console.log(post.picture);
      })
      .catch((error) => {
        console.error("Error fetching Post:", error);
      });
  }, []);
  const validForm = (fieldName) => {
    let formIsValid = true;

    switch (fieldName) {
      case "postText":
        if (data.postText === "") {
          formIsValid = false;
          setErrField((prevState) => ({
            ...prevState,
            postTextErr: "Please Enter the Post Text",
          }));
        } else {
          setErrField((prevState) => ({
            ...prevState,
            postTextErr: "",
          }));
        }
        break;

      case "picture":
        if (data.picture === "" && !selectedFile) {
          formIsValid = false;
          setErrField((prevState) => ({
            ...prevState,
            pictureErr: "Please Choose Image",
          }));
        } else {
          setErrField((prevState) => ({
            ...prevState,
            pictureErr: "",
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
    return !(
      errField.postTextErr.length === 0 && errField.pictureErr.length === 0
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
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const allowedFileTypes = ["image/jpeg", "image/png"];

    if (file && allowedFileTypes.includes(file.type)) {
      setSelectedFile(file);

      const formdata = new FormData();
      formdata.append("file", file);

      axios
        .post("http://localhost:5000/uploadCommunity/", formdata)
        .then((res) => {
          console.log("File uploaded successfully:", res.data);

          // Save the fileUrl from the response in a variable
          const uploadedFileUrl = res.data;
          console.log("hfhfyhfh", uploadedFileUrl);
          setPicture(uploadedFileUrl);
          const updatedData = {
            ...data,
            picture: uploadedFileUrl,
          };
          setData(updatedData);
          setFileSelected(true);
          // You can use the uploadedFileUrl as needed, for example, to display the image
          // on your page.
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
          // Handle error
        });
    }
  };

  // const handleUpload = (event) => {
  //   event.preventDefault();
  //   const formdata = new FormData();
  //   formdata.append("file", selectedFile);

  //   axios
  //     .post("http://localhost:5000/uploadLoggedIn", formdata)
  //     .then((res) => {
  //       const updatedData = { ...data, picture: res.data.imageName }; // Assuming the response has a property 'imageName'
  //       setData(updatedData);
  //     })
  //     .catch((err) => console.log(err));
  // };
  const handleUpdate = (event) => {
    if (validForm()) {
      event.preventDefault();
      const userReq = userData.user;
      console.log("userdata-->", userReq);
      axios
        .put(`http://localhost:5000/posts/UpdatePost/${id}`, {
          data,
          userData,
        })
        .then((response) => {
          toast.success("Post Updated:", response.data);

          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Post Updated",
            showConfirmButton: false,
            timer: 1500,
          });
          navigate(`/viewSpecificPost/${post.community}`);
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
            <h1>UPDATE POSTS</h1>
            <br />
            <Form onSubmit={handleUpdate}>
              <Form.Label htmlFor="name">Post Text</Form.Label>
              <Form.Control
                type="text"
                onKeyUp={() => validForm("postText")}
                onBlur={() => validForm("postText")}
                id="postText"
                onChange={(e) => handle(e)}
                value={data.postText}
                placeholder={post?.postText}
              />
              {errField.postTextErr.length > 0 && (
                <span className="error" style={{ color: "red" }}>
                  {errField.postTextErr}
                </span>
              )}
              <br />

              <Form.Group controlId="profilePicture">
                <Form.Label>Choose Community Profile Picture</Form.Label>
                <Form.Control
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleFileChange}
                  onKeyUp={() => validForm("picture")}
                  onBlur={() => validForm("picture")}
                />
              </Form.Group>
              {/* <button onClick={handleUpload}>Upload</button> */}
              {errField.pictureErr.length > 0 && (
                <span className="error" style={{ color: "red" }}>
                  {errField.pictureErr}
                </span>
              )}

              <br />
              <div className="text-center mb-4">
                <img
                  src={fileSelected ? picture : post?.picture}
                  alt="Profile"
                  className="rounded-circle img-fluid"
                  style={{ maxWidth: "150px" }}
                />
              </div>

              <center>
                <button
                  type="submit"
                  name="submit"
                  className="btn btn-primary mb-3"
                  disabled={!selectedFile || isFormValid()} // Disable if no image is selected or form is invalid
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

export default UpdatePost;
