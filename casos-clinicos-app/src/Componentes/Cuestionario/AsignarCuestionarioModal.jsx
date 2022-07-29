import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import {
  asignarCuestionario,
  eliminarAsignarCuestionario,
} from "../../Modelo/AdministrarCuestionarios/administrarCuestionarios";
import Swal from "sweetalert2";

function AsignarCuestionarioModal({ quiz, docente, nrcAsig }) {
  console.log("Datos del cuestionario a asignar");
  console.log(quiz);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  function submitHandler(e) {
    e.preventDefault();
    const nrc = e.target.elements.nrc.value;
    const idC = quiz.idCuestionario;
    const idDoc = docente.uid;
    console.log("nrc", nrc);
    console.log("idC", idC);
    console.log("idDocente", idDoc);
    asignarCuestionario(idC, nrc, idDoc);
  }

  function eliminarNRC() {
    console.log("Entro eliiminarNRC");
    const nrcE = document.getElementById("nrc").value;
    const idCu = quiz.idCuestionario;
    const idDoce = docente.uid;
    if (nrcAsig != null) {
      new Swal({
        title: "Eliminar la asignación",
        text: "¿Desea confirmar la eliminación?",
        icon: "question",
        showDenyButton: true,
        confirmButtonText: "Si",
        denyButtonText: `No`,
      }).then((respuesta) => {
        if (respuesta.isConfirmed) {
          eliminarAsignarCuestionario(idCu, nrcE, idDoce, nrcAsig);
        } else {
          handleClose();
        }
      });
    } else {
      new Swal({
        position: "top",
        icon: "warning",
        title: "Sin clase asignada.",
        text: "El cuestionario aún no tiene clases asignadas.",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  }
  function cerrar() {
    setShow(false);
  }

  return (
    <>
      <Button variant="info" onClick={handleShow}>
        Asignar
      </Button>

      <Modal show={show} onHide={() => cerrar()}>
        <Modal.Header closeButton>
          <Modal.Title>Asignar cuestionario/Eliminar asignación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {nrcAsig != null && (
            <p>
              <strong>
                NRC`s asignado:
                {nrcAsig?.map((nrcM, index) => (
                  <ul>
                    <li>{nrcM}</li>
                  </ul>
                ))}
              </strong>
            </p>
          )}
          {nrcAsig == null && (
            <p>
              <strong>El cuestionario no esta asignado a ninguna clase.</strong>
            </p>
          )}
          <Form onSubmit={submitHandler}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Nrc de la clase</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                autoFocus
                name="nrc"
                id="nrc"
              />
            </Form.Group>
            <Button variant="secondary" onClick={() => cerrar()}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Asignar
            </Button>
            <Button variant="danger" onClick={() => eliminarNRC()}>
              Eliminar
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
}

export default AsignarCuestionarioModal;
