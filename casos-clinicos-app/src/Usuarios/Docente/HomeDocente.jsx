//HomeDocente.jsx
import React from "react";
import SidebarAD from "../../Componentes/Sidebar/SidebarAD"
import { BrowserRouter as Router, Route } from "react-router-dom"
//Páginas para el usuario docente
import ListaAlumno from "./ListaAlumnos";
import MiperfilD from "./MiperfilD";
import AgregarCuestionario from "./AgregarCuestionario";
//Iconos

import * as FaIcons from 'react-icons/fa';
import { MdQuiz } from "react-icons/md";

import styled from "styled-components";



const HomeDocente = () => {
    return (
        <Div>
            <Router>
                <SidebarAD PrimerT="Lista de alumnos" PrimerR="/usuario/docente/lista-alumno" iconoP={<FaIcons.FaList/>}
                           DosT="Agregar cuestionario" DosR="/usuario/docente/agregarcuestionario-docente" iconoS={<MdQuiz/>} 
                           TresT="Mi perfil" TresR="/usuario/docente/miperfil-docente" iconoT={<FaIcons.FaAddressCard/>}
                />
                <div className="content w-100">
                    <Route path="/usuario/docente/lista-alumno" exact="true" component={ListaAlumno} />
                    <Route path="/usuario/docente/agregarcuestionario-docente" exact="true" component={AgregarCuestionario} />
                    <Route path="/usuario/docente/miperfil-docente" exact="true" component={MiperfilD} />
                </div>

            </Router>
        </Div>

    );
}
export default HomeDocente

const Div = styled.div`
  position: relative;
`;