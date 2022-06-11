import React, {useState, useEffect} from 'react'
import { Redirect, Route } from "react-router-dom";
import InicioSesion from '../Componentes/IncioSesion/InicioSesion';


  

function AdminProtectedRoutes({ component: Component, ...restOfProps}) {
 const [userRol, setUserRol] =  useState(localStorage.getItem("rol").includes('admin'));
  

    const user = {...restOfProps};

    return (
    <Route
    render={(props) =>
      userRol ? <Component user1={user}/> : <Redirect to={'/inicio-sesion'}/>
    }
  />
  )
}

export default AdminProtectedRoutes