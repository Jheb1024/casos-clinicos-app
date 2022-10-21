import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FaRegPlusSquare, FaRegSave } from "react-icons/fa";
import { GrClearOption } from "react-icons/gr";
import { GoSearch } from "react-icons/go";
import { Card } from "react-bootstrap";
import { collection, getDocs, getFirestore, updateDoc, query, where, doc } from "firebase/firestore";
import firebaseApp from "../../Firebase/firebase-config";
import Swal from "sweetalert2";
const db = getFirestore(firebaseApp);
async function editarAlumnoNRC(NRCN, id) {
    const claseRef = doc(db, "Alumno", id);
    await updateDoc(claseRef, {
        NRC: NRCN
    })
        .then(() => {
            console.log("El alumno ha sido actualizado");
        })
        .catch((error) => {
            console.error(error);
        });
}
function AgregarAlumnoDocModal() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false,setAlumno(null));
    const handleShow = () => setShow(true);
    const [alumno, setAlumno] = useState(null);
    const [idA,setIdA]= useState(null);

    async function busquedaFormHandler(e) {
        setAlumno(null);
        e.preventDefault();
        const busqueda = e.target.busqueda.value;
        const q = query(collection(db, "Alumno"), where("correo", "==", busqueda));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {

            console.log(doc.id, " => ", doc.data());
            setAlumno(doc.data());
            setIdA(doc.id);
        });
    }
    function submitHandler(e) {
        e.preventDefault();
        const NRC = e.target.elements.NRC.value;
        console.log("id del alumno a editar:",idA)
        if (NRC === "") {
            new Swal({
                position: 'top-end',
                icon: 'info',
                title: 'Favor de completar los datos!!',
                showConfirmButton: false,
                timer: 3000
            });
        } else if(alumno==null){
            new Swal({
                position: 'top-end',
                icon: 'info',
                title: 'Primero debe de buscar los datos del alumno por su correo electrónico!!',
                showConfirmButton: false,
                timer: 3000
            });

        } else {
            new Swal({
                title: 'Actualizar clase',
                text: '¿Desea confirmar la actualización?',
                icon: 'question',
                showDenyButton: true,
                confirmButtonText: 'Si',
                denyButtonText: `No`,
            })
                .then((respuesta) => {
                    if (respuesta.isConfirmed) {

                        if (editarAlumnoNRC(NRC, idA)) {
                            new Swal({
                                title: "Actualización exitoso",
                                text: "La actualización fue exitosa.El nuevo NRC es:"+NRC,
                                icon: "success",
                                showConfirmButton: false,
                                timer: 3000
                            });
                            handleClose();
                            setAlumno(null);
    
                        } else {
                            new Swal({
                                title: "Actualización no exitoso",
                                text: "Favor de verificar sus datos.",
                                icon: "error",
                                showConfirmButton: false,
                                timer: 3000
                            });
                            handleClose();
                            setAlumno(null);
                        }
                        
                    }
                });
        }
    }
    return (
        <>
            <Button variant="info" onClick={handleShow}>
                <FaRegPlusSquare /> Agregar alumno
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar Alumno</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container-fluid">
                        <form className="d-flex" onSubmit={busquedaFormHandler}>
                            <input className="form-control me-2" type="search" id="busqueda" placeholder="Correo electrónico" />

                            <button className="btn btn-outline-success" type="submit"><GoSearch /></button>

                        </form>
                    </div>
                    {alumno==null && <p>Sin información</p>}
                    {alumno ?
                        <Card >
                            <Card.Body>
                                <Card.Title><h4 claseName="h4">Datos personales</h4></Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">Alumno</Card.Subtitle>
                                <Card.Text>
                                    <b>Nombre: </b>{alumno.Nombre}
                                </Card.Text>
                                <Card.Text>
                                    <b>Apellidos: </b>{alumno.ApellidoPaterno} {alumno.ApellidoMaterno}
                                </Card.Text>
                                <Card.Text>
                                    <b>ID: </b>{alumno.Matricula}
                                </Card.Text>
                                <Card.Text>
                                    <b>NRC: </b>{alumno.NRC}
                                </Card.Text>
                            </Card.Body>
                        </Card> : null}

                    <Formik
                    initialValues={{
                        NRC: ''
                    }}
                    validate={values => {
                        const errors = {};
                        if (!values.NRC) {
                            errors.NRC = "Campo requerido."
                        } else if (!/^(?:\+|-)?\d+$/.test(values.NRC)) {
                            errors.NRC = "El NRC de la materia solo puede tener letras o números, sin caracteres especiales."
                        } else if (values.NRC.length < 5 || values.NRC.length > 7) {
                            errors.NRC = "El NRC solo puede tener de 5 a 7 números, sin espacios."
                        }
                        return errors;
                    }}
                    onSubmit={(valores, { resetForm }) => {
                        resetForm();
                    }}
                    >
                         {({ errors }) => (
                        <Form onSubmit={submitHandler}>

                            <div className="form-group">
                                <label for="NRC"><b>NRC nuevo</b></label>
                                <label><small>Este NRC se actualizara en los datos del alumno para que pueda corresponder a la clase correspondiente y pueda aparecer en la lista de sus clases.</small></label>
                                <Field
                                    type="text"
                                    className="form-control"
                                    id="NRC"
                                    name="NRC"
                                />
                                <ErrorMessage name="NRC" component={() => (
                                        <div className="error"><p className="text-danger"><small>{errors.NRC}</small></p></div>
                                    )} />
                            </div>

                            <Button variant="success" type="submit">
                                <FaRegSave />Guardar
                            </Button>
                            <Button variant="secondary" type="reset">
                                <GrClearOption />Limpiar
                            </Button>

                            <Button variant="danger" onClick={handleClose}>
                                Cancelar
                            </Button>
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

export default AgregarAlumnoDocModal