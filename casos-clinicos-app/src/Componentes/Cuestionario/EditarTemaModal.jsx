import React, { useState } from 'react'
import { Modal, Button} from 'react-bootstrap'
import { editarTemaAdmin } from '../../Modelo/AdministrarCuestionarios/administrarCuestionarios';
import { AiFillEdit } from "react-icons/ai";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Swal from "sweetalert2";
import { FaRegSave } from "react-icons/fa";
function EditarTemaModal({ tema, idTema }) {

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  function submitHandler(e) {
    e.preventDefault();
    const temaNuevo = e.target.elements.temaF.value;
    console.log("tema", tema)
    if (temaNuevo === "") {
      new Swal({
        position: 'top-end',
        icon: 'info',
        title: 'Favor de completar los datos!!',
        showConfirmButton: false,
        timer: 3000
      });
    } else {
      new Swal({
        title: 'Actualizar Tema',
        text: '¿Desea confirmar la actualización?',
        icon: 'question',
        showDenyButton: true,
        confirmButtonText: 'Si',
        denyButtonText: `No`,
      })
        .then((respuesta) => {
          if (respuesta.isConfirmed) {

            if (editarTemaAdmin(temaNuevo, tema, idTema)) {
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
      <Button variant="info" className="ml-3" onClick={handleShow}>
        <AiFillEdit />Editar tema
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Tema</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              temaF: tema
            }}
            validate={values => {
              const errors = {};
              if (!values.temaF) {
                errors.temaF = 'Campo requerido,'
              } else if (!/^[a-zA-ZÀ-ÿ0-9\s]{1,40}$/.test(values.temaF)) {
                errors.TemaF = "El nombre del tema solo puede tener letras,números y espacios, pueden llevar acentos."
              }
              return errors;
            }}
          >
            {({ errors }) => (
              <Form onSubmit={submitHandler}>
                <div class="form-group">
                  <label for="temaF">Nombre del tema</label>
                  <Field
                    type="text"
                    class="form-control"
                    id="temaF"
                    name="temaF"
                    placeholder="Acido-base"
                  />
                  <ErrorMessage name="temaF" component={() => (
                    <div className="error"><p class="text-danger"><small>{errors.temaF}</small></p></div>
                  )} />
                </div>
                <br></br>
                <Button variant="success" type='submit'>
                <FaRegSave />Guardar
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

export default EditarTemaModal