import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import { Link } from "react-router-dom";
import InicioSesion from "../Componentes/IncioSesion/InicioSesion";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import firebaseApp from "C:/Users/jhan_/Documents/casosc-app/casos-clinicos-app/casos-clinicos-app/src/Firebase/firebase-config.js";
import { useAuth } from "../Firebase/firebase_db";
import 'bootstrap';
import "./header.css";
import logo from "./Logo_CC02.png";

export default function Header() {

  const [loading, setLoading] = useState(false);

  const auth = getAuth(firebaseApp);
  const currentUser = useAuth();

  function cerrarSesion() {
    signOut(auth).then((user) => {
      console.log("El usaurio a cerrado la sesion");
    }).catch((err) => {
      console.log(err.message);
    })
  }

  const dropRgistro = (

    <li className="nav-item dropdown">
      <a className="nav-link dropdown-toggle" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="true">
        Registro
      </a>
      <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
        <li ><a className="dropdown-item" href="/registro-docente">Docente</a></li>
        <li><a className="dropdown-item" href="/registro-alumno">Alumno</a></li>
      </ul>
    </li>
  )


  return (

    <nav className="navbar navbar-expand-lg navbar-dark ">
      <div className="container-fluid">
        <div className="navbar-collapse collapse w-100 order-1 order-md-0 dual-collapse2">
          <Link className="navbar-brand" to="/"><img src={logo}
            width="250"
            height="60"
            shadow="grey"></img>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarColor01"
            aria-controls="navbarColor01"
            aria-expanded="false"
            aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          {/*<p>Bienvenido: {currentUser?.email}</p>*/}
        </div>

        <div className="navbar-collapse collapse w-120 order-3 dual-collapse2">
          <ul className="navbar-nav me-auto">

            <div className="nav-item">
              {!currentUser ? dropRgistro : null}
            </div>
            <li className="nav-item active">

              {!currentUser ? <Link className="flex-sm-fill text-sm-center nav-link" to="/inicio-sesion">Iniciar sesión</Link> : null}
            </li>
            <li className="nav-item">
              {currentUser ? <Link className="nav-link" to="/" onClick={cerrarSesion}>Cerrar sesión</Link> : null}
            </li>



          </ul>
        </div>
      </div>
    </nav>
  );
}

