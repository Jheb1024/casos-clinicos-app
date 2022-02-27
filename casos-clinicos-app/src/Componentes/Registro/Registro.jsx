import React from "react";
import firebaseApp from "C:/Users/jhan_/Documents/casosc-app/casos-clinicos-app/casos-clinicos-app/src/Firebase/firebase-config.js";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import {getFirestore, doc, setDoc} from 'firebase/firestore';

const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);



const Registro = () => {
async function registrarUsuario(email, pass, rol) {

    const infoUsuario = await createUserWithEmailAndPassword(auth, email, pass).then((usuarioFirebase) => {
        return usuarioFirebase;
    });

    console.log(infoUsuario);
    
    var docuRef;
    
    switch(rol){
        case 'admin': docuRef= doc(firestore, `Admin/${infoUsuario.user.uid}` );
            break;
        case 'docente': docuRef= doc(firestore, `Docente/${infoUsuario.user.uid}` );
            break;
        case 'alumno': docuRef= doc(firestore, `Alumno/${infoUsuario.user.uid}` );
            break;
        default :
        break;
    }
    setDoc(docuRef, {correo: email, password: pass, rol: rol});


    
}
function submitHandler(e) {
    e.preventDefault();

    const email = e.target.elements.emailr.value;
    const pass = e.target.elements.passwordr.value;
    const rol = e.target.elements.rolr.value;
    registrarUsuario(email, pass, rol);

    console.log("submit", email, pass, rol);
}
    return (
        <div>
            <form onSubmit={submitHandler}>
                <fieldset>
                    <legend>Registro</legend>
                    <div class="form-group">
                        <label for="email">Email address</label>
                        <input type="email" class="form-control" id="emailr" aria-describedby="emailHelp" placeholder="Correo" />
                        <small id="emailHelp" class="form-text text-muted">No compartiremos tu información</small>
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" class="form-control" id="passwordr" placeholder="Constraseña" />
                    </div>
                    <div>
                        <label for="rolr">
                            Rol:
                            <select id="rolr">
                                <option value='admin'>Administrador</option>
                                <option value='docente'>Docente</option>
                                <option value='alumno'>Alumno</option>
                            </select>
                        </label>
                    </div>

                </fieldset>
                <div>
                <input type="submit"
                    value="Registrarme" />
            </div>
            </form>
            
        </div>
    );
}
export default Registro