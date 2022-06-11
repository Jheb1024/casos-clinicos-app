import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import firebaseApp from "C:/Users/jhan_/Documents/casosc-app/casos-clinicos-app/casos-clinicos-app/src/Firebase/firebase-config.js";
import { useHistory } from "react-router-dom";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useAuth, iniciarSesion } from "../../Firebase/firebase_db";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import "./inicioSesion.css";

const InicioSesion = ({data}) => {
    const data1 = data
    console.log("data",data1)
    
    const auth = getAuth(firebaseApp);
    let history = useHistory();
    var Error = "";

    //Constantes relacionadas con el formulario (vista)
    const [formularioEnviado, cambiarFormularioEnviado] = useState(false);
    const [correoIncorrecto, cambiarCorreoIncorrecto] = useState(false);

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
                    window.localStorage.setItem("rol", 'admin')
                    history.push('/usuario/admin/administrar-cuestionarios')
                } else if (roldata === "docente") {
                    window.localStorage.setItem("rol", 'docente')
                    history.push('/usuario/docente/lista-alumno')
                } else if (roldata === "alumno") {
                    window.localStorage.setItem("rol", 'alumno')
                    history.push('/usuario/alumno/cuestionarios-alumno')
                } else {
                    new Swal(
                        'Error!',
                        'Verifique los datos de la cuenta',
                        'error',
                    );
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
        }).catch(error => {
            console.log("entramos al catch, error: ", error)
            switch (error.code) {
                case 'auth/invalid-email':
                    console.log();
                    Error = "Email invalido";
                    new Swal.fire(
                        'Error!',
                        'Email invalido',
                        'error',
                    );
                    break;

                case 'auth/user-disabled':
                    console.log("Este usuario ha sido desabilitado");
                    Error = "Este usuario ha sido desabilitado";
                    new Swal(
                        'Error!',
                        'Usuario deshabilitado',
                        'error',
                    );
                    break;

                case 'auth/user-not-found':
                    console.log("Usuario no encontrado");
                    Error = "Usuario no encontrado";
                    new Swal(
                        'Error!',
                        'Usuario no encontrado',
                        'error',
                    );
                    break;

                case 'auth/wrong-password':
                    console.log("Contraseña incorrecta");
                    Error = "Contraseña incorrecta";
                    new Swal(
                        'Error!',
                        Error,
                        'error',
                    );
                    break;

                default:
                    
                    break;
            }
        })

    }

    return (
        
        <div >
            <div class="container">
                <div class="row justify-content-md-center">
                    <div id ="FormContainer" class="col-md-15 offset-md-0">
                        <Formik
                            initialValues={
                                {
                                    email: '',
                                    password: ''
                                }
                            }
                            validate={(valores) => {
                                let errores = {};

                                //Validaciones correo
                                if (!valores.email) {
                                    errores.email = "Por favor ingrese un correo."
                                } else if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(valores.email)) {
                                    errores.email = "El correo solo puede tener letras,numeros,puntos,guiones y un @."
                                }

                                //Validaciones contraseña
                                if (!valores.password) {
                                    errores.password = "Por favor ingrese su contraseña."
                                } else if (!/^[A-Za-z0-9]{7}$/.test(valores.password)) {
                                    errores.password = "Su contraseña solo puede tener números y letras, sin espacios."
                                } else if (valores.password.length < 7 || valores.password.length > 7) {
                                    errores.password = "Su contraseña debe de tener 8 elementos.Sin espacios!"
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
                            {({ values, errors, touched, handleSubmit, handleChange, handleBlur }) => (

                                <Form className="formulario" onSubmit={submitHandler}>
                                    <div className="container">
                                        <div className="row justify-content-center align-items-center">
                                            <div className="col-auto bg-light p-2">

                                                <fieldset>
                                                    <h1 className="h1">Inicio de sesión</h1>
                                                    <div class="form-group">
                                                        <label for="email">Correo electrónico</label>
                                                        <Field
                                                            type="text"
                                                            class="form-control"
                                                            name="email"
                                                            id="email"
                                                            placeholder="ejemplo@gmail.com"
                                                        />
                                                        <ErrorMessage name="email" component={() => (
                                                            <div className="error"><p class="text-danger"><small>{errors.email}</small></p></div>
                                                        )} />
                                                        {correoIncorrecto && <p className="error">Correo electrónico incorrecto</p>}

                                                    </div>
                                                    <div class="form-group">
                                                        <label for="password">Contraseña</label>
                                                        <Field type="password"
                                                            class="form-control"
                                                            id="password"
                                                            name="password"
                                                            placeholder="Constraseña"
                                                        />
                                                        <ErrorMessage name="password" component={() => (
                                                            <div className="error"><p class="text-danger"><small>{errors.password}</small></p></div>
                                                        )} />

                                                    </div>
                                                    <br />
                                                    <label for="txt">¿Aún no tienes una cuenta? <br/>
                                                    <Link to="/registro-docente">Registro Docente</Link>
                                                    <br/>
                                                    <Link to="/registro-alumno">Registro Alumno</Link></label>
                                                    <br />
                                                    <br />
                                                    <Link to="/reiniciar-password">¿Olvidaste tu contraseña?</Link>                                                   <br />
                                                    <br />
                                                    <div>
                                                        <input type="submit"
                                                            value={"Iniciar Sesión"} className="btn btn-primary" />
                                                    </div>
                                                    {formularioEnviado && <p class="text-success">Inicio de sesión exitoso</p>}
                                                </fieldset>
                                            </div>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default InicioSesion