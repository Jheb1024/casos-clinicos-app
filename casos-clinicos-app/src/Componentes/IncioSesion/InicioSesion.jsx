import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import firebaseApp from "C:/Users/jhan_/Documents/casosc-app/casos-clinicos-app/casos-clinicos-app/src/Firebase/firebase-config.js";
import { useHistory } from "react-router-dom";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useAuth, iniciarSesion } from "../../Firebase/firebase_db";


const InicioSesion = () => {

    const auth = getAuth(firebaseApp);
    let history = useHistory();
    var Error = "";

    function onSubmit() {

        const db = getFirestore();
        const user = auth.currentUser;
        console.log("uiddd" + user.uid);

        if (user !== null) {

            const docRef = doc(db, "Usuarios", user.uid);

            getDoc(docRef).then((doc) => {
                console.log(doc.data(), doc.data().correo, doc.data().rol);
                const roldata = doc.data().rol;
                if (roldata === "admin") {
                    history.push('/usuario/admin')
                } else {
                    if (roldata === "docente") {
                        history.push('/usuario/docente')
                    } else {
                        history.push('/usuario/alumno')
                    }
                }
            })
        }
    }
    async function submitHandler(e) {
        e.preventDefault();

        const email = e.target.elements.email.value;
        const pass = e.target.elements.password.value;
        console.log("submit", email, pass);
     
            await iniciarSesion(email, pass).then(() => {
                onSubmit()
            }).catch(error=>{
                console.log("entramos al catch, error: ", error)
                switch (error.code){
                        case 'auth/invalid-email' :
                        console.log();
                        Error = "Email invalido";
                        break;
            
                        case 'auth/user-disabled' :
                            console.log("Este usuario ha sido desabilitado");
                            Error = "Este usuario ha sido desabilitado";
                        break;
            
                        case 'auth/user-not-found' :
                            console.log("Usuario no encontrado");
                            Error = "Usuario no encontrado";
                        break;

                        case 'auth/wrong-password' :
                            console.log("Contraseña incorrecta");
                            Error = "Contraseña incorrecta";
                        break;

                    default : 
                        break;
                }
            })
        
    }

    return (
        <div>

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
                        <input type="submit"
                            value={"Iniciar Sesión"} />
                    </div>
                </fieldset>
            </form>
        </div>
    );
}
export default InicioSesion