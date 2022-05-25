import React, {useState} from 'react'
import {Modal, Button, Form} from 'react-bootstrap'
import { editarSubtema } from '../../Modelo/AdministrarCuestionarios/administrarCuestionarios';
function EditarSubtemaModal({subtema,idSubtema}) {
  const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    function submitHandler(e) {
        e.preventDefault();
        const subtemaNuevo=e.target.elements.subtema.value; 
        console.log("subtema",subtema)
        //registrarSubtema(tema,subtema);
        editarSubtema(subtema,subtemaNuevo,idSubtema )
    }      
  return (
    <>
    <Button variant="primary" onClick={handleShow}>
    Editar subtema
  </Button>

  <Modal show={show} onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>Editar Subtema</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Subtema</Form.Label>
          <Form.Control
            type="text"
            placeholder=""
            autoFocus
            name='subtema'
          />
        </Form.Group>
        <Button variant="secondary" onClick={handleClose}>
        Close
      </Button>
      <Button variant="primary"  type='submit'>
          Guardar
        </Button>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      
    </Modal.Footer>
  </Modal>
</>
  )
}

export default EditarSubtemaModal