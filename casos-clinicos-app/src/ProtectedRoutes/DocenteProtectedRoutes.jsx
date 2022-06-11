import React from 'react'
import { Redirect, Route } from "react-router-dom";

export default function DocenteProtectedRoutes({ component: Component, ...restOfProps}) {
  const userRol = localStorage.getItem("rol").includes('docente');
    
    const user = {...restOfProps};

    return (
    <Route
    render={(props) =>
      userRol ? <Component usuario={user}/> : <Redirect to="/inicio-sesion" />
    }
  />
  )
}
