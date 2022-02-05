import React from "react";
import Flux from "react-flux-dash";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import App from "../../App.js";
import IncioSesion from "../IncioSesion/InicioSesion.js";
import Registro from "../Registro/Registro.js"

export default class Layout extends Flux.View {
  render() {
    return (
      <div>
        <BrowserRouter>
          <div>
            <Switch>
              <Route exact path="/" component={App} />
              <Route exact path="/iniciosesion" component={IncioSesion} />
              <Route exact path="/registro" component={Registro} />
              {/*<Route render={() => <h1>Not found!</h1>} />*/}
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}