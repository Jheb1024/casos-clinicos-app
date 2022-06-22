//HomeDocente.jsx
import React from "react";
import SidebarAD from "../../Componentes/Sidebar/SidebarAD"
import { BrowserRouter as Router, Route} from "react-router-dom"
//Páginas para el usuario docente
import ListaAlumno from "./ListaAlumnos";
import MiperfilD from "./MiperfilD";
import AgregarCuestionario from "./AgregarCuestionario";

//Iconos

import * as FaIcons from 'react-icons/fa';


import styled from "styled-components";
import Cuestionario from "../../Componentes/Cuestionario/Cuestionario";
import MisCuestionarios from "./MisCuestionarios/MisCuestionarios";



const HomeDocente = ({usuario}) => {
    console.log("usuario home docente", usuario.user)
    const userRol = localStorage.getItem("rol");
    return (
        <Div>
            <Router>
                <SidebarAD PrimerT="Lista de alumnos" PrimerR="/usuario/docente/lista-alumno" iconoP={<FaIcons.FaList/>}
                           TresT="Mi perfil" TresR="/usuario/docente/miperfil-docente" iconoT={<FaIcons.FaAddressCard/>}
                           DosT="Mis cuestionarios" DosR="/usuario/docente/mis-cuestionarios" iconoS={<FaIcons.FaAddressBook/>}
                />
                <div className="content w-100">
                    <Route path="/usuario/docente/lista-alumno" >{<ListaAlumno user1={usuario.user}/>}</Route>
                    {/*<Route path="/usuario/docente/lista-alumno" 
                        render={(props) =>
                            {userRol ? <ListaAlumno user1={usuario}/> : <Redirect to="/inicio-sesion" />}
                        }/>*/}
                    <Route path="/usuario/docente/agregarcuestionario-docente" >{<AgregarCuestionario user={usuario.user}/>}</Route>
                    
                    <Route path="/usuario/docente/miperfil-docente" >{<MiperfilD user={usuario.user}/>}</Route>
                    <Route path="/usuario/docente/crear-cuestionario">{<Cuestionario user={usuario.user}/>}</Route>
                    <Route path='/usuario/docente/mis-cuestionarios'>{<MisCuestionarios user={usuario.user}/>}</Route>
                </div>

            </Router>
        </Div>

    );
}
export default HomeDocente

const Div = styled.div`
  position: relative;
`;