import "./App.css";
import Header from "./Header/header";
import Footer from "./Footer/Footer";
import InicioSesion from "./Componentes/IncioSesion/InicioSesion";
import Registro from "./Componentes/Registro/Registro";
import RegistroDocente from "./Componentes/Registro/RegistroDocente";
import HomeAdmin from "./Usuarios/Administrador/HomeAdmin";
import HomeDocente from "./Usuarios/Docente/HomeDocente";
import HomeAlumno from "./Usuarios/Alumno/HomeAlumno";

import {
  BrowserRouter as Router,
  Routes,
  Switch,
  Route,
  NavLink,
} from "react-router-dom";
import { useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
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
import RoutesProtected from "./ProtectedRoutes";
import AdminProtectedRoutes from "./ProtectedRoutes/AdminProtectedRoutes";
import DocenteProtectedRoutes from "./ProtectedRoutes/DocenteProtectedRoutes";
import { Redirect } from "react-router-dom";
import AlumnoProtectedRoutes from "./ProtectedRoutes/AlumnoProtectedRoutes";
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
  });

  return (
    <div className="App">
      <div className="content-wrap">
        <Router>
          <Header></Header>
          <Switch>
            {/*<Route path="/inicio-sesion/">
              <InicioSesion></InicioSesion></Route>*/}

            {/**Rutas publicas */}
            <RoutesProtected exact path="/inicio-sesion" component={InicioSesion} user={user}/>

            <RoutesProtected path='/registro-alumno' component={Registro} user={user}/>
            <Route path="/registro-docente">
              <RegistroDocente></RegistroDocente>
            </Route>
            <Route path="/reiniciar-password">
              <ReiniciarPasswordUI></ReiniciarPasswordUI>
            </Route>
            <Route path="/" exact>
              <h1 className="h1">¡Bienvenido(a) a Casos Clínicos!</h1>
            </Route>
            {/**Rutas privadas del administrador */}
            { user ? <AdminProtectedRoutes path="/usuario/admin" component={HomeAdmin} user={user}/> :
             <Redirect to='/inicio-sesion'/>}
            {/*<AdminProtectedRoutes path="/usuario/admin/administrar-cuestionarios" component={AdministrarCuestionarios} user={user}/>
            <AdminProtectedRoutes path="/usuario/admin/administrar-temas" component={AdministrarTemas} user={user}/>
            <AdminProtectedRoutes path="/usuario/admin/lista-usuarios" component={ListaUsuarios} user={user}/>*/}

            {/**Rutas privadas del docente */}
           { user ? <DocenteProtectedRoutes path='/usuario/docente' component={HomeDocente} user={user}/> :
            <Redirect to='/inicio-sesion'/>}
            {/*<Route path="/usuario/docente/miperfil-docente">
              <MiperfilD></MiperfilD>
            </Route>
            <Route path="/usuario/docente/agregarcuestionario-docente">
              <AgregarCuestionario></AgregarCuestionario>
            </Route>*/}
            

            {/**Rutas privadas del alumno 
            <Route path="/usuario/alumno">
              {user && <HomeAlumno usuario={user} />}
            </Route>*/}
            { user ? <AlumnoProtectedRoutes path='/usuario/alumno' component={HomeAlumno} user={user}/> :
             <Redirect to='/inicio-sesion'/>}
            
            {/** 
            <Route path="/usuario/docente/agregar-alumnoD">
              <AgregarAlumno></AgregarAlumno>
            </Route>
            <Route path="/usuario/docente/lista-alumno">
              <ListaAlumno></ListaAlumno>
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
          */}
          </Switch>
        </Router>
        <Footer></Footer>
      </div>
    </div>
  );
}

export default App;
