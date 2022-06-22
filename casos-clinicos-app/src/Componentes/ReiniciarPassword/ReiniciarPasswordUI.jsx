import React from 'react'
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import Swal from 'sweetalert2';
import { Formik, Form, Field, ErrorMessage } from "formik";

const auth = getAuth();

async function recuperarContrasenia(email) {
    await sendPasswordResetEmail(auth, email, {url: "http://localhost:3000/inicio-sesion"})
        .then(() => {
            console.log("EL correo de reestablecimiento de la constraseña se ha enviado");
            new Swal({
                position: 'top-end',
                icon: 'info',
                title: 'EL correo de reestablecimiento de la constraseña se ha enviado.',
                showConfirmButton: false,
                timer: 3000
            });
        })
        .catch((error) => {
            if(error.code==="auth/user-not-found"){
                new Swal({
                    position: 'top-end',
                    icon: 'error',
                    title: 'Este correo electrónico no esta dado de alta.',
                    showConfirmButton: false,
                    timer: 3000
                });

            }
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(error.message);
            console.log(error.code);
        });
}

async function submitHandler(e){
    e.preventDefault();
    const email = e.target.elements.correoRecuperacion.value;
    
    if (email === "") {
        new Swal({
            position: 'top-end',
            icon: 'info',
            title: '¡Favor de introducir un correo electrónico!',
            showConfirmButton: false,
            timer: 3000
        });
    } else {
        new Swal({
            title: 'Restablecer contraseña',
            text: '¿Desea confirmar el restablecimiento de su contraseña?',
            icon: 'question',
            showDenyButton: true,
            confirmButtonText: 'Si',
            denyButtonText: `No`,
        })
            .then((respuesta) => {
                if (respuesta.isConfirmed) {
                    if (recuperarContrasenia(email).res.status === 200) {
                        new Swal({
                            title: "Acción exitosa",
                            text: "Se le notificara.....?¿?¿?",
                            icon: "success",
                            showConfirmButton: false,
                            timer: 3000
                        });
                    } else {
                        new Swal({
                            title: "Restablecimiento de contraseña no exitosa",
                            text: "Favor de verificar sus datos.",
                            icon: "error",
                            showConfirmButton: false,
                            timer: 3000
                        });
                    }
                }
            });

    }
    //recuperarContrasenia(email);
}


function ReiniciarPasswordUI() {
    return (
        <div>
        <div className="container">
            <div className="row justify-content-md-center">
                <div id="FormContainer" className="col-md-15 offset-md-0">
                    <Formik
                        initialValues={
                            {
                                correoRecuperacion: ''
                            }
                        }
                        validate={(valores) => {
                            let errores = {};
                            //Validaciones correo
                            if (!valores.correoRecuperacion) {
                                errores.correoRecuperacion = "Por favor ingrese un correo."
                            } else if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(valores.correoRecuperacion)) {
                                errores.correoRecuperacion = "El correo solo puede tener letras,numeros,puntos,guiones y un @."
                            }
                            return errores;
                        }}

                        onSubmit={(valores, { resetForm }) => {
                            resetForm();
                            console.log('Formulario enviando');
                        }}
                    >
                        {({ errors }) => (
                            <Form onSubmit={submitHandler}>
                                <div className="container">
                                    <div className="row justify-content-center align-items-center">
                                        <div className="col-auto bg-light p-2">

                                            <h1>Restablecimiento  de contraseña</h1>
                                            <p>Escribe la dirección de correo electrónico asociado a tu cuenta de CasosClínicos. </p>
                                            <div className="form-group">
                                                <label htmlFor="correoRecuperacion" className="form-label">Correo electrónico</label>
                                                <Field
                                                    type="text"
                                                    className="form-control"
                                                    id="correoRecuperacion"
                                                    name="correoRecuperacion"
                                                    placeholder="juan@gmail.com"
                                                />
                                                <ErrorMessage name="correoRecuperacion" component={() => (
                                                    <div className="error"><p className="text-danger"><small>{errors.correoRecuperacion}</small></p></div>
                                                )} />
                                            </div>
                                            <br></br>
                                            <button type="submit" className="btn btn-primary">Enviar</button>
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

    )
}

export default ReiniciarPasswordUI