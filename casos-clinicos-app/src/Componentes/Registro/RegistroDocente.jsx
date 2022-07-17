import React, { useState } from "react";
import { submitHandler } from "./funcRegistroDocente";
import { Formik, Form, Field, ErrorMessage, isNan } from "formik";
import Swal from "sweetalert2";
import firebaseApp from "C:/Users/jhan_/Documents/casosc-app/casos-clinicos-app/casos-clinicos-app/src/Firebase/firebase-config.js";
import { getAuth, createUserWithEmailAndPassword,signOut, } from 'firebase/auth';

import "./registro.css";
function RegistroDocente() {
    
    return (
        <div className="container px-lg-2">
            <div className="row mx-lg-n2">
                <div className="image col py-3 px-lg-5 border bg-light">
                    <img 
                        src="https://media.istockphoto.com/photos/doctor-woman-hands-typing-on-laptop-at-the-office-picture-id1216080907?b=1&k=20&m=1216080907&s=170667a&w=0&h=7HKvtHHKTO8T-KhK8GD2qHuxsu-4EOfHLd15gmpyrdg="
                        width="550"
                        height="380"
                        alt=''
                    ></img>
                </div>
                <div className="col py-3 px-lg-2 border bg-light">
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
                                    <h1 className="h1">Registro Docente</h1>
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
                                <br />
                                <label for="txt">
                                    ¿Ya tienes una cuenta? <a href="/inicio-sesion">Iniciar Sesión</a>
                                </label>
                                <br />
                                <div>
                                    <input
                                        type="submit"
                                        className="btn btn-success"
                                        value="Registrarme"
                                    />
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
}

export default RegistroDocente;
