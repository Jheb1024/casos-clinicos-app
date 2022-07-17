import React, { useEffect, useState } from 'react'
import { collection, query, where, getFirestore, onSnapshot } from "firebase/firestore";
import firebaseApp from '../../../Firebase/firebase-config';
import { ListGroup, Button, Container, Col, Row, Form } from 'react-bootstrap'
import EditarCuestionarioModalDocente from '../../../Componentes/Cuestionario/EditarCuestionarioModalDocente';
import Swal from 'sweetalert2';
import { borrarCuestionarioDocente } from '../../../Modelo/AdministrarCuestionarios/administrarCuestionarios';
import AsignarCuestionarioModal from '../../../Componentes/Cuestionario/AsignarCuestionarioModal';
import styled from "styled-components";
import { Link } from 'react-router-dom';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import './MisCuestionarios.css'
function MisCuestionarios({ user }) {
  
  const db = getFirestore(firebaseApp);
  const [cuestionarios, setCuestionarios] = useState(null);
  const [cuestionario, setCuestionario] = useState(null);
  const [NrcAsignado, setNrcAsignado] = useState([0]);
  function obtenerNRC(cuestionario) {
    
    if (cuestionario === null || cuestionario.idCuestionario==null) {
      console.log("Sin datos del cuestionario");
    } else {
      console.log("Cuestionario en obtenerNRC:::", cuestionario.idCuestionario);
      const cuestionarioRef = collection(db, "Cuestionarios");
      const q = query(cuestionarioRef, where("idCuestionario", "==", cuestionario.idCuestionario));
      onSnapshot(q, (querySnapshot) => {
        const cities = [];
        querySnapshot.forEach((doc) => {
          cities.push(doc.data().nrcClase);
          setNrcAsignado(cities.join());
        });
        console.log("NRC`s de las clases a las que ya se les asigno el cuestionario: ", cities.join());
      });
    }

  }
  function obtenerCuestionario(cuestionario) {
    

    obtenerNRC(cuestionario);
    setCuestionario(cuestionario);
    //console.log('this is what it has', cuestionario.refImage)
    
    if (JSON.stringify(cuestionario.refImage) === 'none'|| cuestionario.refImage ===null ) {
      const img = document.getElementById('myimg');
      img.style.display = 'none';
    } else {
      if(JSON.stringify(cuestionario.refImage) !== 'none'){
        
      const storage = getStorage();
      getDownloadURL(ref(storage, cuestionario.refImage))
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
          img.style.display = 'contents';
        })
        .catch((error) => {
          console.log('Hubo un error al cargar la imagen', error)
        });
        
      }
      

    }


  }
  async function obtenerCuestionariosDocente(docente) {
    console.log("entramos a la función")
    const q = query(collection(db, "Cuestionarios"), where("AutorId", "==", docente.uid));
    onSnapshot(q, (querySnapshot) => {
      if (querySnapshot.size > 0) {
        console.log(querySnapshot.docs.map((doc) => doc.data()))
        setCuestionarios(querySnapshot.docs.map((doc) => doc.data()))
      }
    })

  }

  function borrarCuestionario(id) {
    new Swal({
      title: 'Cuestionarios',
      text: '¿Está seguro de eliminar este cuestionario? Esta acción no puede deshacerse.',
      icon: 'question',
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: `No`,
    })
      .then((respuesta) => {
        if (respuesta.isConfirmed) {
          borrarCuestionarioDocente(id)
        } else {
          new Swal({
            position: 'center',
            icon: 'info',
            title: 'El cuestionario no fue eliminado',
            showConfirmButton: false,
            timer: 3000
        });
        }
      });
  }
  useEffect(
    () => obtenerCuestionariosDocente(user)
    , [])






  return (
    <Section >
      <div>
        MisCuestionarios
        <div className='newCuestionario'>
        <Link to="/usuario/docente/agregarcuestionario-docente" className="btn btn-success">Agregar Cuestionario</Link>

        </div>

        <Container >
          <Row>
            <Col xs={3}>
              <ListGroup defaultActiveKey="#link1" >
                {cuestionarios?.map((cuestionario) => (
                  <ListGroup.Item action onClick={() => obtenerCuestionario(cuestionario)} >
                    {cuestionario.Titulo}
                  </ListGroup.Item>
                ))
                }
              </ListGroup>
            </Col>
            <Col style={{background:'white', height:'100%'}} className='shadow' >
              {cuestionario &&

                <Form style={{ width: '100%', height: '700px', overflowY: 'auto' }} className="cuestionarioForm">
                  {/*Pregunta 1*/}
                  <p><strong>NRC asignados:</strong>{NrcAsignado}</p>


                  <div className="btn-group">
                    <AsignarCuestionarioModal quiz={cuestionario} />
                    {<EditarCuestionarioModalDocente data={cuestionario} />}
                    <Button className='btn_borrar' onClick={() => borrarCuestionario(cuestionario.idCuestionario)}>Borrar</Button>
                  </div>
                  <div><h3>{cuestionario.Titulo}</h3></div>
                  <div><textarea value={cuestionario.Enunciado} rows='4' cols='80' readOnly /></div>
                  {<img id='myimg' alt=''></img>}
                  <div className='pregunta' style={{ textAlign: 'center', width: '500px', height: '130px' }}>
                    <div className='pregunta-respuesta' style={{ float: 'left', width: '300px' }}>
                      <label htmlFor="pregunta_1">Pregunta 1</label>
                      <br />
                      <input className="pregunta_field" type="text" name="pregunta_1" value={cuestionario.pregunta_1} readOnly />

                      <br />
                      <input className="respuesta_field" type="text" name="respuesta_1" placeholder="Respuesta 1" value={cuestionario.respuesta_1} readOnly />

                      <br />
                      <input className="respuesta_field" type="text" name="respuesta_2" placeholder="Respuesta 2" value={cuestionario.respuesta_2} readOnly />

                      <br />
                      <input className="respuesta_field" type="text" name="respuesta_3" placeholder="Respuesta 3" value={cuestionario.respuesta_3} readOnly />
                      <br />
                      <input className="respuesta_field" type="text" name="respuesta_4" placeholder="Respuesta 4" value={cuestionario.respuesta_4} readOnly />
                    </div>
                    <br />

                  </div>
                  <br />
                  <div className='pregunta'>
                    <div className='pregunta-respuesta'>
                      <label htmlFor="pregunta_2">Pregunta 2</label>
                      <br />
                      <input className="pregunta_field" type="text" name="pregunta_2" value={cuestionario.pregunta_2} readOnly />

                      <br />
                      <input className="respuesta_field" type="text" name="respuesta_2_1" placeholder="Respuesta 1" value={cuestionario.respuesta_2_1} readOnly />

                      <br />
                      <input className="respuesta_field" type="text" name="respuesta_2_2" placeholder="Respuesta 2" value={cuestionario.respuesta_2_2} readOnly />

                      <br />
                      <input className="respuesta_field" type="text" name="respuesta_2_3" placeholder="Respuesta 3" value={cuestionario.respuesta_2_3} readOnly />
                      <br />
                      <input className="respuesta_field" ty4e="text" name="respuesta_2_4" placeholder="Respuesta 4" value={cuestionario.respuesta_2_4} readOnly />
                      
                      <br />
                    </div>

                  </div>
                  <div className='pregunta'>
                    <div className='pregunta-respuesta'>
                      <label htmlFor="pregunta_3">Pregunta 3</label>
                      <br />
                      <input className="pregunta_field" type="text" name="pregunta_3" value={cuestionario.pregunta_3} readOnly />

                      <br />
                      <input className="respuesta_field" type="text" name="respuesta_3_1" placeholder="Respuesta 1" value={cuestionario.respuesta_3_1} readOnly />

                      <br />
                      <input className="respuesta_field" type="text" name="respuesta_3_2" placeholder="Respuesta 2" value={cuestionario.respuesta_3_2} readOnly />

                      <br />
                      <input className="respuesta_field" type="text" name="respuesta_3_3" placeholder="Respuesta 3" value={cuestionario.respuesta_3_3} readOnly />
                      <br />
                      <input className="respuesta_field" type="text" name="respuesta_3_4" placeholder="Respuesta 4" value={cuestionario.respuesta_3_4} readOnly />

                    </div>

                  </div>
                  <br />
                  <div className='pregunta'>
                    <div className='pregunta-respuesta'>
                      <label htmlFor="pregunta-4">Pregunta 4</label>
                      <br />
                      <input className="pregunta_field" type="text" name="pregunta_4" value={cuestionario.pregunta_4} readOnly />

                      <br />
                      <input className="respuesta_field" type="text" name="respuesta_4_1" placeholder="Respuesta 1" value={cuestionario.respuesta_4_1} readOnly />

                      <br />
                      <input className="respuesta_field" type="text" name="respuesta_4_2" placeholder="Respuesta 2" value={cuestionario.respuesta_4_2} readOnly />

                      <br />
                      <input className="respuesta_field" type="text" name="respuesta_4_3" placeholder="Respuesta 3" value={cuestionario.respuesta_4_3} readOnly />
                      <br />
                      <input className="respuesta_field" type="text" name="respuesta_4_4" placeholder="Respuesta 4" value={cuestionario.respuesta_4_4} readOnly />

                    </div>

                  </div>

                  <br />
                  <div className='pregunta'>
                    <div className='pregunta-respuesta'>
                      <label htmlFor="pregunta_1">Pregunta 5</label>
                      <br />
                      <input className="pregunta_field" type="text" name="pregunta_5" value={cuestionario.pregunta_5} readOnly />

                      <br />
                      <input className="respuesta_field" type="text" name="respuesta_5_1" placeholder="Respuesta 1" value={cuestionario.respuesta_5_1} readOnly />

                      <br />
                      <input className="respuesta_field" type="text" name="respuesta_5_2" placeholder="Respuesta 2" value={cuestionario.respuesta_5_2} readOnly />

                      <br />
                      <input className="respuesta_field" type="text" name="respuesta_5_3" placeholder="Respuesta 3" value={cuestionario.respuesta_5_3} readOnly />
                      <br />
                      <input className="respuesta_field" ty4e="text" name="respuesta_5_4" placeholder="Respuesta 4" value={cuestionario.respuesta_5_4} readOnly />
                      

                    </div>

                  </div>
                  <br />
                  <div className='pregunta'>
                    <div className='pregunta-respuesta'>
                      <label htmlFor="pregunta-_">Pregunta 6</label>
                      <br />
                      <input className="pregunta_field" type="text" name="pregunta_6" value={cuestionario.pregunta_6} readOnly />

                      <br />
                      <input className="respuesta_field" type="text" name="respuesta_6_1" placeholder="Respuesta 1" value={cuestionario.respuesta_6_1} readOnly />

                      <br />
                      <input className="respuesta_field" type="text" name="respuesta_6_2" placeholder="Respuesta 2" value={cuestionario.respuesta_6_2} readOnly />

                      <br />
                      <input className="respuesta_field" type="text" name="respuesta_6_3" placeholder="Respuesta 3" value={cuestionario.respuesta_6_3} readOnly />
                      <br />
                      <input className="respuesta_field" type="text" name="respuesta_6_4" placeholder="Respuesta 4" value={cuestionario.respuesta_6_4} readOnly />

                    </div>

                  </div>
                  <br />
                  <div className='pregunta'>
                    <div className='pregunta-respuesta'>
                      <label htmlFor="pregunta_7">Pregunta 7</label>
                      <br />
                      <input className="pregunta_field" type="text" name="pregunta_7" value={cuestionario.pregunta_7} readOnly />

                      <br />
                      <input className="respuesta_field" type="text" name="respuesta_7_1" placeholder="Respuesta 1" value={cuestionario.respuesta_7_1} readOnly />

                      <br />
                      <input className="respuesta_field" type="text" name="respuesta_7_2" placeholder="Respuesta 2" value={cuestionario.respuesta_7_2} readOnly />

                      <br />
                      <input className="respuesta_field" type="text" name="respuesta_7_3" placeholder="Respuesta 3" value={cuestionario.respuesta_7_3} readOnly />
                      <br />
                      <input className="respuesta_field" type="text" name="respuesta_7_4" placeholder="Respuesta 4" value={cuestionario.respuesta_7_4} readOnly />

                    </div>

                  </div>
                  <br />
                  <div className='pregunta'>
                    <div className='pregunta-respuesta'>
                      <label htmlFor="pregunta_8">Pregunta 8</label>
                      <br />
                      <input className="pregunta_field" type="text" name="pregunta_8" value={cuestionario.pregunta_8} readOnly />

                      <br />
                      <input className="respuesta_field" type="text" name="respuesta_8_1" placeholder="Respuesta 1" value={cuestionario.respuesta_8_1} readOnly />

                      <br />
                      <input className="respuesta_field" type="text" name="respuesta_8_2" placeholder="Respuesta 2" value={cuestionario.respuesta_8_2} readOnly />

                      <br />
                      <input className="respuesta_field" type="text" name="respuesta_8_3" placeholder="Respuesta 3" value={cuestionario.respuesta_8_3} readOnly />
                      <br />
                      <input className="respuesta_field" type="text" name="respuesta_8_4" placeholder="Respuesta 4" value={cuestionario.respuesta_8_4} readOnly />

                    </div>

                  </div>
                  <br />
                  <div className='pregunta'>
                    <div className='pregunta-respuesta'>
                      <label htmlFor="pregunta-9">Pregunta 9</label>
                      <br />
                      <input className="pregunta_field" type="text" name="pregunta_9" value={cuestionario.pregunta_9} readOnly />

                      <br />
                      <input className="respuesta_field" type="text" name="respuesta_9_1" placeholder="Respuesta 1" value={cuestionario.respuesta_9_1} readOnly />

                      <br />
                      <input className="respuesta_field" type="text" name="respuesta_9_2" placeholder="Respuesta 2" value={cuestionario.respuesta_9_2} readOnly />

                      <br />
                      <input className="respuesta_field" type="text" name="respuesta_9_3" placeholder="Respuesta 3" value={cuestionario.respuesta_9_3} readOnly />
                      <br />
                      <input className="respuesta_field" type="text" name="respuesta_9_4" placeholder="Respuesta 4" value={cuestionario.respuesta_9_4} readOnly />

                    </div>

                  </div>
                  <br />
                  <div className='pregunta'>
                    <div className='pregunta-respuesta'>
                      <label htmlFor="pregunta_10">Pregunta 10</label>
                      <br />
                      <input className="pregunta_field" type="text" name="pregunta_10" value={cuestionario.pregunta_10} readOnly />

                      <br />
                      <input className="respuesta_field" type="text" name="respuesta_10_1" placeholder="Respuesta 1" value={cuestionario.respuesta_10_1} readOnly />

                      <br />
                      <input className="respuesta_field" type="text" name="respuesta_10_2" placeholder="Respuesta 2" value={cuestionario.respuesta_10_2} readOnly />

                      <br />
                      <input className="respuesta_field" type="text" name="respuesta_10_3" placeholder="Respuesta 3" value={cuestionario.respuesta_10_3} readOnly />
                      <br />
                      <input className="respuesta_field" type="text" name="respuesta_10_4" placeholder="Respuesta 4" value={cuestionario.respuesta_10_4} readOnly />
                    </div>

                  </div>


                  <br />
                </Form>

              }
            </Col>
          </Row>
        </Container>

      </div>

    </Section>

  )
}

export default MisCuestionarios

const Section = styled.section`
  margin-left: 18vw;
  padding: 2rem;
  height: 100%;
  .grid {
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 1rem;
    margin-top: 2rem;
    .row__one {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      height: 50%;
      gap: 1rem;
    }
    .row__two {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      height: 50%;
    }
  }
  @media screen and (min-width: 280px) and (max-width: 1080px) {
    margin-left: 0;
    .grid {
      .row__one,
      .row__two {
        grid-template-columns: 1fr;
      }
    }
  }
`;