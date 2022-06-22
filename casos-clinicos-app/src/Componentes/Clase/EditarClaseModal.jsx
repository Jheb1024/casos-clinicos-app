import { Modal, Button } from "react-bootstrap";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Swal from "sweetalert2";
import { BiEdit } from "react-icons/bi";
import { FaRegSave } from "react-icons/fa";
import { GrClearOption } from "react-icons/gr";
import { editarClase } from "../../Modelo/AdministrarClase/administrarClase"
const EditarClaseModal = ({ clase, id }) => {
    console.log(id);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function submitHandler(e) {
        e.preventDefault();
        const NRC = e.target.elements.NRC.value;
        const NombreClase = e.target.elements.NombreClase.value;
        if (NRC === "" || NombreClase === "") {
            new Swal({
                position: 'top-end',
                icon: 'info',
                title: 'Favor de completar los datos!!',
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

                        if (editarClase(NombreClase, NRC, id)) {
                            new Swal({
                                title: "Actualización exitoso",
                                text: "La actualización fue exitosa.",
                                icon: "success",
                                showConfirmButton: false,
                                timer: 3000
                            });
                        } else {
                            new Swal({
                                title: "Actualización no exitoso",
                                text: "Favor de verificar sus datos.",
                                icon: "error",
                                showConfirmButton: false,
                                timer: 3000
                            });
                        }
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
                    <Modal.Title>Editar Clase</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Formik
                        initialValues={{
                            NRC: clase.NRC,
                            NombreClase: clase.NombreClase
                        }}
                        validate={values => {
                            const errors = {};
                            if (!values.NombreClase) {
                                errors.NombreClase = 'Campo requerido,'
                            } else if (!/^[a-zA-ZÀ-ÿ0-9\s]{1,40}$/.test(values.NombreClase)) {
                                errors.NombreClase = "El nombre de la clase solo puede tener letras y espacios, pueden llevar acentos."
                            }
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
                            <Form onSubmit={submitHandler} style={{ textAlign: 'left', fontSize: '20px', padding: '10px', scrollBehavior: 'smooth' }}>
                                <div class="form-group">
                                    <label for="NombreClase">Nombre de la clase</label>
                                    <Field
                                        type="text"
                                        class="form-control"
                                        id="NombreClase"
                                        name="NombreClase"
                                        placeholder="Bioquimica I"
                                    />
                                    <ErrorMessage name="NombreClase" component={() => (
                                        <div className="error"><p class="text-danger"><small>{errors.NombreClase}</small></p></div>
                                    )} />
                                </div>
                                <div class="form-group">
                                    <label for="NRC">NRC de la clase</label>
                                    <Field
                                        type="text"
                                        class="form-control"
                                        id="NRC"
                                        name="NRC"
                                        placeholder="45613"
                                    />
                                    <ErrorMessage name="NRC" component={() => (
                                        <div className="error"><p class="text-danger"><small>{errors.NRC}</small></p></div>
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
export default EditarClaseModal;