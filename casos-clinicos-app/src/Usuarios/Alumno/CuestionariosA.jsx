//Aqui el docente podra agregar nuevo cuestionario
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import scrollreveal from "scrollreveal";
import { collection, getDocs, getFirestore, onSnapshot, query, where,doc } from "firebase/firestore";
import firebaseApp from "../../Firebase/firebase-config";
import { Accordion, Card, useAccordionButton, ListGroup, Col, Container, Row } from 'react-bootstrap'
import CuestionarioModalContestar from "../../Componentes/Cuestionario/CuestionarioModalContestar";
import CuestionarioModalContestarAsignado from "../../Componentes/Cuestionario/CuestionarioModalContestarAsignado";
export default function AgregarCuestionario({user}) {

  const [temas, setTemas] = useState(null);
  const [subtemas, setSubtemas] = useState(null);
  const [cuestionarios, setCuestionarios] = useState(null);
  const [cuestionariosA, setCuestionariosA] = useState(null);
  const [temaCompuesto, setTemaCompuesto] = useState(null);
  const [subtema, setSubtema] = useState(null);
  const [alumno, setAlumno] = useState(null);


  const db = getFirestore(firebaseApp);


  useEffect(() => {

    const docRef = doc(db, `Alumno/${user.user.uid}`);
    const unsubscribe = onSnapshot(docRef, (doc) => {
      console.log("Current data: ", doc.data());
      const alumnoData = doc.data();
      setAlumno(alumnoData);
    });

    return () => {
      unsubscribe();
    }
  }, []);
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
        style={{ backgroundColor: 'pink' }}
        onClick={decoratedOnClick}
      >
        {children}
      </button>
    );
  }

  async function getCuestionarios(tema,subtema) {
    const nrc=alumno.NRC;
console.log("NRC_Alumno=>",nrc);
    const temaCompuesto ={
      Tema:tema,
      Subtema:subtema
    }
    setTemaCompuesto(temaCompuesto)
    //Cuestionarios generales
   // const q = query(collection(db, "Cuestionarios"), where("Subtema", "==", subtema));
   const q = query(collection(db, "Cuestionarios"),where("nrcClase","not-in",[nrc]));

    const querySnapshot = await getDocs(q);
    if ((querySnapshot.size > 0) && tema!== null){
      console.log(querySnapshot.docs.map((doc) => doc.data()))
      setCuestionarios(querySnapshot.docs.map((doc) => doc.data()))
    }
//Cuestionarios Asignados

const qA = query(collection(db, "Cuestionarios"),where("nrcClase","array-contains",nrc));


    const querySnapshotA = await getDocs(qA);
    if ((querySnapshotA.size > 0) && tema!== null){
      console.log(querySnapshotA.docs.map((doc) => doc.data()))
      setCuestionariosA(querySnapshotA.docs.map((doc) => doc.data()))
    }


    console.log(temaCompuesto)
  }

    useEffect(() => {
      const sr = scrollreveal({
        origin: "bottom",
        distance: "80px",
        duration: 2000,
        reset: false,
      });
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
    }, []);
    return (
      <Container>
      <Row>
        <Col>
          <Section>
            <h3>Temas</h3>
            {temas?.map((tema) => (
              <div>
                <Accordion>
                  <Card>
                    <Card.Header>
                      <CustomToggle eventKey="0">{tema.Tema}</CustomToggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="0">
                      <ListGroup variant="flush">
                        {subtemas?.map((subtema) => (
                          <ListGroup.Item action onClick={() => getCuestionarios(tema.Tema,subtema.Subtema)}>{subtema.Subtema}</ListGroup.Item>
                        ))}
                       
                      </ListGroup>
                    </Accordion.Collapse>

                  </Card>
                </Accordion>
              </div>
            ))}
            
          </Section>
        </Col>
       
        <Col xs={3}>
         <h3>Cuestionarios</h3>
          <ListGroup defaultActiveKey="#link1">
           {cuestionarios?.map((cuestionario)=>( 
           
           <>
            <ListGroup.Item>
              {cuestionario.Titulo}
            </ListGroup.Item>

            <CuestionarioModalContestar quiz={cuestionario}/>
            </>
            ))
      
          
        }
          </ListGroup>
        
        </Col>
        
        <Col xs={3}>
        <h3>Cuestionarios asignados</h3>
          <ListGroup defaultActiveKey="#link1">
           {cuestionariosA?.map((cuestionarioA)=>( 
           
           <>
            <ListGroup.Item>
              {cuestionarioA.Titulo}
            </ListGroup.Item>
            <CuestionarioModalContestarAsignado quiz={cuestionarioA} user={user.user}/>

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
