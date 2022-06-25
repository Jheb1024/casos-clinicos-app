import { Modal, Button } from "react-bootstrap";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Swal from "sweetalert2";
import { BiEdit } from "react-icons/bi";
import { FaRegSave } from "react-icons/fa";
import { GrClearOption } from "react-icons/gr";
import AdministradorAlumno from "../../Modelo/AdministrarUsuarios/AdministradorAlumno";

const EditarAlumnoModal = ({alumno}) => {
    console.log(alumno.id);
    const admiAl = new AdministradorAlumno();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function submitHandler(e) {
        e.preventDefault();
        const idN=alumno.id;
        const MatriculaN = e.target.elements.InputMatricula.value;
        const NombreN = e.target.elements.InputNombre.value;
        const ApellidoPN = e.target.elements.InputApellidoP.value;
        const ApellidoMN = e.target.elements.InputApellidoM.value;
        const NRCN = e.target.elements.InputNRC.value;
        if (MatriculaN === "" || NombreN === "" || ApellidoPN === "" || ApellidoMN === "" || NRCN === "") {
            new Swal({
                position: 'top-end',
                icon: 'info',
                title: 'Favor de completar los datos!!',
                showConfirmButton: false,
                timer: 3000
            });
        } else {
            new Swal({
                title: 'Actualizar alumno',
                text: '¿Desea confirmar la actualización?',
                icon: 'question',
                showDenyButton: true,
                confirmButtonText: 'Si',
                denyButtonText: `No`,
            })
                .then((respuesta) => {
                    if (respuesta.isConfirmed) {
                        admiAl.editarAlumno(MatriculaN, NombreN,ApellidoPN,ApellidoMN,NRCN,idN).then(() => Swal("El alumno se ha modificado!", {
                            icon: "success",
                        }))
                        handleClose();
                    } else {
                        handleClose();
                    }
                });
        }
    }
    return (
        <>
            <Button variant="info" onClick={handleShow}>
                <BiEdit />
            </Button>

            <Modal show={show} onHide={handleClose} animation={false} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Información alumno</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Formik
                        initialValues={
                            {
                                InputMatricula: alumno.Matricula,
                                InputNombre: alumno.Nombre,
                                InputApellidoP: alumno.ApellidoPaterno,
                                InputApellidoM: alumno.ApellidoMaterno,
                                InputNRC: alumno.NRC,
                            }
                        }
                        validate={values => {
                            let errors = {};
                            //Validaciones matricula
                            if (!values.InputMatricula) {
                                errors.InputMatricula = "Por favor ingrese su matricula."
                            } else if (!/^(?:\+|-)?\d+$/.test(values.InputMatricula)) {
                                errors.InputMatricula = "La matrícula solo puede tener números,sin espacios."
                            } else if (values.InputMatricula.length < 9 || values.InputMatricula.length > 9) {
                                errors.InputMatricula = "La mátricula solo puede tener 9 números,sin espacios."
                            }
                            //Validaciones nombre
                            if (!values.InputNombre) {
                                errors.InputNombre = "Por favor ingrese su nombre completo."
                            } else if (!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(values.InputNombre)) {
                                errors.InputNombre = "El nombre solo puede tener letras y espacios, pueden llevar acentos."
                            }
                            //Validaciones apellido paterno
                            if (!values.InputApellidoP) {
                                errors.InputApellidoP = "Por favor ingrese su apellido paterno."
                            } else if (!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(values.InputApellidoP)) {
                                errors.InputApellidoP = "El apellido paterno solo puede tener letras y espacios, pueden llevar acentos."
                            }
                            //Validaciones apellido materno
                            if (!values.InputApellidoM) {
                                errors.InputApellidoM = "Por favor ingrese su apellido materno."
                            } else if (!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(values.InputApellidoM)) {
                                errors.InputApellidoM = "El apellido materno solo puede tener letras y espacios, pueden llevar acentos."
                            }
                            //Validaciones NRC
                            if (!values.InputNRC) {
                                errors.InputNRC = "Por favor ingrese el NRC."
                            } else if (!/^(?:\+|-)?\d+$/.test(values.InputNRC)) {
                                errors.InputNRC = "El NRC de la materia solo puede tener números,sin espacios."
                            } else if (values.InputNRC.length < 5 || values.InputNRC.length > 5) {
                                errors.InputNRC = "El NRC solo puede tener 5 números,sin espacios."
                            }

                            return errors;
                        }}
                        onSubmit={(valores, { resetForm }) => {
                            resetForm();
                        }}
                    >
                        {({ errors }) => (
                            <Form onSubmit={submitHandler} style={{ textAlign: 'left', fontSize: '20px', padding: '10px', scrollBehavior: 'smooth' }}>
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
                                <br></br>
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
export default EditarAlumnoModal;