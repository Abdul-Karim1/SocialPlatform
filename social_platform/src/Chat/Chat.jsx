import React from "react";
import TopMenu from "../Pages/Navbar/TopMenu";
import { useState } from "react";
import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useParams } from "react-router";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Form } from "react-bootstrap";
import { useEffect } from "react";
import socketClient from "socket.io-client";
import TopMenu1 from "../Pages/Navbar/TopMenu1";

// Import the CSS file
import "../Chat/Chat.css"; // Replace "Chat.css" with the actual filename

const Chat = () => {
  const userData = useSelector((state) => {
    return state.users;
  });

  const dummy = {
    user: "",
    message: "",
    community: "",
  };

  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [data, setData] = useState(dummy);
  const [isMessageReceived, setIsMessageReceived] = useState(false);
  function handle(e) {
    const newData = { ...data };
    newData[e.target.id] = e.target.value;
    setData(newData);
    console.log(newData);
  }

  const [errField, setErrField] = useState({
    messageErr: "",
  });

  // const deleteMessage = async (messageId, index) => {
  //   try {
  //     const response = await axios.delete(
  //       `http://localhost:5000/chats/deleteChatMessage/${messageId}`,
  //       {
  //         data: { user: userData.user },
  //       }
  //     );

  //     if (response.status === 200) {
  //       const updatedChats = [...chats];
  //       updatedChats.splice(index, 1);
  //       setChats(updatedChats);
  //       toast.success(response.data.message);
  //     } else {
  //       // Handle other HTTP status codes
  //       if (response.status === 401) {
  //         // Unauthorized (401) status code
  //         toast.error(response.data.message);
  //       } else if (response.status === 404) {
  //         // Not Found (404) status code
  //         toast.error(response.data.message);
  //       } else {
  //         // Handle other HTTP status codes here
  //         toast.error("An error occurred while deleting the message.");
  //       }
  //     }
  //   } catch (error) {
  //     // Handle network or other errors from the frontend
  //     console.error(error);
  //     toast.error(
  //       "An error occurred while deleting the message from the frontend."
  //     );
  //   }
  // };
  const deleteMessage = async (messageId, index) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/chats/deleteChatMessage/${messageId}`,
        {
          data: { user: userData.user },
        }
      );

      if (response.status === 200) {
        const updatedChats = [...chats];
        updatedChats.splice(index, 1);
        setChats(updatedChats);
        toast.success(response.data.message);
      } else if (response.status === 401) {
        // Unauthorized (401) status code
        toast.error(
          "Unauthorized: Only the user who sent the message can delete it."
        );
      } else if (response.status === 404) {
        // Not Found (404) status code
        toast.error("Chat not found.");
      } else {
        // Handle other HTTP status codes here
        toast.error("An error occurred while deleting the message.");
      }
    } catch (error) {
      // Handle network or other errors from the frontend
      console.error(error);
      toast.error("An error occurred while deleting the message.");
    }
  };

  const validForm = (fieldName) => {
    let formIsValid = true;

    switch (fieldName) {
      case "message":
        if (data.message === "") {
          formIsValid = false;
          setErrField((prevState) => ({
            ...prevState,
            messageErr: "Please Enter Some Message",
          }));
        } else {
          setErrField((prevState) => ({
            ...prevState,
            messageErr: "",
          }));
        }
        break;
    }

    return formIsValid;
  };

  const isFormValid = () => {
    return !(errField.messageErr.length === 0);
  };

  const handleSendMessage = (event) => {
    if (validForm("message")) {
      event.preventDefault();
      const updatedData = {
        ...data,
        community: id,
        user: userData.user,
      };

      axios
        .post(
          `http://localhost:5000/chats/createChatMessage/${id}`,
          updatedData
        )
        .then((res) => {
          chats.push(updatedData);
          setChats([...chats]);
          console.log("CHAT DATA", updatedData);
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Message Sent",
            showConfirmButton: false,
            timer: 1500,
          });
        })
        .catch((error) => {
          if (error.response) {
            const errorMessage = error.response.data.message;
            toast.error(errorMessage);
          } else {
            toast.error("An error occurred. Please try again.");
          }
        });
    } else {
      toast.error("INVALID FORM");
    }
  };
  const getMessage = () => {
    axios
      .get(`http://localhost:5000/chats/readChatMessage/${id}`)
      .then((response) => {
        console.log("RESPONSEEEEEEEEEEEEEEEE--->", response);
        const { chat } = response.data;
        console.log("COMMENTTTTTTTTTTTTTTT---->", chat);
        setChats(chat);
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch((error) => {
        console.error("Error fetching Comment:", error);
        setLoading(false); // Set loading to false in case of an error
      });
  };
  useEffect(() => {
    axios
      .get(`http://localhost:5000/chats/readChatMessage/${id}`)
      .then((response) => {
        console.log("RESPONSEEEEEEEEEEEEEEEE--->", response);
        const { chat } = response.data;
        console.log("COMMENTTTTTTTTTTTTTTT---->", chat);
        setChats(chat);
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch((error) => {
        console.error("Error fetching Comment:", error);
        setLoading(false); // Set loading to false in case of an error
      });
  }, []);

  useEffect(() => {
    const socket = socketClient("http://localhost:5000");

    socket.on("new-message", (arg) => {
      console.log(arg);
      getMessage();
    });

    return () => {
      socket.disconnect();
    };
  }, []); // Corrected dependency

  return (
    <div>
      <ToastContainer />
      <TopMenu1 />
      <Container>
        <Card>
          <Card.Header as="h5">Messages</Card.Header>
          <Card.Body>
            <Card.Title>COMMUNITY CHAT</Card.Title>
            <Card.Text>
              <div className="chat-messages">
                {chats.map((chat, index) => (
                  <div key={index} className="message">
                    <strong>{chat.user.name}:</strong> {chat.message}
                    <Button
                      variant="danger"
                      className="delete-button"
                      onClick={() => deleteMessage(chat._id, index)}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            </Card.Text>
          </Card.Body>
          <div className="chat-input">
            <Form onSubmit={handleSendMessage}>
              <Form.Control
                type="text"
                onKeyUp={() => validForm("message")}
                onBlur={() => validForm("message")}
                placeholder="Type your message..."
                onChange={(e) => handle(e)}
                value={data.message}
                id="message"
              />
              {errField.messageErr.length > 0 && (
                <span className="error" style={{ color: "red" }}>
                  {errField.messageErr}
                </span>
              )}

              <Button
                type="submit"
                name="submit"
                className="btn btn-primary mb-3"
                disabled={isFormValid()}
              >
                Send
              </Button>
            </Form>
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default Chat;
