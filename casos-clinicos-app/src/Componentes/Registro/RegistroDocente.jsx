import React, {useState} from "react";
import { submitHandler } from "./funcRegistroDocente";
import { Formik, Form, Field, ErrorMessage, isNan } from "formik";
import Swal from "sweetalert2";
import "./registro.css";
function RegistroDocente() {
    return (
        <div className="container px-lg-2">
            <div class="row mx-lg-n2">
                <div className="col py-3 px-lg-5 border bg-light text-align:center">
                    <img
                        src="https://media.istockphoto.com/photos/doctor-woman-hands-typing-on-laptop-at-the-office-picture-id1216080907?b=1&k=20&m=1216080907&s=170667a&w=0&h=7HKvtHHKTO8T-KhK8GD2qHuxsu-4EOfHLd15gmpyrdg="
                        width="550"
                        height="380"
                    ></img>
                    <img
                        src="https://media.istockphoto.com/photos/doctor-woman-hands-typing-on-laptop-at-the-office-picture-id1216080907?b=1&k=20&m=1216080907&s=170667a&w=0&h=7HKvtHHKTO8T-KhK8GD2qHuxsu-4EOfHLd15gmpyrdg="
                        width="550"
                        height="380"
                    ></img>
                </div>
                <div class="col py-3 px-lg-2 border bg-light">
                    <Formik
                        initialValues={
                            {
                                matriculaDoc: '',
                                nombreDoc: '',
                                sexoDoc: '',
                                edadDoc: '',
                                nrcDoc: '',
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
                            //Validaciones sexo
                            if (!valores.sexoDoc || valores.sexoDoc === "Elige una opción") {
                                errores.sexoDoc = "Por favor seleccione su sexo."
                            }
                            //Validaciones edad
                            if (!valores.edadDoc) {
                                errores.edadDoc = "Por favor ingrese su edad."
                            } else if (!/^[0-9]{2}$/.test(valores.edadDoc)) {
                                errores.edadDoc = "Edad inválida."
                            }else if(valores.edadDoc<18){
                                errores.edadDoc = "Edad inválida."
                            }
                            //Validaciones NRC
                            if (!valores.nrcDoc) {
                                errores.nrcDoc = "Por favor ingrese el NRC."
                            } else if (!/^(?:\+|-)?\d+$/.test(valores.nrcDoc)) {
                                errores.nrcDoc = "El NRC de la materia solo puede tener números,sin espacios."
                            } else if (valores.nrcDoc.length < 5 || valores.nrcDoc.length > 5) {
                                errores.nrcDoc = "El NRC solo puede tener 5 números,sin espacios."
                            }
                            //Validaciones correo
                            if (!valores.emailDoc) {
                                errores.emailDoc = "Por favor ingrese un correo."
                            } else if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(valores.emailDoc)) {
                                errores.emailDoc= "El correo solo puede tener letras,numeros,puntos,guiones y un @."
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
                        <Form class="row g-3" onSubmit={submitHandler}>

                            <fieldset>
                                <h1 className="h1">Registro Docente</h1>
                                <small id="emailHelp" class="form-text text-muted">
                                    No compartiremos tu información
                                </small>
                                <div class="form-group">
                                    <label for="matriculaDoc" class="form-label">Matrícula</label>
                                    <Field
                                        type="txt"
                                        class="form-control"
                                        id="matriculaDoc"
                                        name="matriculaDoc"
                                        placeholder="202212345"
                                    />
                                    <ErrorMessage name="matriculaDoc" component={() => (
                                        <div className="error"><p class="text-danger"><small>{errors.matriculaDoc}</small></p></div>
                                    )} />
                                </div>
                                <div class="form-group">
                                    <label for="nombreDoc" class="form-label">Nombre completo</label>
                                    <Field
                                        type="txt"
                                        class="form-control"
                                        id="nombreDoc"
                                        name="nombreDoc"
                                        placeholder="Juan Pérez Pérez"
                                    />
                                    <ErrorMessage name="nombreDoc" component={() => (
                                        <div className="error"><p class="text-danger"><small>{errors.nombreDoc}</small></p></div>
                                    )} />
                                </div>
                                <div class="form-group">
                                    <label for="sexoDoc" class="form-label">Sexo</label>
                                    <br></br>
                                    <Field class="form-select" id="sexoDoc" name="sexoDoc" as="select">
                                        <option value="Elige una opción">Elige una opción</option>
                                        <option value="Mujer">Mujer</option>
                                        <option value="Hombre">Hombre</option>
                                    </Field>
                                    <ErrorMessage name="sexoDoc" component={() => (
                                        <div className="error"><p class="text-danger"><small>{errors.sexoDoc}</small></p></div>
                                    )} />
                                </div>
                                <div class="form-group">
                                    <label for="edadDoc" class="form-label">Edad</label>
                                    <Field
                                        type="number"
                                        class="form-control"
                                        id="edadDoc"
                                        name="edadDoc"
                                        min="18"
                                        max="80"
                                        placeholder="18"
                                    />
                                    <ErrorMessage name="edadDoc" component={() => (
                                        <div className="error"><p class="text-danger"><small>{errors.edadDoc}</small></p></div>
                                    )} />
                                </div>
                                <div class="form-group">
                                    <label for="nrcDoc" class="form-label">NRC</label>
                                    <Field
                                        type="text"
                                        class="form-control"
                                        id="nrcDoc"
                                        name="nrcDoc"
                                        placeholder="456123"
                                    />
                                    <ErrorMessage name="nrcDoc" component={() => (
                                        <div className="error"><p class="text-danger"><small>{errors.nrcDoc}</small></p></div>
                                    )} />
                                </div>
                                <div class="form-group">
                                    <label for="emailDoc" class="form-label">Correo electrónico</label>
                                    <Field
                                        type="email"
                                        class="form-control"
                                        id="emailDoc"
                                        name="emailDoc"
                                        placeholder="Correo"
                                    />
                                    <ErrorMessage name="emailDoc" component={() => (
                                        <div className="error"><p class="text-danger"><small>{errors.emailDoc}</small></p></div>
                                    )} />
                                </div>
                                <div class="form-group">
                                    <label for="passwordDoc" class="form-label">Contraseña</label>
                                    <Field
                                        type="password"
                                        class="form-control"
                                        id="passwordDoc"
                                        name="passwordDoc"
                                        placeholder="Constraseña"
                                    />
                                    <ErrorMessage name="passwordDoc" component={() => (
                                        <div className="error"><p class="text-danger"><small>{errors.passwordDoc}</small></p></div>
                                    )} />
                                </div>
                                <div class="form-group">
                                    <label for="passwordDoc2" class="form-label">Confirmar Contraseña</label>
                                    <Field
                                        type="password"
                                        class="form-control"
                                        id="passwordDoc2"
                                        name="passwordDoc2"
                                        placeholder="Constraseña"
                                    />
                                    <ErrorMessage name="passwordDoc2" component={() => (
                                        <div className="error"><p class="text-danger"><small>{errors.passwordDoc2}</small></p></div>
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
                                    class="btn btn-success"
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
