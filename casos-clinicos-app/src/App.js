import "./App.css";
import Header from "./Header/header";
import Footer from "./Footer/Footer";
import InicioSesion from "./Componentes/IncioSesion/InicioSesion";
import Registro from "./Componentes/Registro/Registro";
import {
  BrowserRouter as Router,
  Routes,
  Switch,
  Route,
  NavLink
} from "react-router-dom";


function App() {
  return (
  <Router>
    <div className="App">
      <Header>
      </Header>
      
      <Switch>
      <Route path="/inicio-sesion/">
          <InicioSesion></InicioSesion>
        </Route>
        <Route path="/registro" >
         <Registro></Registro>
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
