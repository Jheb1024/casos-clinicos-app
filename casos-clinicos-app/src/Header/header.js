import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import { Link } from "react-router-dom";
import InicioSesion from "../Componentes/IncioSesion/InicioSesion";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import firebaseApp from "C:/Users/jhan_/Documents/casosc-app/casos-clinicos-app/casos-clinicos-app/src/Firebase/firebase-config.js";
import { useAuth } from "../Firebase/firebase_db";

export default function Header(){

  const [loading, setLoading] = useState(false);

  const auth = getAuth(firebaseApp);
  const currentUser = useAuth();

  function cerrarSesion(){
    signOut(auth).then((user)=>{
      console.log("El usaurio a cerrado la sesion");
    }).catch((err)=>{
      console.log(err.message);
    })
  }

      
   

    return(
     
        <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container-fluid">
          <div class="navbar-collapse collapse w-100 order-1 order-md-0 dual-collapse2">
          <Link class="navbar-brand" to="/">Home</Link>
            <button
              class="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarColor01"
              aria-controls="navbarColor01"
              aria-expanded="false"
              aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <p>Bienvenido: { currentUser?.email}</p>
          </div>

          <div class="navbar-collapse collapse w-120 order-3 dual-collapse2">
            <ul class="navbar-nav me-auto">
              <li className="nav-item active">
                
              </li>
              <li class="nav-item active">
            
              {!currentUser ? <Link class="nav-link" to="/inicio-sesion">Iniciar sesión</Link>: null}
              </li>
              <li class="nav-item">
               {!currentUser ? <Link class="nav-link" to="/registro" >Registro</Link> : null}
              </li>
              <li class="nav-item">
              {currentUser ? <Link class="nav-link" to="/" onClick={cerrarSesion}>Cerrar sesión</Link> : null}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
}

