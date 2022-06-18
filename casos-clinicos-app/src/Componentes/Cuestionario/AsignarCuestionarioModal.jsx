import React, {useState, useEffect} from 'react'
import {Modal, Button, Form} from 'react-bootstrap'
import { asignarCuestionario} from '../../Modelo/AdministrarCuestionarios/administrarCuestionarios';
import firebaseApp,{ storage} from "../../Firebase/firebase-config";
import {
  addDoc, collection, getFirestore, doc, getDoc, updateDoc,
  deleteDoc, getDocs, runTransaction, query, where, arrayUnion, onSnapshot, setDoc, orderBy
} from "firebase/firestore";
const db = getFirestore(firebaseApp);

function AsignarCuestionarioModal({quiz}) {
    console.log("Datos del cuestionario a asignar");
    console.log(quiz);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    function submitHandler(e) {
        e.preventDefault();
        const nrc=e.target.elements.nrc.value; 
        const idC=quiz.idCuestionario;
        console.log("nrc",nrc)
        console.log("idC",idC)
        asignarCuestionario(idC,nrc);
    }
    const [NrcAsignado,setNrcAsignado] = useState([0]);  

useEffect(() => {
    console.log("Cuestionario en resultado:::", quiz.idCuestionario);
    const cuestionarioRef = collection(db, "Cuestionarios");
    const q = query(cuestionarioRef, where("idCuestionario", "==", quiz.idCuestionario));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const cities = [];
        querySnapshot.forEach((doc) => {
            cities.push(doc.data().nrcClase);
            setNrcAsignado(cities.join());

        });
        console.log("NRC`s de las clases a las que ya se les asigno el cuestionario: ", cities.join());
    });

    return () => {
        unsubscribe();
    }

}, []);

function cerrar(){
  setShow(false);
  setNrcAsignado(null)
}

  return (
    <>
    <Button variant="info" onClick={handleShow}>
      Asignar
    </Button>

    <Modal show={show} onHide={()=>cerrar()}>
      <Modal.Header closeButton>
        <Modal.Title>Asignar cuestionario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {NrcAsignado && <p><strong>NRC`s asignado:</strong> <u>{NrcAsignado}</u></p>}
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Nrc de la clase</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              autoFocus
              name='nrc'
              id='nrc'

            />
          </Form.Group>
         <Button variant="secondary" onClick={()=>cerrar}>
          Cancelar
        </Button>
        <Button variant="primary"  type='submit'>
          Asignar
        </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
       
      </Modal.Footer>
    </Modal>
  </>
  )
}

export default AsignarCuestionarioModal