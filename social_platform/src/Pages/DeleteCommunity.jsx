import React, { useState } from "react";
import axios from "axios";

function CommunityDelete() {
  const [communityId, setCommunityId] = useState("");
  const [message, setMessage] = useState("");

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`/communities/${communityId}`);
      setMessage(response.data.message);
    } catch (error) {
      setMessage("An error occurred.");
    }
  };

  return (
    <div>
      <h1>Delete Community</h1>
      <input
        type="text"
        placeholder="Enter Community ID"
        value={communityId}
        onChange={(e) => setCommunityId(e.target.value)}
      />
      <button onClick={handleDelete}>Delete Community</button>
      <p>{message}</p>
    </div>
  );
}

export default CommunityDelete;
