//Aquí el admi podra ver la lista de temas junto con la de subtemas y poderlos editar,
//eliminar o agregar nuevo tema o subtema
import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import scrollreveal from "scrollreveal";
import { collection, getDocs, getFirestore, onSnapshot, query, where } from "firebase/firestore";
import firebaseApp from "../../Firebase/firebase-config";
import { Accordion, Card, useAccordionButton, ListGroup, Col, Container, Row, AccordionContext } from 'react-bootstrap'
import CuestionarioModal from "../../Componentes/Cuestionario/CuestionarioModal";
import TemaModal from "../../Componentes/Cuestionario/TemaModal";
import SubtemaModal from "../../Componentes/Cuestionario/SubtemaModal";
import { borrarSubtemaAdmin, borrarTemaAdmin } from "../../Modelo/AdministrarCuestionarios/administrarCuestionarios";
import Swal from "sweetalert2";
import EditarTemaModal from "../../Componentes/Cuestionario/EditarTemaModal";
import EditarSubtemaModal from "../../Componentes/Cuestionario/EditarSubtemaModal";
import { RiDeleteBin6Line } from "react-icons/ri";


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
    }else{
      setSubtemas(null);
    }
  }
  function ContextAwareToggle({ children, eventKey, callback, tema }) {
    const { activeEventKey } = useContext(AccordionContext);

    const decoratedOnClick = useAccordionButton(
      eventKey,
      () => getSubtemas(tema),
    );
    const isCurrentEventKey = activeEventKey === eventKey;
    return (
      <button
        type="button"
        style={{ backgroundColor: isCurrentEventKey ? 'pink' : 'lavender', outline: 'none',border:'0', fontSize:'20px'}}
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
    }else{
      setCuestionarios(null);
    }

    
  }
  function borrarTema(tema, id) {
    new Swal({
      title: "Está seguro?",
      text: "Al eliminar un tema se borrarán todos los subtemas provenientes del tema así como los cuestionarios. Esta acción no podrá deshacerse!",
      icon: "question",
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: `No`,
    })
      .then((respuesta) => {
        if (respuesta.isConfirmed) {
          borrarTemaAdmin(tema, id)

        } else {
          new Swal({
            position: 'center',
            icon: 'info',
            title: 'El tema no se borró',
            showConfirmButton: false,
            timer: 3000
        });
        }
      });

  }

  function borrarSubtema(subtema, id, tema) {
    new Swal({
      title: "Está seguro?",
      text: "Al eliminar un subtema se borrarán todos los cuestionarios pertenecientes al tema!",
      icon: "question",
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: `No`,
    })
      .then((respuesta) => {
        if (respuesta.isConfirmed) {
          borrarSubtemaAdmin(subtema, id, tema)
        } else {
          Swal("El subtema no se borró!");
        }
      });

  }




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
    <Section>
      <Row>
        <h1>Administrar temas y subtemas</h1>
        <Col x={8}>
        <TemaModal />
          <Accordion>
            {temas?.map((tema, index) => (
              <Card>
                <Card.Header style={{ textAlign: 'left' }}>
                  <ContextAwareToggle eventKey={index} tema={tema.Tema} style={{ }}><b>{index + 1}.{tema.Tema}&nbsp;</b>&nbsp;&nbsp; </ContextAwareToggle>
                  <button className="btn btn-danger" style={{ float: 'right' }} onClick={() => borrarTema(tema.Tema, tema.idTema)}><RiDeleteBin6Line /></button>
                  <EditarTemaModal tema={tema.Tema} idTema={tema.idTema} />
                </Card.Header>
                <Accordion.Collapse eventKey={index}>
                  <Card.Body>
                    {subtemas==null && <p><b>Sin subtemas</b></p>}
                    <ListGroup variant="flush">
                      {subtemas?.map((subtema) => (
                        <div>
                          <ListGroup.Item action onClick={() => getCuestionarios(subtema.Subtema)}>{subtema.Subtema} </ListGroup.Item>
                          <div className="btns-actions">
                            <button className="btn btn-danger" style={{ float: 'right' }} onClick={() => borrarSubtema(subtema.Subtema, subtema.idSubtema, subtema.Tema)}><RiDeleteBin6Line /></button></div>
                          <EditarSubtemaModal  subtema={subtema.Subtema} idSubtema={subtema.idSubtema} />
                        </div>
                      ))}
                      <ListGroup.Item ><SubtemaModal tema={tema.Tema} /></ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            ))}
          </Accordion>
        </Col>
        <Col xs={4} className='p-3 mb-2 bg-light text-dark'>
          <h3>Cuestionarios</h3>
        {cuestionarios==null && <p >Sin cuestionarios</p>}
          <ListGroup defaultActiveKey="#link1" >
            {cuestionarios?.map((cuestionario) => (

              <>
                <ListGroup.Item variant='light'>
                  <p style={{fontSize:'18px'}}><b >{cuestionario?.Titulo}</b></p>
                </ListGroup.Item>
                <CuestionarioModal quiz={cuestionario} />
              </>
            ))

            }
          </ListGroup>

        </Col>
      </Row>
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