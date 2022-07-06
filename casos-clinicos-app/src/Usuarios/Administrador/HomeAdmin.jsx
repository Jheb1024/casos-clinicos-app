//HomeAdmin.jsx
import React, {useState,useEffect} from "react";
import { getAuth } from "firebase/auth";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom"
import SidebarAD from "../../Componentes/Sidebar/SidebarAD"
import styled from "styled-components";
//Páginas admi
import AdministrarCuestionarios from "./AdministrarCuestionarios"
import AdministrarTemas from "./AdministrarTemas"
import ListaUsuarios from "./ListarUsuarios"
import ListaAlumnos from "./ListaAlumnos"
//iconos
import * as FaIcons from 'react-icons/fa';
import { MdQuiz } from "react-icons/md";

const HomeAdmin = ({user1}) => {

   const [userRol, setUserRol] = useState(null)

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
    
    
  }useEffect(() => {
      setUserRol(localStorage.getItem("rol"));
    
      return () => {
        setUserRol(localStorage.getItem("rol"));
      }
    }, [])
  return (
    <Div>
    <Router>
        <SidebarAD PrimerT="Administrar cuestionarios" PrimerR="/usuario/admin/administrar-cuestionarios" iconoP={<MdQuiz/>}
                   DosT="Administrar temas" DosR="/usuario/admin/administrar-temas" iconoS={<FaIcons.FaListAlt/>} 
                   TresT="Lista de usuarios" TresR="/usuario/admin/lista-usuarios" iconoT={<FaIcons.FaUserFriends/>}
        />
        <div className="content w-100">
            {/*<Route path="/usuario/admin/administrar-cuestionarios" exact="true" component={AdministrarCuestionarios} />
            <Route path="/usuario/admin/administrar-temas" exact="true" component={AdministrarTemas} />
            <Route path="/usuario/admin/lista-usuarios" exact="true" component={ListaUsuarios} />
            */}
            <Route path="/usuario/admin/administrar-temas"
              render={(props) =>
                userRol ? <AdministrarTemas user1={user}/> : <Redirect to={window.location} />
            }/>
            <Route path="/usuario/admin/administrar-cuestionarios"
              render={(props) =>
                userRol ? <AdministrarCuestionarios user1={user}/> : <Redirect to={window.location} />
            }/>
            <Route path="/usuario/admin/lista-usuarios"
              render={(props) =>
                userRol ? <ListaUsuarios user1={user}/> : <Redirect to={window.location} />
            }/>
            <Route path="/usuario/admin/ListaAlumnos"
              render={(props) =>
                userRol ? <ListaAlumnos user1={user}/> : <Redirect to={window.location} />
            }/>
            
            {/*<AdminProtectedRoutes path="/usuario/admin/administrar-cuestionarios" component={AdministrarCuestionarios} user={user}/>
            <AdminProtectedRoutes path="/usuario/admin/administrar-temas" component={AdministrarTemas} user={user}/>
            <AdminProtectedRoutes path="/usuario/admin/lista-usuarios" component={ListaUsuarios} user={user}/>*/}
        </div>

    </Router>
</Div>
  );
}
export default HomeAdmin
const Div = styled.div`
  position: relative;
`;