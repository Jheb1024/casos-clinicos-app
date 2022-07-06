//Aquí el admi podra ver la lista de temas junto con la de subtemas y poderlos editar,
//eliminar o agregar nuevo tema o subtema
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import scrollreveal from "scrollreveal";
import { collection, getDocs, getFirestore, onSnapshot, query, where } from "firebase/firestore";
import firebaseApp from "../../Firebase/firebase-config";
import { Accordion, Card, useAccordionButton, ListGroup, Col, Container, Row } from 'react-bootstrap'
import CuestionarioModal from "../../Componentes/Cuestionario/CuestionarioModal";
import TemaModal from "../../Componentes/Cuestionario/TemaModal";
import SubtemaModal from "../../Componentes/Cuestionario/SubtemaModal";
import { borrarSubtemaAdmin, borrarTemaAdmin } from "../../Modelo/AdministrarCuestionarios/administrarCuestionarios";
import Swal from "sweetalert2";
import EditarTemaModal from "../../Componentes/Cuestionario/EditarTemaModal";
import EditarSubtemaModal from "../../Componentes/Cuestionario/EditarSubtemaModal";



export default function AdministrarTemas() {

  const [temas, setTemas] = useState(null);
  const [subtemas, setSubtemas] = useState(null);
  const [cuestionarios, setCuestionarios] = useState(null);

  const db = getFirestore(firebaseApp);
  useEffect(
    () =>
      onSnapshot(collection(db, 'Temas'), (snapshot) => {
        console.log(snapshot.docs.map((doc) => doc.data()))
        setTemas(snapshot.docs.map((doc) => doc.data()))
      }),

    []);
  async function getSubtemas(tema) {
    const q = query(collection(db, "Subtemas"), where("Tema", "==", tema));

    const querySnapshot = await getDocs(q);
    if (querySnapshot.size > 0) {
      setSubtemas(querySnapshot.docs.map((doc) => doc.data()))
    }
  }

  function CustomToggle({ children, eventKey }) {
    const decoratedOnClick = useAccordionButton(eventKey, () =>
      //console.log(children),
      getSubtemas(children)
    );

    

    return (
      <button
        type="button"
        style={{ backgroundColor: '#2dc889', border:'none', fontSize:'20px', color:'black', paddingRight:'10px', marginRight:'10px'}}
        onClick={decoratedOnClick}
      >
        {children}
      </button>
    );
  }

  async function getCuestionarios(subtema) {
    const q = query(collection(db, "Cuestionarios"), where("Subtema", "==", subtema));

    const querySnapshot = await getDocs(q);
    if (querySnapshot.size > 0) {
      console.log(querySnapshot.docs.map((doc) => doc.data()))
      setCuestionarios(querySnapshot.docs.map((doc) => doc.data()))
    }
  }
  function borrarTema(tema, id){
    new Swal({
      title: "Está seguro?",
      text: "Al eliminar un tema se borrarán todos los subtemas provenientes del tema así como los cuestionarios!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        borrarTemaAdmin(tema,id).then(()=>Swal("El tema y los subtemas y cuesitonarios que eran parte de él han sido borrados!", {
          icon: "success",
        }))
        
      } else {
        Swal("El tema no se borró!");
      }
    });
    
  }

  function borrarSubtema(subtema, id, tema){
    new Swal({
      title: "Está seguro?",
      text: "Al eliminar un subtema se borrarán todos los cuestionarios pertenecientes al tema!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        borrarSubtemaAdmin(subtema, id, tema).then(()=>Swal("El subtema y cuesitonarios que eran parte de él han sido borrados!", {
          icon: "success",
        }))
        
      } else {
        Swal("El subtema no se borró!");
      }
    });
    
  }
var count = 0;



  useEffect(() => {
    const sr = scrollreveal({
      origin: "bottom",
      distance: "80px",
      duration: 2000,
      reset: false,
    });
    return () => {
      sr.reveal(
        `
          nav,
          .row__one,
          .row__two
      `,
        {
          opacity: 0,
          interval: 100,
        }
      );


    }
  }, []);
  return (
    <Container>
      <Row>
        <Col>
          <Section>
            <p>aqui el admi podra tener todas las opciones para administrar los temas</p>
            Crear Temas
            {temas?.map((tema, index) => (
              
              <div>{count = index}

                <Accordion>
                  <Card>
                    <Card.Header style={{textAlign:'left'}}>
                      
                      <CustomToggle eventKey={0} >{tema.Tema}</CustomToggle>
                      <button style={{float:'right'}} onClick={()=>borrarTema(tema.Tema ,tema.idTema)}>Borrar</button>
                      <EditarTemaModal tema={tema.Tema } idTema={tema.idTema} />
                    </Card.Header>
                    <Accordion.Collapse eventKey={0}>
                      <ListGroup variant="flush">
                        {subtemas?.map((subtema, index) => (
                          <div>
                          <ListGroup.Item action onClick={() => getCuestionarios(subtema.Subtema)}>{subtema.Subtema} </ListGroup.Item>
                            <div className="btns-actions">
                              <button style={{float:'right'}} onClick={()=>borrarSubtema(subtema.Subtema, subtema.idSubtema, subtema.Tema)}>Borrar</button></div>
                              <EditarSubtemaModal subtema={subtema.Subtema} idSubtema={subtema.idSubtema}/>
                            </div>
                            
                        ))}
                        <ListGroup.Item><SubtemaModal tema={tema.Tema}/></ListGroup.Item>
                      </ListGroup>
                    </Accordion.Collapse>

                  </Card>
                </Accordion>
              </div>
            ))}
           <TemaModal/>
          </Section>
        </Col>
        <Col xs={3}>
        
          <ListGroup defaultActiveKey="#link1">
           {cuestionarios?.map((cuestionario)=>( 
           
           <>
            <ListGroup.Item>
              {cuestionario?.Titulo}
            </ListGroup.Item>
              <CuestionarioModal quiz={cuestionario}/>
            </>
            ))
          
        }
          </ListGroup>
        
        </Col>
      </Row>
    </Container>

  );
}
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