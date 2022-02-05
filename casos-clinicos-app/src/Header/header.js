import React from "react";
import { Link } from "react-router-dom";
import InicioSesion from "../Componentes/IncioSesion/InicioSesion";

export default function Header(){
   
    
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
          </div>

          <div class="navbar-collapse collapse w-120 order-3 dual-collapse2">
            <ul class="navbar-nav me-auto">
              <li class="nav-item active">
              <Link class="nav-link" to="/inicio-sesion">Iniciar Sesión</Link>
              </li>
              <li class="nav-item">
               <Link class="nav-link" to="/registro">Registro</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
}

