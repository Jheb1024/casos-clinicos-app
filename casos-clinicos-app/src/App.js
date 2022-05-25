import "./App.css";
import Header from "./Header/header";
import Footer from "./Footer/Footer";
import InicioSesion from "./Componentes/IncioSesion/InicioSesion";
import Registro from "./Componentes/Registro/Registro";
import RegistroDocente from "./Componentes/Registro/RegistroDocente";
import HomeAdmin from "./Usuarios/Administrador/HomeAdmin";
import HomeDocente from "./Usuarios/Docente/HomeDocente";
import HomeAlumno from "./Usuarios/Alumno/HomeAlumno";

import { BrowserRouter as Router, Routes, Switch, Route, NavLink } from "react-router-dom";
import { useState } from "react";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import firebaseApp from "./Firebase/firebase-config";
import ReiniciarPasswordUI from "./Componentes/ReiniciarPassword/ReiniciarPasswordUI";
//Paginas AlUMNO
import ListaAlumno from "./Usuarios/Docente/ListaAlumnos";
import MiperfilD from "./Usuarios/Docente/MiperfilD";
import AgregarCuestionario from "./Usuarios/Docente/AgregarCuestionario";
import CuestionariosA from "./Usuarios/Alumno/CuestionariosA";
import MiavanceA from "./Usuarios/Alumno/MiavanceA";
import Miperfil from "./Usuarios/Alumno/Miperfil";

//Páginas admi
import AdministrarCuestionarios from "./Usuarios/Administrador/AdministrarCuestionarios";
import AdministrarTemas from "./Usuarios/Administrador/AdministrarTemas";
import ListaUsuarios from "./Usuarios/Administrador/ListarUsuarios";
import Cuestionario from "./Componentes/Cuestionario/Cuestionario";
const auth = getAuth(firebaseApp);


function App() {

  const [user, setUser] = useState(null);

  onAuthStateChanged(auth, (usuarioFirebase) => {
    if (usuarioFirebase) {
      console.log("Usuario desde el app", usuarioFirebase);
      setUser(usuarioFirebase);
    } else {
      setUser(null);
    }
  })

  return (
    <div className="App">
      <div className="content-wrap">
        <Router>
          <Header>
          </Header>
          <Switch>
            <Route path="/inicio-sesion/">
              <InicioSesion></InicioSesion>
            </Route>
            <Route path="/registro-alumno" >
              <Registro></Registro>
            </Route>
            <Route path="/registro-docente" >
              <RegistroDocente></RegistroDocente>
            </Route>
            <Route path="/usuario/admin" >
              <HomeAdmin></HomeAdmin>
            </Route>
            <Route path="/usuario/docente" >
            {user && <HomeDocente usuario={user}/>}
            </Route>
            <Route path="/usuario/alumno" >
              {user && <HomeAlumno usuario={user}/>}
            </Route>
            <Route path="/reiniciar-password">
              <ReiniciarPasswordUI></ReiniciarPasswordUI>
            </Route>
            <Route path="/" exact>
                <h1 className="h1">¡Bienvenido(a) a CasosClínicos!</h1>
                
            </Route>

            <Route path="/usuario/docente/agregar-alumnoD">
            {/*<AgregarAlumno></AgregarAlumno>*/}
          </Route>
          <Route path="/usuario/docente/lista-alumno">
            <ListaAlumno></ListaAlumno>
          </Route>
          <Route path="/usuario/docente/miperfil-docente">
            <MiperfilD></MiperfilD>
          </Route>
          <Route path="/usuario/docente/agregarcuestionario-docente">
            <AgregarCuestionario></AgregarCuestionario>
          </Route>

          <Route path="/usuario/alumno/cuestionarios-alumno">
            <CuestionariosA></CuestionariosA>
          </Route>
          <Route path="/usuario/alumno/miavance-alumno">
            <MiavanceA></MiavanceA>
          </Route>
          <Route path="/usuario/alumno/miperfil-alumno">
            <Miperfil></Miperfil>
          </Route>

            <Route path="/usuario/admin/administrar-cuestionarios" >
            <AdministrarCuestionarios></AdministrarCuestionarios>
          </Route>
          <Route path="/usuario/admin/administrar-temas" >
            <AdministrarTemas></AdministrarTemas>
          </Route>
          <Route path="/usuario/admin/lista-usuarios" >
            <ListaUsuarios></ListaUsuarios>
          </Route>
          
          </Switch>
          
        </Router>
        <Footer>
          </Footer>
      </div>
    </div>


  );
}

export default App;
