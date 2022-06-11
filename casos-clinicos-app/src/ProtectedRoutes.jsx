import React from 'react'
import { Redirect, Route } from "react-router-dom";

function RoutesProtected({ component: Component, ...restOfProps}) {
    const userRol = localStorage.getItem("rol");
    
    const data = {...restOfProps};
    
  return (
    <Route
      render={(props) =>
        !userRol ? <Component data={data}/> : <Redirect to="/inicio-sesion" />
      }
    />
    
  )
}

export default RoutesProtected