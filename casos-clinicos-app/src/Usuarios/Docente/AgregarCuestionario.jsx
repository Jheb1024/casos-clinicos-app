//Aqui el docente podra agregar nuevo cuestionario
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import scrollreveal from "scrollreveal";
import { collection, getDocs, getFirestore, onSnapshot, query, where } from "firebase/firestore";
import firebaseApp from "../../Firebase/firebase-config";
import { Accordion, Card, useAccordionButton, ListGroup, Col, Container, Row } from 'react-bootstrap'
import CuestionarioModal from "../../Componentes/Cuestionario/CuestionarioModal";
import { IoReturnUpBackOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import CuestionarioModalDocente from "../../Componentes/Cuestionario/CuestionarioModalDocente";
export default function AgregarCuestionario({user}) {

  const [temas, setTemas] = useState(null);
  const [subtemas, setSubtemas] = useState(null);
  const [cuestionarios, setCuestionarios] = useState(null);
  const [temaCompuesto, setTemaCompuesto] = useState(null);
  const [subtema, setSubtema] = useState(null);

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
        style={{ backgroundColor: 'pink' }}
        onClick={decoratedOnClick}
      >
        {children}
      </button>
    );
  }

  async function getCuestionarios(tema,subtema) {
    const temaCompuesto ={
      Tema:tema,
      Subtema:subtema
    }
    setTemaCompuesto(temaCompuesto)
    
    const q = query(collection(db, "Cuestionarios"), where("Subtema", "==", subtema));

    const querySnapshot = await getDocs(q);
    if ((querySnapshot.size > 0) && tema!== null){
      console.log(querySnapshot.docs.map((doc) => doc.data()))
      setCuestionarios(querySnapshot.docs.map((doc) => doc.data()))
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
    return (<Section>
      <Container>
      <Row>
        
        <Col><div class="col-5">
                            <Link to="/usuario/docente/mis-cuestionarios" className="btn btn-info"><IoReturnUpBackOutline />Mis cuestionarios</Link>
        </div>
          
            <p>aqui el admi podra tener todas las opciones para administrar los temas</p>
            Crear Temas
            
            {temas?.map((tema, key) => (
              <div>

                <Accordion>
                  <Card>
                    <Card.Header>
                      <CustomToggle eventKey={key}>{tema.Tema}</CustomToggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey={key }>
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
            
         
        </Col>
        <Col xs={3}>
        
          <ListGroup defaultActiveKey="#link1">
           {cuestionarios?.map((cuestionario)=>( 
           
           <>
            <ListGroup.Item>
              {cuestionario.Titulo}
            </ListGroup.Item>
            <CuestionarioModal quiz={cuestionario}/>
            </>
            ))
      
          
        }
       <CuestionarioModalDocente data={temaCompuesto} user={user}/>
          </ListGroup>
        
        </Col>
      </Row>

    </Container> 
    </Section>
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