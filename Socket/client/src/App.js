import React, { useEffect } from "react"; // Import React and useEffect
import socketIOClient from "socket.io-client";

const socket = socketIOClient("http://localhost:4000");

function App() {
  useEffect(() => {
    // You can use socket to interact with the server here
    // For example, you can listen for events from the server:
    socket.on("server-event-name", (data) => {
      console.log("Received data from the server:", data);
    });

    // Don't forget to clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []); // The empty array means this effect runs once, similar to componentDidMount

  return (
    <div>
      <p>Hello World!</p>
    </div>
  );
}

export default App;
