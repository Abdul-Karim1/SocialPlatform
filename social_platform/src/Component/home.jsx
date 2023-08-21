import { Container } from 'react-bootstrap';
import React from 'react';



const Home = () => {
return(
<Container fluid style={{backgroundImage: "url(Image/pic2.jpg)", height: '100vh',backgroundSize: "cover",alignItems: "center", justifyContent: "center",padding:"180px" }}>
    <h1 style={{color:'yellow'}}>HOME PAGE</h1>
</Container>

); 
}

export default Home;