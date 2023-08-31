import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import TopMenu from "./Navbar/TopMenu";
import axios from "axios";
import { useNavigate } from "react-router";
import Button from "react-bootstrap/Button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { useLayoutEffect } from "react";
const CommunityViewAll = () => {
  const userData = useSelector((state) => {
    return state.users;
  });
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get("http://localhost:5000/communities/readAllCommunities")
      .then((response) => {
        const { communities } = response.data;
        setCommunities(communities);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching communities:", error);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (communityId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/communities/deleteCommunity/${communityId}`
      );
      toast.success(response.data.message);
    } catch (error) {
      toast.error("An error occurred.");
    }
  };

  const handleJoin = async (communityId) => {
    const userId = userData.user._id;
    console.log("USER ID NEW----->", userId);
    try {
      const response = await axios.post(
        `http://localhost:5000/communities/joinCommunity/${communityId}`,
        {
          userId,
        }
      );
      toast.success(response.data.message);
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const buttonStyle = {
    margin: "1rem ", // Add 1rem top and bottom margin
  };
  const containerStyle = {
    backgroundImage: "url(Image/picSignUp.jpg)",
    backgroundSize: "cover",
    minHeight: "calc(100vh - 56px)", // Adjust for navbar height
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0",
    margin: "0",
  };

  const cardStyle = {
    width: "80%",
    padding: "30px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
  };

  const headingStyle = {
    textAlign: "center",
    marginBottom: "20px",
  };

  const communityItemStyle = {
    cursor: "pointer",
    padding: "10px",
    border: "1px solid #ccc",
    marginBottom: "5px",
    borderRadius: "5px",
  };

  // Handle the click event, for example, navigate to community details
  const handleCommunityClick = (communityId) => {
    console.log("Clicked on community with ID:", communityId);
    navigate(`/viewCommunity/${communityId}`);
  };
  const handleUpdateClick = (communityId) => {
    console.log("Clicked on community with ID:", communityId);
    navigate(`/updateCommunity/${communityId}`);
  };
  return (
    <div>
      <ToastContainer />
      <TopMenu />
      <div style={containerStyle}>
        <Card style={cardStyle}>
          <Card.Title style={headingStyle}>Community List</Card.Title>
          <div>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div>
                {communities.map((community) => (
                  <div style={communityItemStyle}>
                    {community.name}
                    <div className="text-center mb-4">
                      <img
                        src={community.picture}
                        alt="Profile"
                        className="rounded-circle img-fluid"
                        style={{ maxWidth: "150px" }}
                      />
                    </div>
                    <Button
                      variant="primary"
                      style={buttonStyle}
                      key={community._id}
                      onClick={() => handleCommunityClick(community._id)}
                    >
                      - VIEW COMMUNITY
                    </Button>
                    <Button
                      variant="danger"
                      style={buttonStyle}
                      key={community._id}
                      onClick={() => handleDelete(community._id)}
                    >
                      - DELETE COMMUNITY
                    </Button>
                    <Button
                      variant="warning"
                      style={buttonStyle}
                      key={community._id}
                      onClick={() => handleUpdateClick(community._id)}
                    >
                      [*] UPDATE COMMUNITY
                    </Button>
                    <Button
                      variant="success"
                      style={buttonStyle}
                      key={community._id}
                      onClick={() => handleJoin(community._id)}
                    >
                      + JOIN COMMUNITY
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CommunityViewAll;
