import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import firebaseApp from "../../Firebase/firebase-config";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, updateDoc } from 'firebase/firestore';
import { useHistory } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Swal from "sweetalert2";
import { FaUserPlus } from "react-icons/fa";
import { FaRegSave } from "react-icons/fa";
import { GrClearOption } from "react-icons/gr";
import AdministradorAlumno from '../../Modelo/AdministrarUsuarios/AdministradorAlumno';

function RegistroAlumnoModal() {
    const admiAl = new AdministradorAlumno();
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const auth = getAuth(firebaseApp);
    const firestore = getFirestore(firebaseApp);
    let history = useHistory();

    async function registrarAlumno(email, pass, Matricula, Nombre, ApellidoP, ApellidoM, Sexo, Edad, NRC, VecesMateriaTomada, EstudiosPrevios, FechaRegistro) {
            
        
        const infoUsuario = await createUserWithEmailAndPassword(auth, email, pass).then((usuarioFirebase) => {
            return usuarioFirebase;
        }).catch(error => {
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
                        title: 'Correo invalido',
                        showConfirmButton: false,
                        timer: 3000
                    });
                    break;
                case 'auth/operation-not-allowed':
                    console.log(`Error during sign up.`);
                    new Swal({
                        position: 'top-end',
                        icon: 'warning',
                        title: 'Ocurrio un error al registrarse',
                        showConfirmButton: false,
                        timer: 3000
                    });
                    break;
                case 'auth/weak-password':
                    console.log('Password is not strong enough. Add additional characters including special characters and numbers.');
                    new Swal({
                        position: 'top-end',
                        icon: 'warning',
                        title: 'La contraseña es muy débil',
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

            var docuRef = doc(firestore, `Alumno/${infoUsuario.user.uid}`);

            await setDoc(docuRef, {
                correo: email,
                password: pass, rol: "alumno",
                Matricula: Matricula,
                Nombre: Nombre,
                ApellidoPaterno: ApellidoP,
                ApellidoMaterno: ApellidoM,
                Sexo: Sexo,
                Edad: Edad,
                NRC: NRC,
                NumVecesTomadoMateria: VecesMateriaTomada,
                EstudiosPrevios: EstudiosPrevios,
                FechaRegistro: FechaRegistro,
                Avance: { CuestionariosCompletos: 0, PromedioGeneral: 0, TemasCompletos: 0 }
            }).catch(errr => {
                console.log("Hubo un error al registrarte" + errr.message);
                new Swal({
                    icon: 'error',
                    title: 'Error en el registro.',
                    text: 'Vuelva a intentarlo más tarde.'
                });
            })
            await setDoc(doc(firestore, `Usuarios/${infoUsuario.user.uid}`), {
                email: email,
                rol: "alumno"
            }).then(() => {
                //history.push('/usuario/alumno')
            })
            //Add idAlumno 
            const claseRef = doc(firestore, `Alumno/${infoUsuario.user.uid}`);
            await updateDoc(claseRef, {
                id: infoUsuario.user.uid,
            }).then(() => {
                console.log("Alumno actualizado con el id", infoUsuario.user.uid);
            });
        } else {
            Swal({
                icon: 'error',
                title: 'Correo ya registrado.',
                text: 'El correo electrónico ya esta registrado.Introduzca otro correo.'
            });
        }

    }
    async function submitHandler(e) {
        e.preventDefault();
        /// debemos hacer las validaciones
        const Matricula = e.target.elements.InputMatricula.value;
        const Nombre = e.target.elements.InputNombre.value;
        const ApellidoP = e.target.elements.InputApellidoP.value;
        const ApellidoM = e.target.elements.InputApellidoM.value;
        const Sexo = e.target.elements.SelectSexo.value;
        const Edad = e.target.elements.InputEdad.value;
        const NRC = e.target.elements.InputNRC.value;
        const VecesMateriaTomada = e.target.elements.SelectVeces.value;
        const EstudiosPrevios = e.target.elements.SelectEstudios.value;
        //Datos para crear cuenta
        const email = e.target.elements.emailr.value;
        const pass = e.target.elements.passwordr.value;
        const pass2 = e.target.elements.passwordr2.value;
        const FechaRegistro = Date.now();

        if (Matricula === "" || Nombre === "" || ApellidoP === "" || ApellidoM === "" || Sexo === "" || Edad === "" || NRC === ""
            || VecesMateriaTomada === "Elige una opción" || EstudiosPrevios === "Elige una opción" || email === ""
            || pass === "" || pass2 === "") {
            new Swal({
                icon: 'info',
                title: 'Favor de completar todo el formulario de registro!!',
                timer: 2000
            });
        } else {
            const matriculaRepetida = await admiAl.verificarMatriculaAlumno(Matricula);
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
                title: 'Registro alumno',
                text: '¿Desea confirmar tu registro?',
                icon: 'question',
                showDenyButton: true,
                confirmButtonText: 'Si',
                denyButtonText: `No`,
            })
                .then((respuesta) => {
                    if (respuesta.isConfirmed) {
                        if (registrarAlumno(email, pass, Matricula, Nombre, ApellidoP, ApellidoM, Sexo, Edad, NRC, VecesMateriaTomada, EstudiosPrevios, FechaRegistro)) {
                            new Swal({
                                title: "Registro exitoso",
                                text: "El usuario ya puede iniciar sesión con su respectivo correo electrónico y contraseña.",
                                icon: "success",
                                timer: 3000
                            });
                            handleClose();
                        } else {
                            new Swal({
                                title: "Registro no exitoso",
                                text: "Favor de verificar sus datos.",
                                icon: "error",
                                timer: 3000
                            });
                            handleClose();
                        }
                    }
                });
            }
        }//fin else
        console.log("submit", email, pass);
    }

    return (
        <>
            <Button variant="info" onClick={handleShow}>
                <FaUserPlus />Registrar alumno
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title> <h1 className="h1">Registro Alumno</h1></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Formik
                        initialValues={
                            {
                                InputMatricula: '',
                                InputNombre: '',
                                InputApellidoP: '',
                                InputApellidoM: '',
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
                            //Validaciones apellido paterno
                            if (!valores.InputApellidoP) {
                                errores.InputApellidoP = "Por favor ingrese su apellido paterno."
                            } else if (!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(valores.InputApellidoP)) {
                                errores.InputApellidoP = "El apellido paterno solo puede tener letras y espacios, pueden llevar acentos."
                            }
                            //Validaciones apellido materno
                            if (!valores.InputApellidoM) {
                                errores.InputApellidoM = "Por favor ingrese su apellido materno."
                            } else if (!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(valores.InputApellidoM)) {
                                errores.InputApellidoM = "El apellido materno solo puede tener letras y espacios, pueden llevar acentos."
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
                        }}
                    >
                        {({ errors }) => (
                            <Form className="row g-3" onSubmit={submitHandler}>
                                <fieldset>
                                    <small id="emailHelp" className="form-text text-muted">No compartiremos tu información</small>
                                    <div className="form-group">
                                        <label for="InputMatricula" className="form-label">Matrícula</label>
                                        <Field
                                            type="txt"
                                            className="form-control"
                                            id="InputMatricula"
                                            name="InputMatricula"
                                            placeholder="202212345"
                                        />
                                        <ErrorMessage name="InputMatricula" component={() => (
                                            <div className="error"><p className="text-danger"><small>{errors.InputMatricula}</small></p></div>
                                        )} />
                                    </div>
                                    <div className="form-group">
                                        <label for="InputNombre">Nombre(s)</label>
                                        <Field type="txt"
                                            className="form-control"
                                            id="InputNombre"
                                            name="InputNombre"
                                            placeholder="Juan"
                                        />
                                        <ErrorMessage name="InputNombre" component={() => (
                                            <div className="error"><p className="text-danger"><small>{errors.InputNombre}</small></p></div>
                                        )} />
                                    </div>
                                    <div className="form-group">
                                        <label for="InputApellidoP">Apellido paterno</label>
                                        <Field type="txt"
                                            className="form-control"
                                            id="InputApellidoP"
                                            name="InputApellidoP"
                                            placeholder="Pérez"
                                        />
                                        <ErrorMessage name="InputApellidoP" component={() => (
                                            <div className="error"><p className="text-danger"><small>{errors.InputApellidoP}</small></p></div>
                                        )} />
                                    </div>
                                    <div className="form-group">
                                        <label for="InputApellidoM">Apellido materno</label>
                                        <Field type="txt"
                                            className="form-control"
                                            id="InputApellidoM"
                                            name="InputApellidoM"
                                            placeholder="Pérez"
                                        />
                                        <ErrorMessage name="InputApellidoM" component={() => (
                                            <div className="error"><p className="text-danger"><small>{errors.InputApellidoM}</small></p></div>
                                        )} />
                                    </div>
                                    <div className="form-group">
                                        <label for="InputSexo">Sexo</label><br></br>
                                        <Field className="form-select" id="SelectSexo" name="SelectSexo" as="select">
                                            <option value="Elige una opción">Elige una opción</option>
                                            <option value="Mujer">Mujer</option>
                                            <option value="Hombre">Hombre</option>
                                            <option value="Hombre">Otro</option>
                                        </Field>
                                        <ErrorMessage name="SelectSexo" component={() => (
                                            <div className="error"><p className="text-danger"><small>{errors.SelectSexo}</small></p></div>
                                        )} />
                                    </div>
                                    <div className="form-group">
                                        <label for="InputEdad">Edad</label>
                                        <Field
                                            type="number"
                                            className="form-control"
                                            id="InputEdad"
                                            name="InputEdad"
                                            min="18" max="80"
                                            placeholder="18"
                                        />
                                        <ErrorMessage name="InputEdad" component={() => (
                                            <div className="error"><p className="text-danger"><small>{errors.InputEdad}</small></p></div>
                                        )} />
                                    </div>
                                    <div className="form-group">
                                        <label for="InputNRC">NRC de la materia</label>
                                        <Field
                                            type="text"
                                            className="form-control"
                                            id="InputNRC"
                                            name="InputNRC"
                                            placeholder="45613"
                                        />
                                        <ErrorMessage name="InputNRC" component={() => (
                                            <div className="error"><p className="text-danger"><small>{errors.InputNRC}</small></p></div>
                                        )} />
                                    </div>
                                    <div className="form-group">
                                        <label for="SelectVeces">¿Cuántas veces ha tomado la materia?</label>
                                        <Field className="form-select" id="SelectVeces" name="SelectVeces" as="select">
                                            <option value="Elige una opción">Elige una opción</option>
                                            <option value="0">0</option>
                                            <option value="1">1</option>
                                            <option value="2+">2+</option>
                                        </Field>
                                        <ErrorMessage name="SelectVeces" component={() => (
                                            <div className="error"><p className="text-danger"><small>{errors.SelectVeces}</small></p></div>
                                        )} />
                                    </div>
                                    <div className="form-group">
                                        <label for="SelectEstudios">¿Tiene estudios previos?</label>
                                        <Field className="form-select" name="SelectEstudios" id="SelectEstudios" as="select">
                                            <option value="Elige una opción">Elige una opción</option>
                                            <option value="Si">Si</option>
                                            <option value="No">No</option>
                                        </Field>
                                        <ErrorMessage name="SelectEstudios" component={() => (
                                            <div className="error"><p className="text-danger"><small>{errors.SelectEstudios}</small></p></div>
                                        )} />
                                    </div>

                                    <div className="form-group">
                                        <label for="email">Correo electrónico</label>
                                        <Field
                                            type="txt"
                                            className="form-control"
                                            id="emailr"
                                            name="emailr"
                                            placeholder="Correo"
                                        />
                                        <ErrorMessage name="emailr" component={() => (
                                            <div className="error"><p className="text-danger"><small>{errors.emailr}</small></p></div>
                                        )} />

                                    </div>
                                    <div className="form-group">
                                        <label for="passwordr">Contraseña</label>
                                        <Field
                                            type="password"
                                            className="form-control"
                                            id="passwordr"
                                            name="passwordr"
                                            placeholder="Constraseña"
                                        />
                                        <ErrorMessage name="passwordr" component={() => (
                                            <div className="error"><p className="text-danger"><small>{errors.passwordr}</small></p></div>
                                        )} />
                                    </div>
                                    <div className="form-group">
                                        <label for="passwordr2">Confirmar Contraseña</label>
                                        <Field
                                            type="password"
                                            className="form-control"
                                            id="passwordr2"
                                            name="passwordr2"
                                            placeholder="Constraseña"
                                        />
                                        <ErrorMessage name="passwordr2" component={() => (
                                            <div className="error"><p className="text-danger"><small>{errors.passwordr2}</small></p></div>
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

export default RegistroAlumnoModal