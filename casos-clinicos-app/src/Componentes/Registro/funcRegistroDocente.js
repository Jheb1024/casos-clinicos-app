import React from "react";
import firebaseApp from "C:/Users/jhan_/Documents/casosc-app/casos-clinicos-app/casos-clinicos-app/src/Firebase/firebase-config.js";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { useHistory } from "react-router-dom";

const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);


async function registrarDocente(email, pass, Matricula, Nombre, Sexo, Edad, NRC, FechaRegistro) {

    const infoUsuario = await createUserWithEmailAndPassword(auth, email, pass).then((usuarioFirebase) => {
        return usuarioFirebase;
    }).catch(error => { //Vemos los errores que pueden ocurrir al crear el usuario en firebase
        switch (error.code) {
            case 'auth/email-already-in-use':
                console.log(`Email address ${email} already in use.`);
                break;
            case 'auth/invalid-email':
                console.log(`Email address ${email} is invalid.`);
                break;
            case 'auth/operation-not-allowed':
                console.log(`Error during sign up.`);
                break;
            case 'auth/weak-password':
                console.log('Password is not strong enough. Add additional characters including special characters and numbers.');
                break;
            default:
                console.log(error.message);
                break;
        }
    })

    console.log(infoUsuario);

    if (infoUsuario) {
        

        var docuRef = doc(firestore, `Docente/${infoUsuario.user.uid}`);

        await setDoc(docuRef, {
            correo: email,
            password: pass, 
            rol: "docente",
            Matricula: Matricula,
            Nombre: Nombre,
            Sexo: Sexo,
            Edad: Edad,
            NRC: NRC,
            FechaRegistro: FechaRegistro
        }).catch(errr=>{
            console.log("Hubo un error al registrarte"+ errr.message);
        })
        await setDoc(doc(firestore, `Usuarios/${infoUsuario.user.uid}`), {
            email: email,
            rol: "docente"
        }).then(()=>{
        //let history = useHistory();
        //history.push('/usuario/docente')
        window.location.href = "usuario/docente";
        })
    }
}
export function submitHandler(e){
    e.preventDefault();
    /// debemos hacer las validaciones
    const Matricula = e.target.elements.matriculaDoc.value;
    const Nombre = e.target.elements.nombreDoc.value;
    const Sexo = e.target.elements.sexoDoc.value;
    console.log(Sexo);
    const Edad = e.target.elements.edadDoc.value;
    const NRC = e.target.elements.nrcDoc.value;
   
    //Datos para crear cuenta
    const email = e.target.elements.emailDoc.value;
    const pass = e.target.elements.passwordDoc.value;
    const pass2 = e.target.elements.passwordDoc2.value;
    const FechaRegistro = Date.now();
    registrarDocente(email, pass, Matricula, Nombre, Sexo, Edad, NRC, FechaRegistro);

    console.log("submit", email, pass);
}