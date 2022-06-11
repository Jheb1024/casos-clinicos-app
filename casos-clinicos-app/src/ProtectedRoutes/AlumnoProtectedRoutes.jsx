import React from 'react'
import { Redirect, Route } from "react-router-dom";

function AlumnoProtectedRoutes({ component: Component, ...restOfProps}) {
  const userRol = localStorage.getItem("rol").includes('alumno');
    
    const user = {...restOfProps};

    return (
    <Route
    render={(props) =>
      userRol ? <Component usuario={user}/> : <Redirect to="/inicio-sesion" />
    }
  />
  )
}

export default AlumnoProtectedRoutes