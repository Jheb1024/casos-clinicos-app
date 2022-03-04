import "./App.css";
import Header from "./Header/header";
import Footer from "./Footer/Footer";
import InicioSesion from "./Componentes/IncioSesion/InicioSesion";
import Registro from "./Componentes/Registro/Registro";
import RegistroDocente from "./Componentes/Registro/RegistroDocente";
import HomeAdmin from "./Usuarios/Administrador/HomeAdmin";
import HomeDocente from "./Usuarios/Docente/HomeDocente";
import HomeAlumno from "./Usuarios/Alumno/HomeAlumno";

import {BrowserRouter as Router,Routes,Switch,Route,NavLink} from "react-router-dom";
import { useState } from "react";
import {getAuth, onAuthStateChanged} from 'firebase/auth';
import firebaseApp from "./Firebase/firebase-config";

const auth = getAuth(firebaseApp);


function App() {

  const [user, setUser] = useState(null);

  onAuthStateChanged(auth, (usuarioFirebase)=>{
    if(usuarioFirebase){
      setUser(usuarioFirebase);
    }else{
      setUser(null);
    }
  })

  return (
    <Router>
      <div className="App">
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
            <HomeDocente></HomeDocente>
          </Route>
          <Route path="/usuario/alumno" >
            <HomeAlumno></HomeAlumno>
          </Route>
          <Route path="/" exact>
            Esta es la página de incio
          </Route>
        </Switch>
        <Footer>
        </Footer>
     
      </div>
      
    </Router>


  );
}

function Inicio() {
  return <h2>App</h2>;
}

export default App;
