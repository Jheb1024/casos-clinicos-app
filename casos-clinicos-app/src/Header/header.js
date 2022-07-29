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
import {Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import {LinkContainer} from 'react-router-bootstrap';


export default function Header() {

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

  return (
    <Navbar className="color-nav" collapseOnSelect expand="lg" variant="dark">
  <Container>
  {!currentUser ? <LinkContainer to="/">
    <Navbar.Brand >Casos Clínicos</Navbar.Brand>
    </LinkContainer>: <Navbar.Brand >Casos Clínicos</Navbar.Brand>}
  
  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
  <Navbar.Collapse id="responsive-navbar-nav">
    <Nav className="me-auto">
      
      
    </Nav>
    <Nav>
    {!currentUser ? 
    <NavDropdown title="Registro" id="collasible-nav-dropdown">
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
