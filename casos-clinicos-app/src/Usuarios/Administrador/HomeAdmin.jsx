//HomeAdmin.jsx
import React from "react";
import { getAuth } from "firebase/auth";
import { BrowserRouter as Router, Route } from "react-router-dom"
import SidebarAD from "../../Componentes/Sidebar/SidebarAD"
import styled from "styled-components";
//Páginas admi
import AdministrarCuestionarios from "./AdministrarCuestionarios"
import AdministrarTemas from "./AdministrarTemas"
import ListaUsuarios from "./ListarUsuarios"
//iconos
import * as FaIcons from 'react-icons/fa';
import { MdQuiz } from "react-icons/md";
import PerfilDocente from "./PerfilDocente";

const HomeAdmin = ({usuario}) => {


  const auth = getAuth();
  const user = auth.currentUser;
  if (user !== null) {
    // The user object has basic properties such as display name, email, etc.
    const displayName = user.displayName;
    const email = user.email;
    const photoURL = user.photoURL;
    const emailVerified = user.emailVerified;
    console.log("Datos del usuario desed el apartado del admin")
    console.log(user);
    console.log(email);
    //Aqui podemos tomar el user UID para poder realizar una búsqueda del rol
    //Para ello debemos crear tabla de usuarios con correo y el rol para realizar solo una lectura
    //es decir ejecutamos la consulta para saber el rol de la persona que se está loguaendo

    const uid = user.uid;
  }
  return (
    <Div>
    <Router>
        <SidebarAD PrimerT="Administrar cuestionarios" PrimerR="/usuario/admin/administrar-cuestionarios" iconoP={<MdQuiz/>}
                   DosT="Administrar temas" DosR="/usuario/admin/administrar-temas" iconoS={<FaIcons.FaListAlt/>} 
                   TresT="Lista de usuarios" TresR="/usuario/admin/lista-usuarios" iconoT={<FaIcons.FaUserFriends/>}
        />
        <div className="content w-100">
            <Route path="/usuario/admin/administrar-cuestionarios" exact="true" component={AdministrarCuestionarios} />
            <Route path="/usuario/admin/administrar-temas" exact="true" component={AdministrarTemas} />
            
            <Route path="/usuario/admin/lista-usuarios" exact="true" component={ListaUsuarios} />
        </div>

    </Router>
</Div>
  );
}
export default HomeAdmin
const Div = styled.div`
  position: relative;
`;