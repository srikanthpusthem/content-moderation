import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import './Navbar.css';

const NavigationBar = () => {
  return (
    <Navbar bg="dark" expand="lg" variant="dark">
      <div className="navbar-collapse"> {/* Use div to control layout */}
        <Navbar.Brand href="/" className="navbar-brand">
          Content Moderation
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto navbar-nav">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/examples">Content Examples</Nav.Link>
            <Nav.Link href="/flow">Project Flow</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default NavigationBar;
