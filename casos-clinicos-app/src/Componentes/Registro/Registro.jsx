import React from "react";
import firebaseApp from "C:/Users/jhan_/Documents/casosc-app/casos-clinicos-app/casos-clinicos-app/src/Firebase/firebase-config.js";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { useHistory } from "react-router-dom";

const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);



const Registro = () => {
    let history = useHistory();

    async function registrarUsuario(email, pass, Matricula, Nombre, Sexo, Edad, NRC, VecesMateriaTomada, EstudiosPrevios, FechaRegistro) {

        const infoUsuario = await createUserWithEmailAndPassword(auth, email, pass).then((usuarioFirebase) => {
            return usuarioFirebase;
        }).catch(error => {
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

            var docuRef = doc(firestore, `Alumno/${infoUsuario.user.uid}`);

            await setDoc(docuRef, {
                correo: email,
                password: pass, rol: "alumno",
                Matricula: Matricula,
                Nombre: Nombre,
                Sexo: Sexo,
                Edad: Edad,
                NRC: NRC,
                NumVecesTomadoMateria: VecesMateriaTomada,
                EstudiosPrevios: EstudiosPrevios,
                FechaRegistro: FechaRegistro
            }).catch(errr=>{
                console.log("Huno un error al registrarte"+ errr.message);
            })
            await setDoc(doc(firestore, `Usuarios/${infoUsuario.user.uid}`), {
                email: email,
                rol: "alumno"
            }).then(()=>{
                history.push('/usuario/alumno')
            })
        }
    }
    function submitHandler(e) {
        e.preventDefault();
        /// debemos hacer las validaciones
        const Matricula = e.target.elements.InputMatricula.value;
        const Nombre = e.target.elements.InputNombre.value;
        const Sexo = e.target.elements.SelectSexo.value;
        console.log(Sexo);
        const Edad = e.target.elements.InputEdad.value;
        const NRC = e.target.elements.InputNRC.value;
        const VecesMateriaTomada = e.target.elements.SelectVeces.value;
        const EstudiosPrevios = e.target.elements.SelectEstudios.value;
        //Datos para crear cuenta
        const email = e.target.elements.emailr.value;
        const pass = e.target.elements.passwordr.value;
        const pass2 = e.target.elements.passwordr2.value;
        const FechaRegistro = Date.now();
        registrarUsuario(email, pass, Matricula, Nombre, Sexo, Edad, NRC, VecesMateriaTomada, EstudiosPrevios, FechaRegistro);

        console.log("submit", email, pass);
    }
    return (
        <div className='container px-lg-2'>
            <div class="row mx-lg-n2">
                <div className='col py-3 px-lg-5 border bg-light text-align:center'>

                    <img src="https://us.123rf.com/450wm/stylephotographs/stylephotographs1710/stylephotographs171000262/88557664-mujer-joven-como-estudiante-de-medicina-con-laptop-aprender-en-aprendizaje.jpg?ver=6"
                        width="550" height="380"></img>
                    <img src="https://us.123rf.com/450wm/stylephotographs/stylephotographs1710/stylephotographs171000262/88557664-mujer-joven-como-estudiante-de-medicina-con-laptop-aprender-en-aprendizaje.jpg?ver=6"
                        width="550" height="380"></img>
                </div>
                <div class="col py-3 px-lg-2 border bg-light">
                    <form onSubmit={submitHandler}>
                        <fieldset>
                            <legend>Registro Alumno</legend>
                            <small id="emailHelp" class="form-text text-muted">No compartiremos tu información</small>
                            <div class="form-group">
                                <label for="InputMatricula">Matrícula</label>
                                <input type="txt" class="form-control" id="InputMatricula" placeholder="202212345" required />
                            </div>
                            <div class="form-group">
                                <label for="InputNombre">Nombre completo</label>
                                <input type="txt" class="form-control" id="InputNombre" placeholder="Juan Pérez Pérez" required />
                            </div>
                            <div class="form-group">
                                <label for="InputSexo">Sexo</label><br></br>
                                <select class="form-select" id="SelectSexo" required>
                                    <option>Elige una opción</option>
                                    <option>Mujer</option>
                                    <option>Hombre</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="InputEdad">Edad</label>
                                <input type="number" class="form-control" id="InputEdad" name="InputEdad" min="18" max="80" placeholder="18" required />
                            </div>
                            <div class="form-group">
                                <label for="InputNRC">NRC de la materia</label>
                                <input type="text" class="form-control" id="InputNRC" name="InputNRC" placeholder="456123" required />
                            </div>
                            <div class="form-group">
                                <label for="SelectVeces">¿Cuántas veces a tomado la materia?</label>
                                <select class="form-select" id="SelectVeces" required>
                                    <option>Elige una opción</option>
                                    <option>0</option>
                                    <option>1</option>
                                    <option>2+</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="SelectEstudios">¿Tiene estudios previos?</label>
                                <select class="form-select" id="SelectEstudios" required>
                                    <option>Elige una opción</option>
                                    <option>Si</option>
                                    <option>No</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label for="email">Correo electrónico</label>
                                <input type="email" class="form-control" id="emailr" aria-describedby="emailHelp" placeholder="Correo" required />

                            </div>
                            <div class="form-group">
                                <label for="passwordr">Contraseña</label>
                                <input type="password" class="form-control" id="passwordr" placeholder="Constraseña" required />
                            </div>
                            <div class="form-group">
                                <label for="passwordr2">Confirmar Contraseña</label>
                                <input type="password" class="form-control" id="passwordr2" placeholder="Constraseña" required />
                            </div>

                        </fieldset>
                        <br />
                        <label for="txt">¿Ya tienes una cuenta? <a href="/inicio-sesion">Iniciar Sesión</a></label>
                        <br />
                        <div>
                            <input type="submit" class="btn btn-success"
                                value="Registrarme" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
export default Registro