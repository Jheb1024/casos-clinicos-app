import React, {useState} from "react";
import firebaseApp from "C:/Users/jhan_/Documents/casosc-app/casos-clinicos-app/casos-clinicos-app/src/Firebase/firebase-config.js";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { useHistory } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, isNan } from "formik";
import Swal from "sweetalert2";

const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);



const Registro = () => {
    let history = useHistory();
    const [formularioEnviado, cambiarFormularioEnviado] = useState(false);

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
                console.log("Hubo un error al registrarte"+ errr.message);
            })
            await setDoc(doc(firestore, `Usuarios/${infoUsuario.user.uid}`), {
                email: email,
                rol: "alumno"
            }).then(()=>{
                history.push('/usuario/alumno')
            })
        }else{
            Swal({
                icon: 'error',
                title: 'Correo ya registrado.',
                text: 'El correo electrónico ya esta registrado.Introduzca otro correo.'
            });
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

        if (Matricula === "" || Nombre === "" || Sexo === "" || Edad === "" || NRC === ""
            || VecesMateriaTomada === "Elige una opción" || EstudiosPrevios === "Elige una opción" || email === ""
            || pass === "" || pass2 === "") {
            new Swal({
                icon: 'info',
                title: 'Favor de completar todo el formulario de registro!!',
                timer: 2000
            });
        } else {
            new Swal({
                title: 'Registro alumno',
                text: '¿Desea confirmar tu registro?',
                icon: 'question',
                buttons: ['No', 'Si']
            })
                .then((respuesta) => {
                    if (respuesta) {
                        //registrarUsuario(email, pass, Matricula, Nombre, Sexo, Edad, NRC, VecesMateriaTomada, EstudiosPrevios, FechaRegistro);
                        if (registrarUsuario(email, pass, Matricula, Nombre, Sexo, Edad, NRC, VecesMateriaTomada, EstudiosPrevios, FechaRegistro).res.status===200) {
                            new Swal({
                                title: "Registro exitoso",
                                text: "Está iniciando sesión.¡Favor de esperar!",
                                icon: "success",
                                timer: 3000
                            });
                        }else{
                            new Swal({
                                title: "Registro no exitoso",
                                text: "Favor de verificar sus datos.",
                                icon: "error",
                                timer: 3000
                            });
                        }

                        //registrarUsuario(email, pass, Matricula, Nombre, Sexo, Edad, NRC, VecesMateriaTomada, EstudiosPrevios, FechaRegistro);

                    }
                });
        }
        console.log("submit", email, pass);

        //registrarUsuario(email, pass, Matricula, Nombre, Sexo, Edad, NRC, VecesMateriaTomada, EstudiosPrevios, FechaRegistro);

        //console.log("submit", email, pass);
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
                    <Formik
                        initialValues={
                            {
                                InputMatricula: '',
                                InputNombre: '',
                                SelectSexo: '',
                                InputEdad: '',
                                InputNRC: '',
                                SelectVeces: '',
                                SelectEstudios: '',
                                emailr: '',
                                passwordr: '',
                                passwordr2: ''
                            }
                        }

                        validate={(valores) => {
                            let errores = {};
                            //Validaciones matricula
                            if (!valores.InputMatricula) {
                                errores.InputMatricula = "Por favor ingrese su matricula."
                            } else if (!/^(?:\+|-)?\d+$/.test(valores.InputMatricula)) {
                                errores.InputMatricula = "La matrícula solo puede tener números,sin espacios."
                            } else if (valores.InputMatricula.length < 9 || valores.InputMatricula.length > 9) {
                                errores.InputMatricula = "La mátricula solo puede tener 9 números,sin espacios."
                            }
                            //Validaciones nombre
                            if (!valores.InputNombre) {
                                errores.InputNombre = "Por favor ingrese su nombre completo."
                            } else if (!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(valores.InputNombre)) {
                                errores.InputNombre = "El nombre solo puede tener letras y espacios, pueden llevar acentos."
                            }
                            //Validaciones sexo
                            if (!valores.SelectSexo || valores.SelectSexo === "Elige una opción") {
                                errores.SelectSexo = "Por favor seleccione su sexo."
                            }
                            //Validaciones edad
                            if (!valores.InputEdad) {
                                errores.InputEdad = "Por favor ingrese su edad."
                            } else if (!/^[0-9]{2}$/.test(valores.InputEdad)) {
                                errores.InputEdad = "Edad inválida."
                            }
                            //Validaciones NRC
                            if (!valores.InputNRC) {
                                errores.InputNRC = "Por favor ingrese el NRC."
                            } else if (!/^(?:\+|-)?\d+$/.test(valores.InputNRC)) {
                                errores.InputNRC = "El NRC de la materia solo puede tener números,sin espacios."
                            } else if (valores.InputNRC.length < 5 || valores.InputNRC.length > 5) {
                                errores.InputNRC = "El NRC solo puede tener 5 números,sin espacios."
                            }
                            //Validaciones SelectVeces
                            if (!valores.SelectVeces || valores.SelectVeces === "Elige una opción") {
                                errores.SelectVeces = "Por favor seleccione una opción."
                            }
                            //Validaciones SelectEstudios
                            if (!valores.SelectEstudios || valores.SelectEstudios === "Elige una opción") {
                                errores.SelectEstudios = "Por favor seleccione una opción."
                            }
                            //Validaciones correo
                            if (!valores.emailr) {
                                errores.emailr = "Por favor ingrese un correo."
                            } else if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(valores.emailr)) {
                                errores.emailr = "El correo solo puede tener letras,numeros,puntos,guiones y un @."
                            }
                            //Validaciones contraseña
                            if (!valores.passwordr) {
                                errores.passwordr = "Por favor ingrese su contraseña."
                            } else if (!/^[A-Za-z0-9]{7}$/.test(valores.passwordr)) {
                                errores.passwordr = "Su contraseña solo puede tener números y letras, sin espacios."
                            } else if (valores.passwordr.length < 7 || valores.passwordr.length > 7) {
                                errores.passwordr = "Su contraseña debe de tener 8 elementos.Sin espacios!"
                            }
                            //Validaciones contraseña2
                            if (!valores.passwordr2) {
                                errores.passwordr2 = "Por favor repita su contraseña."
                            } else if (valores.passwordr != valores.passwordr2) {
                                errores.passwordr2 = "Verifique su contraseña, no coinciden."
                            }
                            return errores;

                        }}
                        onSubmit={(valores, { resetForm }) => {
                            resetForm();
                            console.log('Formulario enviando');
                            cambiarFormularioEnviado(true);
                            setTimeout(() => cambiarFormularioEnviado(false), 5000);
                        }}
                    >
                        {({ errors }) => (
                            <Form class="row g-3" onSubmit={submitHandler}>
                                <fieldset>
                                    <h1 className="h1">Registro Alumno</h1>
                                    <small id="emailHelp" class="form-text text-muted">No compartiremos tu información</small>
                                    <div class="form-group">
                                        <label for="InputMatricula" class="form-label">Matrícula</label>
                                        <Field
                                            type="txt"
                                            class="form-control"
                                            id="InputMatricula"
                                            name="InputMatricula"
                                            placeholder="202212345"
                                        />
                                        <ErrorMessage name="InputMatricula" component={() => (
                                            <div className="error"><p class="text-danger"><small>{errors.InputMatricula}</small></p></div>
                                        )} />
                                    </div>
                                    <div class="form-group">
                                        <label for="InputNombre">Nombre completo</label>
                                        <Field type="txt"
                                            class="form-control"
                                            id="InputNombre"
                                            name="InputNombre"
                                            placeholder="Juan Pérez Pérez"
                                        />
                                        <ErrorMessage name="InputNombre" component={() => (
                                            <div className="error"><p class="text-danger"><small>{errors.InputNombre}</small></p></div>
                                        )} />
                                    </div>
                                    <div class="form-group">
                                        <label for="InputSexo">Sexo</label><br></br>
                                        <Field class="form-select" id="SelectSexo" name="SelectSexo" as="select">
                                            <option  value="Elige una opción">Elige una opción</option>
                                            <option value="Mujer">Mujer</option>
                                            <option value="Hombre">Hombre</option>
                                        </Field>
                                        <ErrorMessage name="SelectSexo" component={() => (
                                            <div className="error"><p class="text-danger"><small>{errors.SelectSexo}</small></p></div>
                                        )} />
                                    </div>
                                    <div class="form-group">
                                        <label for="InputEdad">Edad</label>
                                        <Field
                                            type="number"
                                            class="form-control"
                                            id="InputEdad"
                                            name="InputEdad"
                                            min="18" max="80"
                                            placeholder="18"
                                        />
                                        <ErrorMessage name="InputEdad" component={() => (
                                            <div className="error"><p class="text-danger"><small>{errors.InputEdad}</small></p></div>
                                        )} />
                                    </div>
                                    <div class="form-group">
                                        <label for="InputNRC">NRC de la materia</label>
                                        <Field
                                            type="text"
                                            class="form-control"
                                            id="InputNRC"
                                            name="InputNRC"
                                            placeholder="45613"
                                        />
                                        <ErrorMessage name="InputNRC" component={() => (
                                            <div className="error"><p class="text-danger"><small>{errors.InputNRC}</small></p></div>
                                        )} />
                                    </div>
                                    <div class="form-group">
                                        <label for="SelectVeces">¿Cuántas veces a tomado la materia?</label>
                                        <Field class="form-select" id="SelectVeces" name="SelectVeces" as="select">
                                            <option value="Elige una opción">Elige una opción</option>
                                            <option value="0">0</option>
                                            <option value="1">1</option>
                                            <option value="2+">2+</option>
                                        </Field>
                                        <ErrorMessage name="SelectVeces" component={() => (
                                            <div className="error"><p class="text-danger"><small>{errors.SelectVeces}</small></p></div>
                                        )} />
                                    </div>
                                    <div class="form-group">
                                        <label for="SelectEstudios">¿Tiene estudios previos?</label>
                                        <Field class="form-select" name="SelectEstudios" id="SelectEstudios" as="select">
                                            <option value="Elige una opción">Elige una opción</option>
                                            <option value="Si">Si</option>
                                            <option value="No">No</option>
                                        </Field>
                                        <ErrorMessage name="SelectEstudios" component={() => (
                                            <div className="error"><p class="text-danger"><small>{errors.SelectEstudios}</small></p></div>
                                        )} />
                                    </div>

                                    <div class="form-group">
                                        <label for="email">Correo electrónico</label>
                                        <Field
                                            type="txt"
                                            class="form-control"
                                            id="emailr"
                                            name="emailr"
                                            placeholder="Correo"
                                        />
                                        <ErrorMessage name="emailr" component={() => (
                                            <div className="error"><p class="text-danger"><small>{errors.emailr}</small></p></div>
                                        )} />

                                    </div>
                                    <div class="form-group">
                                        <label for="passwordr">Contraseña</label>
                                        <Field
                                            type="password"
                                            class="form-control"
                                            id="passwordr"
                                            name="passwordr"
                                            placeholder="Constraseña"
                                        />
                                        <ErrorMessage name="passwordr" component={() => (
                                            <div className="error"><p class="text-danger"><small>{errors.passwordr}</small></p></div>
                                        )} />
                                    </div>
                                    <div class="form-group">
                                        <label for="passwordr2">Confirmar Contraseña</label>
                                        <Field
                                            type="password"
                                            class="form-control"
                                            id="passwordr2"
                                            name="passwordr2"
                                            placeholder="Constraseña"
                                        />
                                        <ErrorMessage name="passwordr2" component={() => (
                                            <div className="error"><p class="text-danger"><small>{errors.passwordr2}</small></p></div>
                                        )} />
                                    </div>

                                </fieldset>
                                <br />
                                <label for="txt">¿Ya tienes una cuenta? <a href="/inicio-sesion">Iniciar Sesión</a></label>
                                <br />
                                <div>
                                    <input type="submit" class="btn btn-success"
                                        value="Registrarme" />
                                </div>
                                {formularioEnviado && <p class="text-success">¡Registro exitoso!</p>}
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
}
export default Registro