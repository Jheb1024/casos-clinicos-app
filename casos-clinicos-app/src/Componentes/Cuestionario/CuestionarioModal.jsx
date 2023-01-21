import React, { useState } from 'react'
import { Button, Modal, Form } from 'react-bootstrap'
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import './CuestionarioModal.css';

function CuestionarioModal({ quiz }) {
  function getImage(refImage) {
    if(refImage !== 'none'){
      const storage = getStorage();
      getDownloadURL(ref(storage, refImage))
      .then((url) => {
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = (event) => {
        };
        xhr.open('GET', url);
        xhr.send();
        const img = document.getElementById('myimg');
        img.setAttribute('src', url);
      })
      .catch((error) => {
        console.log('Hubo un error al cargar la imagen',error)
      });
    }
    
  }
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  getImage(quiz.imageRef);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Visualizar
      </Button>

      <Modal show={show} onHide={handleClose} style={{ width: '100%' }} size="lg" scrollable={true}>
        <Modal.Header closeButton>
          <Modal.Title>{quiz.Titulo}</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <Form style={{ width: '100%' }}>
            {/*Pregunta 1*/}
            <div className='enunciado' >
            <div><textarea value={quiz.Enunciado} rows='4' cols='80' readOnly/></div>
            </div>
            {<img id='myimg' alt=''></img>}
            <div className='pregunta' style={{ textAlign: 'center', width: '500px', height: '130px' }}>
              <div className='pregunta-respuesta' style={{ float: 'left', width: '300px' }}>
                <label htmlFor="pregunta_1">Pregunta 1</label>
                <br />
                <input className="pregunta_field" type="text" name="pregunta_1" value={quiz.pregunta_1} readOnly />

                <br />
                <input className="respuesta_field" type="text" name="respuesta_1" placeholder="Respuesta 1" value={quiz.respuesta_1} readOnly />

                <br />
                <input className="respuesta_field" type="text" name="respuesta_2" placeholder="Respuesta 2" value={quiz.respuesta_2} readOnly />

                <br />
                <input className="respuesta_field" type="text" name="respuesta_3" placeholder="Respuesta 3" value={quiz.respuesta_3} readOnly />
                <br />
                <input className="respuesta_field" type="text" name="respuesta_4" placeholder="Respuesta 4" value={quiz.respuesta_4} readOnly />
              </div>
              <br />
              <div className='valor-respuesta'>
                Valor: {quiz.valorResPregunta1} puntos
              </div>
            </div>
            <br />
            <div className='pregunta'>
              <div className='pregunta-respuesta'>
                <label htmlFor="pregunta_2">Pregunta 2</label>
                <br />
                <input className="pregunta_field" type="text" name="pregunta_2" value={quiz.pregunta_2} readOnly />

                <br />
                <input className="respuesta_field" type="text" name="respuesta_2_1" placeholder="Respuesta 1" value={quiz.respuesta_2_1} readOnly />

                <br />
                <input className="respuesta_field" type="text" name="respuesta_2_2" placeholder="Respuesta 2" value={quiz.respuesta_2_2} readOnly />

                <br />
                <input className="respuesta_field" type="text" name="respuesta_2_3" placeholder="Respuesta 3" value={quiz.respuesta_2_3} readOnly />
                <br />
                <input className="respuesta_field" type="text" name="respuesta_2_4" placeholder="Respuesta 4" value={quiz.respuesta_2_4} readOnly />

                <br />
              </div>
              <div className='valor-respuesta'>
                Valor: {quiz?.valorResPregunta2} puntos
              </div>
            </div>
            <div className='pregunta'>
              <div className='pregunta-respuesta'>
                <label htmlFor="pregunta_3">Pregunta 3</label>
                <br />
                <input className="pregunta_field" type="text" name="pregunta_3" value={quiz.pregunta_3} readOnly />

                <br />
                <input className="respuesta_field" type="text" name="respuesta_3_1" placeholder="Respuesta 1" value={quiz.respuesta_3_1} readOnly />

                <br />
                <input className="respuesta_field" type="text" name="respuesta_3_2" placeholder="Respuesta 2" value={quiz.respuesta_3_2} readOnly />

                <br />
                <input className="respuesta_field" type="text" name="respuesta_3_3" placeholder="Respuesta 3" value={quiz.respuesta_3_3} readOnly />
                <br />
                <input className="respuesta_field" type="text" name="respuesta_3_4" placeholder="Respuesta 4" value={quiz.respuesta_3_4} readOnly />

              </div>
              <div className='valor-respuesta'>
                Valor: {quiz.valorResPregunta3} puntos
              </div>

            </div>
            <br />
            <div className='pregunta'>
              <div className='pregunta-respuesta'>
                <label htmlFor="pregunta-4">Pregunta 4</label>
                <br />
                <input className="pregunta_field" type="text" name="pregunta_4" value={quiz.pregunta_4} readOnly />

                <br />
                <input className="respuesta_field" type="text" name="respuesta_4_1" placeholder="Respuesta 1" value={quiz.respuesta_4_1} readOnly />

                <br />
                <input className="respuesta_field" type="text" name="respuesta_4_2" placeholder="Respuesta 2" value={quiz.respuesta_4_2} readOnly />

                <br />
                <input className="respuesta_field" type="text" name="respuesta_4_3" placeholder="Respuesta 3" value={quiz.respuesta_4_3} readOnly />
                <br />
                <input className="respuesta_field" type="text" name="respuesta_4_4" placeholder="Respuesta 4" value={quiz.respuesta_4_4} readOnly />

              </div>
              <div className='valor-respuesta'>
                Valor: {quiz.valorResPregunta4} puntos
              </div>

            </div>
            <br />

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default CuestionarioModal