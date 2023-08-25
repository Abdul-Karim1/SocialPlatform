import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav"; // Import Nav
import { useNavigate } from "react-router-dom";

function TopMenu() {
  const navigate = useNavigate();
  const handleLogout = () => {
    // Perform logout actions here
    navigate("/"); // Redirect to the desired route after logout
  };
  const EditProfile = () => {
    navigate("/EditProfile");
  };
  const ChangePassword = () => {
    navigate("/ChangePassword");
  };
  const Profile = () => {
    navigate("/UserProfile");
  };
  return (
    <Navbar className="bg-body-tertiary justify-content-between">
      <Nav>
        <Button variant="warning" className="mr-3" onClick={ChangePassword}>
          Change Password
        </Button>
      </Nav>
      <Nav>
        <Button variant="danger" className="mr-3" onClick={handleLogout}>
          Log Out
        </Button>
      </Nav>
      <Form inline>
        <InputGroup>
          <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
          <Form.Control
            placeholder="Username"
            aria-label="Username"
            aria-describedby="basic-addon1"
          />
        </InputGroup>
      </Form>
      <Form inline>
        <Row>
          <Col xs="auto">
            <Form.Control
              type="text"
              placeholder="Search"
              className="mr-sm-2"
            />
          </Col>
          <Col xs="auto">
            <Button type="submit">Submit</Button>
          </Col>
        </Row>
      </Form>
      <Nav>
        <Button variant="danger" className="mr-3" onClick={Profile}>
          Profile
        </Button>
      </Nav>
    </Navbar>
  );
}

export default TopMenu;
