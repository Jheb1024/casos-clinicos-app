import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import InicioSesion from "../Componentes/IncioSesion/InicioSesion";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import firebaseApp from "C:/Users/jhan_/Documents/casosc-app/casos-clinicos-app/casos-clinicos-app/src/Firebase/firebase-config.js";
import { useAuth } from "../Firebase/firebase_db";
import styled from "styled-components";
import "bootstrap";
import "./header.css";
import logo from "./CC_LOGO.png";
import { Dropdown , Navbar, Nav, Container, NavDropdown, NavLink } from "react-bootstrap";
import {LinkContainer} from 'react-router-bootstrap';


export default function Header() {
  const [loading, setLoading] = useState(false);

  const auth = getAuth(firebaseApp);
  const currentUser = useAuth();

  function cerrarSesion() {
    signOut(auth)
      .then((user) => {
        window.localStorage.removeItem('rol');
        window.localStorage.clear();
        console.log("El usaurio a cerrado la sesion");
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  const dropRgistro = (
    <li className="nav-item dropdown ">
      <a className="nav-link dropdown-toggle" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown"
        aria-expanded="true"
        
      >
        Registro
      </a>
      <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
        <li>
          <Link to={"/registro-docente"} style={{textDecoration:'none'}}>Docente</Link>
        </li>
        <li>
        <Link to={"/registro-alumno"} style={{textDecoration:'none'}}>Alumno</Link>
        </li>
      </ul>
    </li>
  );
  const leftLinkStyle = {
    textDecoration: "none",
    color: "white",
    fontSize: "25px",
  };
  const StyledLeftLink = styled(Link)`
    text-decoration: none;
    color: white;
    font-size: 25px;
    &:hover {
      color: white;
    }
    @media (max-width: 850px) {
      font-size: 20px;
    }
  `;

  const StyledRightLink = styled(Link)`
    text-decoration: none;
    &:hover {
      color: white;
    }
    color: white;
    margin-left: 15px;
    font-size: 20px;
    @media (max-width: 850px) {
      font-size: 18px;
    }
  `;

 

  return (
    <Navbar className="color-nav" collapseOnSelect expand="lg" variant="dark">
  <Container>
    <LinkContainer to="/">
    <Navbar.Brand >Casos Clínicos</Navbar.Brand>
    </LinkContainer>
  
  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
  <Navbar.Collapse id="responsive-navbar-nav">
    <Nav className="me-auto">
      
      
    </Nav>
    <Nav>
    {!currentUser ? 
    <NavDropdown title="Registro" id="collasible-nav-dropdown" >
      <LinkContainer to="/registro-docente" ><NavDropdown.Item >Docente</NavDropdown.Item></LinkContainer>
        <LinkContainer to="/registro-alumno"><NavDropdown.Item >Alumno</NavDropdown.Item></LinkContainer>
      </NavDropdown> : null}

      {!currentUser ? <LinkContainer to="/inicio-sesion"><Nav.Link >Iniciar Sesión</Nav.Link></LinkContainer>: null}
      {currentUser ?<LinkContainer to="/" onClick={cerrarSesion} ><Nav.Link >Cerrar Sesión</Nav.Link></LinkContainer> : null}
    </Nav>
  </Navbar.Collapse>
  </Container>
</Navbar>
  );
}
