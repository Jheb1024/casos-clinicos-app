import React, {useState} from 'react'
import {Modal, Button, Form} from 'react-bootstrap'
import { registrarTema, registrarSubtema } from '../../Modelo/AdministrarCuestionarios/administrarCuestionarios';

function TemaModal() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    function submitHandler(e) {
        e.preventDefault();
        const tema=e.target.elements.tema.value; 
        console.log("tema",tema)
        registrarTema(tema);
    }
  return (
    <>
    <Button variant="primary" onClick={handleShow}>
      Agregar tema
    </Button>

    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Tema</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Tema</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              autoFocus
              name='tema'
            />
          </Form.Group>
         <Button variant="secondary" onClick={handleClose}>
          Cancelar
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

export default TemaModal