//Esto van en HomeAlumno.jsx
import React, { useState, useEffect } from "react"
import styled from "styled-components";
import SidebarAD from "../../Componentes/Sidebar/SidebarAD"
import { BrowserRouter as Router, Route } from "react-router-dom"
//Páginas para ménu del alumno
import CuestionariosA from './CuestionariosA'
import MiavanceA from './MiavanceA'
import Miperfil from './Miperfil'
//iconos
import * as FaIcons from 'react-icons/fa';
function HomeAlumno({usuario}) {

  

  
    

    console.log("leemos el usuario desde home alumno",usuario.uid);
    return (
        <Div>
        <Router>
                <SidebarAD PrimerT="Cuestionarios" PrimerR="/usuario/alumno/cuestionarios-alumno" iconoP={<FaIcons.FaBookOpen/>}
                           DosT="Mi avance" DosR="/usuario/alumno/miavance-alumno" iconoS={<FaIcons.FaChartLine/>} 
                           TresT="Mi perfil" TresR="/usuario/alumno/miperfil-alumno" iconoT={<FaIcons.FaUserAlt />}
                />
                <div className="content w-100">

                    <Route path="/usuario/alumno/cuestionarios-alumno" exact="true"  component={CuestionariosA} />
                    <Route path="/usuario/alumno/miperfil-alumno"  >{<Miperfil user = {usuario}/>}</Route>
                    <Route path="/usuario/alumno/miavance-alumno"  exact="true" component={MiavanceA} />
                </div>

        </Router>
        </Div>
    );
}
export default HomeAlumno

const Div = styled.div`
  position: relative;
`;