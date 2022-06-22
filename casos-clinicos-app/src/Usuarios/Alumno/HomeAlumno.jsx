//Esto van en HomeAlumno.jsx
import React from "react"
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

  

  
    

    console.log("leemos el usuario desde home alumno",usuario.user.uid);
    return (
        <Div>
        <Router>
                <SidebarAD PrimerT="Cuestionarios" PrimerR="/usuario/alumno/cuestionarios-alumno" iconoP={<FaIcons.FaBookOpen/>}
                           DosT="Mi avance" DosR="/usuario/alumno/miavance-alumno" iconoS={<FaIcons.FaChartLine/>} 
                           TresT="Mi perfil" TresR="/usuario/alumno/miperfil-alumno" iconoT={<FaIcons.FaUserAlt />}
                           
                />
                <div className="content w-100">
                    <Route path="/usuario/alumno/cuestionarios-alumno">{<CuestionariosA user = {usuario}/>}</Route>
                    <Route path="/usuario/alumno/miperfil-alumno"  >{<Miperfil user = {usuario.user}/>}</Route>
                    <Route path="/usuario/alumno/miavance-alumno"  >{<MiavanceA user = {usuario.user}/>}</Route>
                </div>

        </Router>
        </Div>
    );
}
export default HomeAlumno

const Div = styled.div`
  position: relative;
`;