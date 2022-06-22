import React, { useState, useEffect } from 'react'
import { Modal, Button } from 'react-bootstrap'
import firebaseApp, { storage } from "../../Firebase/firebase-config";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc,updateDoc } from 'firebase/firestore';
import { Formik, Form, Field, ErrorMessage, isNan } from "formik";
import Swal from "sweetalert2";
import { FaUserPlus } from "react-icons/fa";
import { FaRegSave } from "react-icons/fa";
import { GrClearOption } from "react-icons/gr";

function RegistroDocenteModal() {
    const auth = getAuth(firebaseApp);
    const firestore = getFirestore(firebaseApp);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

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
                idDocente: infoUsuario.user.uid,
            }).then(() => {
                console.log("Docente actualizado con el id", infoUsuario.user.uid);
            });
            await setDoc(doc(firestore, `Usuarios/${infoUsuario.user.uid}`), {
                email: email,
                rol: "docente"
            }).then(() => {
                new Swal({
                    title: "Registro exitoso",
                    text: "El registro de este docente fue exitoso",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 3000
                });
            })
        } else {
            new Swal({
                icon: 'error',
                title: 'Correo ya registrado.',
                text: 'El correo electrónico ya esta registrado.Introduzca otro correo.'
            });
        }
    }
    function submitHandler(e) {
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

                        if (registrarDocente(email, pass, Matricula, Nombre, ApellidoP, ApellidoM, Sexo, Edad, FechaRegistro)) {
                            new Swal({
                                title: "Registro exitoso",
                                text: "El registro fue exitoso",
                                icon: "success",
                                showConfirmButton: false,
                                timer: 3000
                            });
                            handleClose();
                        } else {
                            new Swal({
                                title: "Registro no exitoso",
                                text: "Favor de verificar sus datos.",
                                icon: "error",
                                showConfirmButton: false,
                                timer: 3000
                            });
                            handleClose();
                        }
                    }
                });
        }
        console.log("submit", email, pass);
    }
    return (
        <>
            <Button variant="info" onClick={handleShow}> <FaUserPlus /> Registrar docente </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title> <h1 className="h1">Registro Docente</h1></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Formik
                        initialValues={
                            {
                                matriculaDoc: '',
                                nombreDoc: '',
                                apellidoPDoc: '',
                                apellidoMDoc: '',
                                sexoDoc: '',
                                edadDoc: '',
                                emailDoc: '',
                                passwordDoc: '',
                                passwordDoc2: ''
                            }
                        }
                        validate={(valores) => {
                            let errores = {};
                            //Validaciones matricula
                            if (!valores.matriculaDoc) {
                                errores.matriculaDoc = "Por favor ingrese su matrícula."
                            } else if (!/^(?:\+|-)?\d+$/.test(valores.matriculaDoc)) {
                                errores.matriculaDoc = "La matrícula solo puede tener números,sin espacios."
                            } else if (valores.matriculaDoc.length < 9 || valores.matriculaDoc.length > 9) {
                                errores.matriculaDoc = "La matrícula solo puede tener 9 números,sin espacios."
                            }
                            //Validaciones nombre
                            if (!valores.nombreDoc) {
                                errores.nombreDoc = "Por favor ingrese su nombre completo."
                            } else if (!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(valores.nombreDoc)) {
                                errores.nombreDoc = "El nombre solo puede tener letras y espacios, pueden llevar acentos."
                            }
                            //Validaciones apellidoP
                            if (!valores.apellidoPDoc) {
                                errores.apellidoPDoc = "Por favor ingrese su apellido paterno."
                            } else if (!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(valores.apellidoPDoc)) {
                                errores.apellidoPDoc = "El apellido paterno solo puede tener letras y espacios, puede llevar acentos."
                            }
                            //Validaciones apellidoM
                            if (!valores.apellidoMDoc) {
                                errores.apellidoMDoc = "Por favor ingrese su apellido materno."
                            } else if (!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(valores.apellidoMDoc)) {
                                errores.apellidoPDoc = "El apellido materno solo puede tener letras y espacios, puede llevar acentos."
                            }
                            //Validaciones sexo
                            if (!valores.sexoDoc || valores.sexoDoc === "Elige una opción") {
                                errores.sexoDoc = "Por favor seleccione su sexo."
                            }
                            //Validaciones edad
                            if (!valores.edadDoc) {
                                errores.edadDoc = "Por favor ingrese su edad."
                            } else if (!/^[0-9]{2}$/.test(valores.edadDoc)) {
                                errores.edadDoc = "Edad inválida."
                            } else if (valores.edadDoc < 18) {
                                errores.edadDoc = "Edad inválida."
                            }

                            //Validaciones correo
                            if (!valores.emailDoc) {
                                errores.emailDoc = "Por favor ingrese un correo."
                            } else if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(valores.emailDoc)) {
                                errores.emailDoc = "El correo solo puede tener letras,numeros,puntos,guiones y un @."
                            }
                            //Validaciones contraseña
                            if (!valores.passwordDoc) {
                                errores.passwordDoc = "Por favor ingrese su contraseña."
                            } else if (!/^[A-Za-z0-9]{7}$/.test(valores.passwordDoc)) {
                                errores.passwordDoc = "Su contraseña solo puede tener números y letras, sin espacios."
                            } else if (valores.passwordDoc.length < 7 || valores.passwordDoc.length > 7) {
                                errores.passwordDoc = "Su contraseña debe de tener 8 elementos.Sin espacios!"
                            }
                            //Validaciones contraseña2
                            if (!valores.passwordDoc2) {
                                errores.passwordDoc2 = "Por favor repita su contraseña."
                            } else if (valores.passwordDoc !== valores.passwordDoc2) {
                                errores.passwordDoc2 = "Verifique su contraseña, no coinciden."
                            }
                            return errores;

                        }}
                        onSubmit={(valores, { resetForm }) => {
                            resetForm();
                            console.log('Formulario enviando');
                        }}
                    >
                        {({ errors }) => (
                            <Form className="row g-3" onSubmit={submitHandler}>

                                <fieldset>
                                    <small id="emailHelp" className="form-text text-muted">
                                        No compartiremos tu información
                                    </small>
                                    <div className="form-group">
                                        <label for="matriculaDoc" className="form-label">ID</label>
                                        <Field
                                            type="txt"
                                            className="form-control"
                                            id="matriculaDoc"
                                            name="matriculaDoc"
                                            placeholder="202212345"
                                        />
                                        <ErrorMessage name="matriculaDoc" component={() => (
                                            <div className="error"><p className="text-danger"><small>{errors.matriculaDoc}</small></p></div>
                                        )} />
                                    </div>
                                    <div className="form-group">
                                        <label for="nombreDoc" className="form-label">Nombre(s)</label>
                                        <Field
                                            type="txt"
                                            className="form-control"
                                            id="nombreDoc"
                                            name="nombreDoc"
                                            placeholder="Juan"
                                        />
                                        <ErrorMessage name="nombreDoc" component={() => (
                                            <div className="error"><p className="text-danger"><small>{errors.nombreDoc}</small></p></div>
                                        )} />
                                    </div>
                                    <div className="form-group">
                                        <label for="apellidoPDoc" className="form-label">Apellido Materno</label>
                                        <Field
                                            type="txt"
                                            className="form-control"
                                            id="apellidoPDoc"
                                            name="apellidoPDoc"
                                            placeholder="Pérez"
                                        />
                                        <ErrorMessage name="apellidoPDoc" component={() => (
                                            <div className="error"><p className="text-danger"><small>{errors.apellidoPDoc}</small></p></div>
                                        )} />
                                    </div>
                                    <div className="form-group">
                                        <label for="apellidoMDoc" className="form-label">Apellido Materno</label>
                                        <Field
                                            type="txt"
                                            className="form-control"
                                            id="apellidoMDoc"
                                            name="apellidoMDoc"
                                            placeholder="Pérez"
                                        />
                                        <ErrorMessage name="apellidoMDoc" component={() => (
                                            <div className="error"><p className="text-danger"><small>{errors.apellidoMDoc}</small></p></div>
                                        )} />
                                    </div>
                                    <div className="form-group">
                                        <label for="sexoDoc" className="form-label">Sexo</label>
                                        <br></br>
                                        <Field className="form-select" id="sexoDoc" name="sexoDoc" as="select">
                                            <option value="Elige una opción">Elige una opción</option>
                                            <option value="Mujer">Mujer</option>
                                            <option value="Hombre">Hombre</option>
                                            <option value="Otro">Otro</option>
                                        </Field>
                                        <ErrorMessage name="sexoDoc" component={() => (
                                            <div className="error"><p className="text-danger"><small>{errors.sexoDoc}</small></p></div>
                                        )} />
                                    </div>
                                    <div className="form-group">
                                        <label for="edadDoc" className="form-label">Edad</label>
                                        <Field
                                            type="number"
                                            className="form-control"
                                            id="edadDoc"
                                            name="edadDoc"
                                            min="18"
                                            max="80"
                                            placeholder="18"
                                        />
                                        <ErrorMessage name="edadDoc" component={() => (
                                            <div className="error"><p className="text-danger"><small>{errors.edadDoc}</small></p></div>
                                        )} />
                                    </div>
                                    <div className="form-group">
                                        <label for="emailDoc" className="form-label">Correo electrónico</label>
                                        <Field
                                            type="email"
                                            className="form-control"
                                            id="emailDoc"
                                            name="emailDoc"
                                            placeholder="Correo"
                                        />
                                        <ErrorMessage name="emailDoc" component={() => (
                                            <div className="error"><p className="text-danger"><small>{errors.emailDoc}</small></p></div>
                                        )} />
                                    </div>
                                    <div className="form-group">
                                        <label for="passwordDoc" className="form-label">Contraseña</label>
                                        <Field
                                            type="password"
                                            className="form-control"
                                            id="passwordDoc"
                                            name="passwordDoc"
                                            placeholder="Constraseña"
                                        />
                                        <ErrorMessage name="passwordDoc" component={() => (
                                            <div className="error"><p className="text-danger"><small>{errors.passwordDoc}</small></p></div>
                                        )} />
                                    </div>
                                    <div className="form-group">
                                        <label for="passwordDoc2" className="form-label">Confirmar Contraseña</label>
                                        <Field
                                            type="password"
                                            className="form-control"
                                            id="passwordDoc2"
                                            name="passwordDoc2"
                                            placeholder="Constraseña"
                                        />
                                        <ErrorMessage name="passwordDoc2" component={() => (
                                            <div className="error"><p className="text-danger"><small>{errors.passwordDoc2}</small></p></div>
                                        )} />
                                    </div>
                                </fieldset>
                                <div>
                                    <Button variant="success" type="submit">
                                        <FaRegSave />Guardar
                                    </Button>
                                    <Button variant="secondary" type="reset">
                                        <GrClearOption />Limpiar
                                    </Button>
                                    <Button variant="danger" onClick={handleClose}>
                                        Cancelar
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default RegistroDocenteModal