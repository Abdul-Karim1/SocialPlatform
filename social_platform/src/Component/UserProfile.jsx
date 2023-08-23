import React from "react";
import { Container } from "react-bootstrap";
import TopMenu from "./TopMenu";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import { UseSelector, useSelector } from "react-redux/es/hooks/useSelector";
// Import the image

const UserProfile = () => {
  const data = useSelector((state) => {
    return state.users;
  });
  console.log(data);
  const containerStyle = {
    backgroundImage: "url(Image/picSignUp.jpg)",
    backgroundSize: "cover",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "180px",
  };

  const headingStyle = {
    color: "yellow",
  };
  return (
    <div>
      <TopMenu />
      <Container fluid style={containerStyle}>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Name</th>
              <th>Interest</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{data.user.name}</td>
              <td>{data.user.interest}</td>
              <td>{data.user.email}</td>
              <td>
                <Link to="/EditProfile" variant="primary">
                  Edit
                </Link>
              </td>
            </tr>
          </tbody>
        </Table>
      </Container>
    </div>
  );
};

export default UserProfile;
