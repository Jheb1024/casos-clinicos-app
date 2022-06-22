import React, { useState } from 'react'
import { Button, Modal, Form } from 'react-bootstrap'
import { getStorage, ref, getDownloadURL } from "firebase/storage";

function CuestionarioModal({ quiz }) {
  const [imageExists, setImageExists]=useState(null);
  function getImage(refImage) {
    if(refImage !== 'none'){
      //setImageExists(true)
      const storage = getStorage();
      getDownloadURL(ref(storage, refImage))
      .then((url) => {
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = (event) => {
          const blob = xhr.response;
        };
        xhr.open('GET', url);
        xhr.send();
  
        // Or inserted into an <img> element
        const img = document.getElementById('myimg');
        img.setAttribute('src', url);
      })
      .catch((error) => {
        console.log('Hubo un error al cargar la imagen',error)
      });
    }else{
      //setImageExists(false)
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

      <Modal show={show} onHide={handleClose} style={{ width: '100%' }}>
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

            </div>

            <br />
            <div className='pregunta'>
              <div className='pregunta-respuesta'>
                <label htmlFor="pregunta_1">Pregunta 5</label>
                <br />
                <input className="pregunta_field" type="text" name="pregunta_5" value={quiz.pregunta_5} readOnly />

                <br />
                <input className="respuesta_field" type="text" name="respuesta_5_1" placeholder="Respuesta 1" value={quiz.respuesta_5_1} readOnly />

                <br />
                <input className="respuesta_field" type="text" name="respuesta_5_2" placeholder="Respuesta 2" value={quiz.respuesta_5_2} readOnly />

                <br />
                <input className="respuesta_field" type="text" name="respuesta_5_3" placeholder="Respuesta 3" value={quiz.respuesta_5_3} readOnly />
                <br />
                <input className="respuesta_field" type="text" name="respuesta_5_4" placeholder="Respuesta 4" value={quiz.respuesta_5_4} readOnly />

              </div>

            </div>
            <br />
            <div className='pregunta'>
              <div className='pregunta-respuesta'>
                <label htmlFor="pregunta-_">Pregunta 6</label>
                <br />
                <input className="pregunta_field" type="text" name="pregunta_6" value={quiz.pregunta_6} readOnly />

                <br />
                <input className="respuesta_field" type="text" name="respuesta_6_1" placeholder="Respuesta 1" value={quiz.respuesta_6_1} readOnly />

                <br />
                <input className="respuesta_field" type="text" name="respuesta_6_2" placeholder="Respuesta 2" value={quiz.respuesta_6_2} readOnly />

                <br />
                <input className="respuesta_field" type="text" name="respuesta_6_3" placeholder="Respuesta 3" value={quiz.respuesta_6_3} readOnly />
                <br />
                <input className="respuesta_field" type="text" name="respuesta_6_4" placeholder="Respuesta 4" value={quiz.respuesta_6_4} readOnly />

              </div>

            </div>
            <br />
            <div className='pregunta'>
              <div className='pregunta-respuesta'>
                <label htmlFor="pregunta_7">Pregunta 7</label>
                <br />
                <input className="pregunta_field" type="text" name="pregunta_7" value={quiz.pregunta_7} readOnly />

                <br />
                <input className="respuesta_field" type="text" name="respuesta_7_1" placeholder="Respuesta 1" value={quiz.respuesta_7_1} readOnly />

                <br />
                <input className="respuesta_field" type="text" name="respuesta_7_2" placeholder="Respuesta 2" value={quiz.respuesta_7_2} readOnly />

                <br />
                <input className="respuesta_field" type="text" name="respuesta_7_3" placeholder="Respuesta 3" value={quiz.respuesta_7_3} readOnly />
                <br />
                <input className="respuesta_field" type="text" name="respuesta_7_4" placeholder="Respuesta 4" value={quiz.respuesta_7_4} readOnly />

              </div>

            </div>
            <br />
            <div className='pregunta'>
              <div className='pregunta-respuesta'>
                <label htmlFor="pregunta_8">Pregunta 8</label>
                <br />
                <input className="pregunta_field" type="text" name="pregunta_8" value={quiz.pregunta_8} readOnly />

                <br />
                <input className="respuesta_field" type="text" name="respuesta_8_1" placeholder="Respuesta 1" value={quiz.respuesta_8_1} readOnly />

                <br />
                <input className="respuesta_field" type="text" name="respuesta_8_2" placeholder="Respuesta 2" value={quiz.respuesta_8_2} readOnly />

                <br />
                <input className="respuesta_field" type="text" name="respuesta_8_3" placeholder="Respuesta 3" value={quiz.respuesta_8_3} readOnly />
                <br />
                <input className="respuesta_field" type="text" name="respuesta_8_4" placeholder="Respuesta 4" value={quiz.respuesta_8_4} readOnly />

              </div>

            </div>
            <br />
            <div className='pregunta'>
              <div className='pregunta-respuesta'>
                <label htmlFor="pregunta-9">Pregunta 9</label>
                <br />
                <input className="pregunta_field" type="text" name="pregunta_9" value={quiz.pregunta_9} readOnly />

                <br />
                <input className="respuesta_field" type="text" name="respuesta_9_1" placeholder="Respuesta 1" value={quiz.respuesta_9_1} readOnly />

                <br />
                <input className="respuesta_field" type="text" name="respuesta_9_2" placeholder="Respuesta 2" value={quiz.respuesta_9_2} readOnly />

                <br />
                <input className="respuesta_field" type="text" name="respuesta_9_3" placeholder="Respuesta 3" value={quiz.respuesta_9_3} readOnly />
                <br />
                <input className="respuesta_field" type="text" name="respuesta_9_4" placeholder="Respuesta 4" value={quiz.respuesta_9_4} readOnly />

              </div>

            </div>
            <br />
            <div className='pregunta'>
              <div className='pregunta-respuesta'>
                <label htmlFor="pregunta_10">Pregunta 10</label>
                <br />
                <input className="pregunta_field" type="text" name="pregunta_10" value={quiz.pregunta_10} readOnly />

                <br />
                <input className="respuesta_field" type="text" name="respuesta_10_1" placeholder="Respuesta 1" value={quiz.respuesta_10_1} readOnly />

                <br />
                <input className="respuesta_field" type="text" name="respuesta_10_2" placeholder="Respuesta 2" value={quiz.respuesta_10_2} readOnly />

                <br />
                <input className="respuesta_field" type="text" name="respuesta_10_3" placeholder="Respuesta 3" value={quiz.respuesta_10_3} readOnly />
                <br/>
                <input className="respuesta_field" type="text" name="respuesta_1043" placeholder="Respuesta43" value={quiz.respuesta_10_4} readOnly />

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