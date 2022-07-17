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
  Switch,
  Route,
} from "react-router-dom";
import { useState,useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebaseApp from "./Firebase/firebase-config";
import ReiniciarPasswordUI from "./Componentes/ReiniciarPassword/ReiniciarPasswordUI";

import RoutesProtected from "./ProtectedRoutes";
import AdminProtectedRoutes from "./ProtectedRoutes/AdminProtectedRoutes";
import DocenteProtectedRoutes from "./ProtectedRoutes/DocenteProtectedRoutes";
import { Redirect } from "react-router-dom";
import AlumnoProtectedRoutes from "./ProtectedRoutes/AlumnoProtectedRoutes";
const auth = getAuth(firebaseApp);

function App() {
  
  const [user, setUser] = useState(null);
  const [localUser, setLocalUser] = useState(null);
  
  useEffect(() => 
    //
    onAuthStateChanged(auth, (usuarioFirebase) => {
      if (usuarioFirebase) {
        console.log("Usuario desde el app", usuarioFirebase);
        setUser(usuarioFirebase);
        setLocalUser(localStorage.getItem("rol"))
      } else {
        setUser(null);
      }
    })
    
  , [])

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
            { user || localUser? <AdminProtectedRoutes path="/usuario/admin" component={HomeAdmin} user={user}/> :
             <Redirect to={window.location}/>}
           
            {/**Rutas privadas del docente */}
           { user ? <DocenteProtectedRoutes path='/usuario/docente' component={HomeDocente} user={user}/> :
            <Redirect to='/inicio-sesion'/>}
          

            {/**Rutas privadas del alumno */}
            { user ? <AlumnoProtectedRoutes path='/usuario/alumno' component={HomeAlumno} user={user}/> :
             <Redirect to='/inicio-sesion'/>}
            
           
          </Switch>
        </Router>
        </div>
        <Footer></Footer>
      
    </div>
  );
}

export default App;
