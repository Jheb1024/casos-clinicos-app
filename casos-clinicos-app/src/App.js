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

const auth = getAuth(firebaseApp);


function App() {

  const [user, setUser] = useState(null);

  onAuthStateChanged(auth, (usuarioFirebase) => {
    if (usuarioFirebase) {
      setUser(usuarioFirebase);
    } else {
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
            <h1 className="h1">¡Bienvenido(a) a CasosClínicos!</h1>
            <div className="container">
              <div className="row justify-content-center align-items-center">
                <div className="col-auto bg-light p-5">
                  <p>Bienvenido(a) alumno o docente a esta aplicación.</p>
                  <p>En donde, como alumno podrás encontrar cuestionarios de diferentes
                    temas sobre la materia de BIOQUIMICA para poner en practica tus conocimientos
                    adquiridos en el salon de clases, de igual forma podras tener acceso a una retroalimentación y así
                    poder reforzar tus conocimientos.
                    Tambien podrás visualizar tu avance.</p>
                  <p>Como docente podras ingresar un alumno, previamente registrado, a tu lista de alumnos y visualizar el avance de los alumnos
                    que esten en tu lista. Además, podrás administrar
                    los temas, subtemas y cuestionarios referente a la materia.
                  </p>
                  <p>Esto lo podrás encontrar distribuido en distintas secciones de la aplicación web,
                    te invito a que te registres para que puedas autenticarte en dicha aplicación y
                    puedas acceder a los contenidos qu estan a su disposición</p>

                </div>
              </div>
            </div>
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
