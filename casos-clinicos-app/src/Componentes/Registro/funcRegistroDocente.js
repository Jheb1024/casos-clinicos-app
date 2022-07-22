import firebaseApp from "C:/Users/jhan_/Documents/casosc-app/casos-clinicos-app/casos-clinicos-app/src/Firebase/firebase-config.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, updateDoc, query, collection, where, getDocs } from 'firebase/firestore';
import Swal from "sweetalert2";


const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);


async function registrarDocente(email, pass, Matricula, Nombre, apellidoP, apellidoM, Sexo, Edad, FechaRegistro) {

    
        const infoUsuario = await createUserWithEmailAndPassword(auth, email, pass).then((usuarioFirebase) => {
            return usuarioFirebase;
        })
            .catch(error => { //Vemos los errores que pueden ocurrir al crear el usuario en firebase
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        console.log(`Email address ${email} already in use.`);
                        new Swal({
                            position: 'top-end',
                            icon: 'error',
                            title: 'Este correo electrónico ya esta en uso.',
                            showConfirmButton: false,
                            timer: 3000
                        });
                        break;
                    case 'auth/invalid-email':
                        console.log(`Email address ${email} is invalid.`);
                        new Swal({
                            position: 'top-end',
                            icon: 'error',
                            title: 'Correo electrónico inválido.',
                            showConfirmButton: false,
                            timer: 3000
                        });
                        break;
                    case 'auth/operation-not-allowed':
                        console.log(`Error during sign up.`);
                        new Swal({
                            position: 'top-end',
                            icon: 'error',
                            title: 'Operación no exitosa.',
                            showConfirmButton: false,
                            timer: 3000
                        });
                        break;
                    case 'auth/weak-password':
                        console.log('Password is not strong enough. Add additional characters including special characters and numbers.');
                        new Swal({
                            position: 'top-end',
                            icon: 'error',
                            title: 'Contraseña débil.',
                            showConfirmButton: false,
                            timer: 3000
                        });
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
                ApellidoPaterno: apellidoP,
                ApellidoMaterno: apellidoM,
                Sexo: Sexo,
                Edad: Edad,
                FechaRegistro: FechaRegistro
            }).catch(errr => {
                console.log("Hubo un error al registrarte" + errr.message);
                new Swal({
                    icon: 'error',
                    title: 'Error en el registro.',
                    text: 'Vuelva a intentarlo más tarde.'
                });
            })
            //Add idDocente 
            const claseRef = doc(firestore, `Docente/${infoUsuario.user.uid}`);
            await updateDoc(claseRef, {
                id: infoUsuario.user.uid,
            }).then(() => {
                console.log("Docente actualizado con el id", infoUsuario.user.uid);
            });
            await setDoc(doc(firestore, `Usuarios/${infoUsuario.user.uid}`), {
                email: email,
                rol: "docente",
                matricula: Matricula
            }).then(() => {
                CerrarSesion()
                window.location.href = "/inicio-sesion";
            })

        } else {
            new Swal({
                icon: 'error',
                title: 'Correo ya registrado.',
                text: 'El correo electrónico ya esta registrado.Introduzca otro correo.'
            });
        }
    

}
export async function submitHandler(e) {
    e.preventDefault();
    /// debemos hacer las validaciones
    const Matricula = e.target.elements.matriculaDoc.value;
    const Nombre = e.target.elements.nombreDoc.value;
    const ApellidoP = e.target.elements.apellidoPDoc.value;
    const ApellidoM = e.target.elements.apellidoMDoc.value;
    const Sexo = e.target.elements.sexoDoc.value;
    const Edad = e.target.elements.edadDoc.value;
    //Datos para crear cuenta
    const email = e.target.elements.emailDoc.value;
    const pass = e.target.elements.passwordDoc.value;
    const pass2 = e.target.elements.passwordDoc2.value;
    const FechaRegistro = Date.now();

    if (Matricula === "" || Nombre === "" || ApellidoP === '' || ApellidoM === '' || Sexo === "" || Edad === ""
        || email === "" || pass === "" || pass2 === "") {
        new Swal({
            position: 'top-end',
            icon: 'info',
            title: 'Favor de completar todo el formulario de registro!!',
            showConfirmButton: false,
            timer: 3000
        });
    } else {

        const matriculaRepetida = await verificarMatriculaDocente(Matricula);
        console.log(matriculaRepetida)
        if(matriculaRepetida){
            console.log("La matricula está en uso por otro usuario, si eres el propietario por favor comunicate con el administrador");
            new Swal({
                icon: 'warning',
                title: 'Matricula en uso.',
                text: 'La matricula está en uso por otro usuario, si eres el propietario por favor comunícate con el administrador.'
            });
        }else{

        
        
        new Swal({
            title: 'Registro docente',
            text: '¿Desea confirmar tu registro?',
            icon: 'question',
            showDenyButton: true,
            confirmButtonText: 'Si',
            denyButtonText: `No`,
        })
            .then((respuesta) => {
                if (respuesta.isConfirmed) {
                    if (registrarDocente(email, pass, Matricula, Nombre, ApellidoP, ApellidoM, Sexo, Edad, FechaRegistro).res.status === 200) {
                        new Swal({
                            title: "Acción exitoso",
                            text: "El registro fue exitoso.",
                            icon: "success",
                            showConfirmButton: false,
                            timer: 3000
                        });
                    } else {
                        new Swal({
                            title: "Registro no exitoso",
                            text: "Favor de verificar sus datos.",
                            icon: "error",
                            showConfirmButton: false,
                            timer: 3000
                        });
                    }
                }
            });
        
    }
}
    console.log("submit", email, pass);
}
function CerrarSesion() {
    const auth = getAuth(firebaseApp);
    signOut(auth)
        .then((user) => {
            window.localStorage.removeItem('rol');
            window.localStorage.clear();
            console.log("El usaurio a cerrado la sesion");
        })
        .catch((err) => {
            console.log(err.message);
        });
}
export async function verificarMatriculaDocente(matricula){
    let repetido;

    const q = query(collection(firestore, "Usuarios"), where("matricula", "==", matricula));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        });

        if(querySnapshot.empty){
            repetido = false;
            console.log("Esta vacío")
        }else{
            console.log("Encontró algo")
            repetido = true;
        }

    return repetido;
}