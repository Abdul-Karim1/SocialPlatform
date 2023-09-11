import React, { useEffect } from "react";
import io from "socket.io";

const Connection = () => {
  useEffect(() => {
    // Initialize the socket connection
    const socket = io("http://localhost:6000/");

    // Set up the event listener for "hello"
    socket.on("hello", (arg, callback) => {
      console.log(arg); // "world"
      callback("got it");
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []); // Empty dependency array to ensure this runs once on component mount

  return (
    <div>
      <h1>HELLO WORLD</h1>
    </div>
  );
};

export default Connection;
