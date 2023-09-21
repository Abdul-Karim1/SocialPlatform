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
import "../Notification/Notification.css"; // Replace "Chat.css" with the actual filename

const Notification = () => {
  const userData = useSelector((state) => {
    return state.users;
  });

  const dummy = {
    user: "",
    notification: "",
    community: "",
  };

  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [data, setData] = useState(dummy);
  const [isMessageReceived, setIsMessageReceived] = useState(false);

  const deleteNotification = async (notificationId, index) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/notifications/deleteNotification/${notificationId}`,
        {
          data: { user: userData.user },
        }
      );

      if (response.status === 200) {
        const updatedNotification = [...notifications];
        updatedNotification.splice(index, 1);
        setNotifications(updatedNotification);
        toast.success(response.data.message);
      } else if (response.status === 404) {
        toast.error(response.data.message); // Not found
      } else {
        toast.error("An error occurred while deleting the notification.");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the message.");
    }
  };

  const handleNotification = (val) => {
    console.log("----------------->USERRRRRRRR", userData.user);
    const updatedData = {
      ...data,
      community: id,
      notification: val + " in the community ",
      user: userData.user,
    };
    axios
      .post(
        "http://localhost:5000/notifications/createNotification",
        updatedData
      )
      .then((res) => {
        notifications.push(updatedData);
        setNotifications([...notifications]);
        console.log("NOTIFICATION DATA", updatedData);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "NEW NOTIFICATION",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => {
        if (error.response) {
          const errorMessage = error.response.data.message;
          console.log("----------------->", userData.user);
          toast.error(errorMessage);
        } else {
          console.log("----------------->", userData.user);
          toast.error("An error occurred. Please try again.");
        }
      });
  };

  const getNotification = () => {
    axios
      .get(`http://localhost:5000/notifications/readNotification/${id}`)
      .then((response) => {
        console.log("RESPONSEEEEEE--->", response);
        // const { notification } = response.data.data;
        // console.log("notification---->", notification);
        setNotifications(response.data);
        console.log("---------->", notifications);
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch((error) => {
        console.error("Error fetching Notification:", error);
        setLoading(false); // Set loading to false in case of an error
      });
  };

  useEffect(() => {
    axios
      .get(`http://localhost:5000/notifications/readNotification/${id}`)
      .then((response) => {
        console.log("RESPONSEEEEEEEEEEEEEEEE--->", response);
        //const { notification } = response.data.data;
        // console.log("NOTIFICATIONS---->", notification);
        // setNotifications(notification);
        // setLoading(false); // Set loading to false once data is fetched
        setNotifications(response.data);
        console.log("---------->", notifications);
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch((error) => {
        console.error("Error fetching Notification:", error);
        setLoading(false); // Set loading to false in case of an error
      });
  }, ["notification"]);

  useEffect(() => {
    const socket = socketClient("http://localhost:5000");

    socket.on("new-message", (arg) => {
      console.log(arg);
      getNotification();
    });
    socket.on("new-notification", (arg) => {
      console.log(arg);
      getNotification();
      handleNotification(arg);
    });

    socket.on("delete-notification", (arg) => {
      console.log(arg);
      getNotification();
      handleNotification(arg);
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
          <Card.Header as="h5">NOTIFICATIONS</Card.Header>
          <Card.Body>
            <Card.Title>COMMUNITY NOTIFICATIONS</Card.Title>
            <Card.Text>
              <div className="chat-messages">
                {notifications &&
                  notifications.length > 0 &&
                  notifications.map((notification, index) => (
                    <div key={index} className="message">
                      {notification.notification}
                      {notification.community && (
                        <strong>{notification.community.name}</strong>
                      )}
                      <Button
                        variant="danger"
                        className="delete-button"
                        onClick={() =>
                          deleteNotification(notification._id, index)
                        }
                      >
                        Delete
                      </Button>
                    </div>
                  ))}
              </div>
            </Card.Text>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Notification;
