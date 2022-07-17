import { Modal, Button } from "react-bootstrap";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Swal from "sweetalert2";
import { BiEdit } from "react-icons/bi";
import AdministradorDocente from "../../Modelo/AdministrarUsuarios/AdministradorDocente";
const EditarDocenteModal = ({ usuario, id }) => {
  const admiDoc = new AdministradorDocente();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  function submitHandler(e) {
    e.preventDefault();
    const MatriculaN = e.target.elements.InputMatricula.value;
    const NombreN = e.target.elements.InputNombre.value;
    const ApellidoPN = e.target.elements.InputApellidoP.value;
    const ApellidoMN = e.target.elements.InputApellidoM.value;
    if (
      MatriculaN === "" ||
      NombreN === "" ||
      ApellidoPN === "" ||
      ApellidoMN === ""
    ) {
      new Swal({
        position: "top-end",
        icon: "info",
        title: "Favor de completar los datos!!",
        showConfirmButton: false,
        timer: 3000,
      });
    } else {
      new Swal({
        title: "Actualizar docente",
        text: "¿Desea confirmar la actualización?",
        icon: "question",
        showDenyButton: true,
        confirmButtonText: "Si",
        denyButtonText: `No`,
      }).then((respuesta) => {
        if (respuesta.isConfirmed) {
          if (
            admiDoc.editarDocente(
              MatriculaN,
              NombreN,
              ApellidoPN,
              ApellidoMN,
              id
            )
          ) {
            new Swal({
              position: "center",
              icon: "success",
              title: "Actualización de datos exitosa.",
              text: "Los datos del docente ha sido actualizada correctamente.",
              showConfirmButton: true,
            });
          }
        } else if (respuesta.isDenied) {
          new Swal(
            "Sin cambios guardados.",
            "¡Verificar su información!",
            "info"
          );
        }
        handleClose();
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
          <Modal.Title>Información {usuario.rol}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              InputMatricula: usuario.Matricula,
              InputNombre: usuario.Nombre,
              InputApellidoP: usuario.ApellidoPaterno,
              InputApellidoM: usuario.ApellidoMaterno,
            }}
            validate={(values) => {
              let errors = {};
              //Validaciones matricula
              if (!values.InputMatricula) {
                errors.InputMatricula = "Por favor ingrese su ID.";
              } else if (!/^(?:\+|-)?\d+$/.test(values.InputMatricula)) {
                errors.InputMatricula =
                  "El ID solo puede tener números,sin espacios.";
              } else if (
                values.InputMatricula.length < 9 ||
                values.InputMatricula.length > 9
              ) {
                errors.InputMatricula =
                  "El ID solo puede tener 9 números,sin espacios.";
              }
              //Validaciones nombre
              if (!values.InputNombre) {
                errors.InputNombre = "Por favor ingrese su nombre completo.";
              } else if (!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(values.InputNombre)) {
                errors.InputNombre =
                  "El nombre solo puede tener letras y espacios, pueden llevar acentos.";
              }
              //Validaciones apellido paterno
              if (!values.InputApellidoP) {
                errors.InputApellidoP =
                  "Por favor ingrese su apellido paterno.";
              } else if (!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(values.InputApellidoP)) {
                errors.InputApellidoP =
                  "El apellido paterno solo puede tener letras y espacios, pueden llevar acentos.";
              }
              //Validaciones apellido materno
              if (!values.InputApellidoM) {
                errors.InputApellidoM =
                  "Por favor ingrese su apellido materno.";
              } else if (!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(values.InputApellidoM)) {
                errors.InputApellidoM =
                  "El apellido materno solo puede tener letras y espacios, pueden llevar acentos.";
              }
              return errors;
            }}
            onSubmit={(valores, { resetForm }) => {
              resetForm();
            }}
          >
            {({ errors }) => (
              <Form
                onSubmit={submitHandler}
                style={{
                  textAlign: "left",
                  fontSize: "20px",
                  padding: "10px",
                  scrollBehavior: "smooth",
                }}
              >
                <div className="form-group">
                  <label htmlFor="InputMatricula" className="form-label">
                    ID
                  </label>
                  <Field
                    type="txt"
                    className="form-control"
                    id="InputMatricula"
                    name="InputMatricula"
                    placeholder="202212345"
                  />
                  <ErrorMessage
                    name="InputMatricula"
                    component={() => (
                      <div className="error">
                        <p className="text-danger">
                          <small>{errors.InputMatricula}</small>
                        </p>
                      </div>
                    )}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="InputNombre">Nombre(s)</label>
                  <Field
                    type="txt"
                    className="form-control"
                    id="InputNombre"
                    name="InputNombre"
                    placeholder="Juan"
                  />
                  <ErrorMessage
                    name="InputNombre"
                    component={() => (
                      <div className="error">
                        <p className="text-danger">
                          <small>{errors.InputNombre}</small>
                        </p>
                      </div>
                    )}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="InputApellidoP">Apellido paterno</label>
                  <Field
                    type="txt"
                    className="form-control"
                    id="InputApellidoP"
                    name="InputApellidoP"
                    placeholder="Pérez"
                  />
                  <ErrorMessage
                    name="InputApellidoP"
                    component={() => (
                      <div className="error">
                        <p className="text-danger">
                          <small>{errors.InputApellidoP}</small>
                        </p>
                      </div>
                    )}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="InputApellidoM">Apellido materno</label>
                  <Field
                    type="txt"
                    className="form-control"
                    id="InputApellidoM"
                    name="InputApellidoM"
                    placeholder="Pérez"
                  />
                  <ErrorMessage
                    name="InputApellidoM"
                    component={() => (
                      <div className="error">
                        <p className="text-danger">
                          <small>{errors.InputApellidoM}</small>
                        </p>
                      </div>
                    )}
                  />
                </div>
                <br></br>
                <div className="btn-group" role="group">
                  <input
                    type="submit"
                    className="btn btn-success"
                    value="Guardar"
                  />
                  <Button variant="danger" onClick={handleClose}>
                    Cancelar
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
};
export default EditarDocenteModal;
