import React, {useState} from "react";
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import firebaseApp from "C:/Users/jhan_/Documents/casosc-app/casos-clinicos-app/casos-clinicos-app/src/Firebase/firebase-config.js";
import { BrowserRouter as Router, Switch, 
    Route, Redirect, useHistory} from "react-router-dom";

const auth = getAuth(firebaseApp);

const InicioSesion = () => {

    let history = useHistory();
    const [isRegistrando, setIsRegistrando] = useState(false);
    function onSubmit(rol){
        
        if(rol === "admin"){
            history.push('/usuario/admin')
        }else{
            if(rol === "docente"){
                history.push('/usuario/docente')
            }else{
                history.push('/usuario/alumno')
            }
        }
        
        
     }
    function submitHandler (e){
        e.preventDefault();
        
        const email = e.target.elements.email.value;
        const pass = e.target.elements.password.value;
        const rol = e.target.elements.rol.value;
        
        console.log("submit",email,pass,rol);

        signInWithEmailAndPassword(auth, email, pass);
        onSubmit(rol);
    }

    return (
        <div>
            <h1>{isRegistrando ? "Regístrate" : "Inicia Sesión"}</h1>
            <form onSubmit={submitHandler}>
                <fieldset>
                    <legend>Inicio de sesión</legend>
                    <div class="form-group">
                        <label for="email">Email address</label>
                        <input type="email" class="form-control" id="email" aria-describedby="emailHelp" placeholder="Correo" />
                        <small id="emailHelp" class="form-text text-muted">No compartiremos tu información</small>
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" class="form-control" id="password" placeholder="Constraseña" />
                    </div>
                    <div>
                        <label>
                            Rol:
                            <select id="rol">
                                <option value='admin'>Administrador</option>
                                <option value='docente'>Docente</option>
                                <option value='alumno'>Alumno</option>
                            </select>
                        </label>
                    </div>
                    <div>
                        <input type="submit"
                        value={isRegistrando ? "Registrate" : "Iniciar Sesión"}/>
                    </div>
                </fieldset>
            </form>
            <button onClick={()=>setIsRegistrando(!isRegistrando)}>
                {isRegistrando ? "Ya tengo una cuenta" : "Quiero registrarme"}
            </button>
        </div>
    );
}
export default InicioSesion