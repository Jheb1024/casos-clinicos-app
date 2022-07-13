import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { editarSubtema } from '../../Modelo/AdministrarCuestionarios/administrarCuestionarios';
import { AiFillEdit } from "react-icons/ai";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Swal from "sweetalert2";
import { FaRegSave } from "react-icons/fa";
function EditarSubtemaModal({ subtema, idSubtema }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  function submitHandler(e) {
    e.preventDefault();
    const subtemaNuevo = e.target.elements.subtemaF.value;
    console.log("subtema", subtema)
    if (subtemaNuevo === "") {
      new Swal({
        position: 'top-end',
        icon: 'info',
        title: 'Favor de completar los datos!!',
        showConfirmButton: false,
        timer: 3000
      });
    } else {
      new Swal({
        title: 'Actualizar Subtema',
        text: '¿Desea confirmar la actualización?',
        icon: 'question',
        showDenyButton: true,
        confirmButtonText: 'Si',
        denyButtonText: `No`,
      })
        .then((respuesta) => {
          if (respuesta.isConfirmed) {
            if (editarSubtema(subtema, subtemaNuevo, idSubtema)) {
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
      <Button variant="info" onClick={handleShow} style={{float: 'right'}}>
        <AiFillEdit />
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Subtema</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              subtemaF: subtema
            }}
            validate={values => {
              const errors = {};
              if (!values.subtemaF) {
                errors.subtemaF = 'Campo requerido,'
              } else if (!/^[a-zA-ZÀ-ÿ0-9\s]{1,40}$/.test(values.subtemaF)) {
                errors.subtemaF = "El nombre del tema solo puede tener letras,números y espacios, pueden llevar acentos."
              }
              return errors;
            }}
          >
            {({ errors }) => (
              <Form onSubmit={submitHandler}>
                <div class="form-group">
                  <label for="subtemaF">Nombre del subtema</label>
                  <Field
                    type="text"
                    class="form-control"
                    id="subtemaF"
                    name="subtemaF"
                    placeholder="Acido-base"
                  />
                  <ErrorMessage name="subtemaF" component={() => (
                    <div className="error"><p class="text-danger"><small>{errors.subtemaF}</small></p></div>
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

export default EditarSubtemaModal