import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav"; // Import Nav
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetUser } from "../../Store/Slices/UserSlices"; // Adjust the path as needed

function TopMenu() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = () => {
    // Dispatch the action to reset user data
    dispatch(resetUser());
    navigate("/"); // Redirect to the desired route after logout
  };

  const Profile = () => {
    navigate("/UserProfile");
  };
  return (
    <Navbar className="bg-body-tertiary justify-content-between">
      <Nav>
        <Button variant="danger" className="mr-3" onClick={Profile}>
          Profile
        </Button>
      </Nav>

      <Nav>
        <Button variant="danger" className="mr-3" onClick={handleLogout}>
          Log Out
        </Button>
      </Nav>
    </Navbar>
  );
}

export default TopMenu;
