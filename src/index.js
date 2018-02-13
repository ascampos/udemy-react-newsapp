import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App";
import Javascript from "./components/Javascript";
import Python from "./components/Python";

import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Navbar, Nav, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import registerServiceWorker from "./registerServiceWorker";

const Root = () => (
  <Router basename="/udemy-react-newsapp">
    <div>
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">NEWSAPP</Link>
          </Navbar.Brand>

          <Navbar.Toggle />
        </Navbar.Header>

        <Navbar.Collapse>
          <Nav>
            <LinkContainer exact to="/" activeclassname="active">
              <NavItem>Home</NavItem>
            </LinkContainer>

            <LinkContainer exact to="/javascript" activeclassname="active">
              <NavItem>Javascript</NavItem>
            </LinkContainer>

            <LinkContainer exact to="/python" activeclassname="active">
              <NavItem>Python</NavItem>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Route exact path="/" component={App} />
      <Route exact path="/javascript" component={Javascript} />
      <Route exact path="/python" component={Python} />
    </div>
  </Router>
);

ReactDOM.render(<Root />, document.getElementById("root"));
registerServiceWorker();
