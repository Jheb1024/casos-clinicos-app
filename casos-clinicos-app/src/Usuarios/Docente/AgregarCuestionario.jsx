//Aqui el docente podra agregar nuevo cuestionario
import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import scrollreveal from "scrollreveal";
import { collection, getDocs, getFirestore, onSnapshot, query, where } from "firebase/firestore";
import firebaseApp from "../../Firebase/firebase-config";
import { Accordion, Card, useAccordionButton, ListGroup, Col, Row, AccordionContext } from 'react-bootstrap'
import CuestionarioModal from "../../Componentes/Cuestionario/CuestionarioModal";
import { IoReturnUpBackOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import CuestionarioModalDocente from "../../Componentes/Cuestionario/CuestionarioModalDocente";
export default function AgregarCuestionario({ user }) {

  const [temas, setTemas] = useState(null);
  const [subtemas, setSubtemas] = useState(null);
  const [cuestionarios, setCuestionarios] = useState(null);
  const [temaCompuesto, setTemaCompuesto] = useState(null);

  const db = getFirestore(firebaseApp);
  async function getSubtemas(tema) {
    setSubtemas(null)
    const q = query(collection(db, "Subtemas"), where("Tema", "==", tema));

    const querySnapshot = await getDocs(q);
    if (querySnapshot.size > 0) {
      setSubtemas(querySnapshot.docs.map((doc) => doc.data()))
    }
  }

  async function getCuestionarios(tema, subtema) {
    const temaCompuesto = {
      Tema: tema,
      Subtema: subtema
    }
    setTemaCompuesto(temaCompuesto)

    const q = query(collection(db, "Cuestionarios"), where("Subtema", "==", subtema));

    const querySnapshot = await getDocs(q);
    if ((querySnapshot.size > 0) && tema !== null) {
      console.log(querySnapshot.docs.map((doc) => doc.data()))
      setCuestionarios(querySnapshot.docs.map((doc) => doc.data()))
    } else {
      setCuestionarios(null);
    }
    console.log(temaCompuesto)
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
        style={{ backgroundColor: isCurrentEventKey ? 'pink' : 'lavender' }}
        onClick={decoratedOnClick}
      >
        {children}
      </button>
    );
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
    )
    onSnapshot(collection(db, 'Temas'), (snapshot) => {
      console.log(snapshot.docs.map((doc) => doc.data()))
      setTemas(snapshot.docs.map((doc) => doc.data()))
    })
  }, []);
  return (
    <Section>
      <div className="col-5">
        <Link to="/usuario/docente/mis-cuestionarios" className="btn btn-outline-info"><IoReturnUpBackOutline />Mis cuestionarios</Link>
      </div>
      <Row>
        <h1>Agregar nuevo cuestionario</h1>
        <Col x={8} className="shadow bg-white p-2">
          <h3>Temas</h3>
          <Accordion>
            {temas?.map((tema, index) => (
              <Card>
                <Card.Header>
                  <ContextAwareToggle eventKey={index} tema={tema.Tema}><b>{index + 1}.{tema.Tema}&nbsp;</b>&nbsp;&nbsp; </ContextAwareToggle>
                </Card.Header>
                <Accordion.Collapse eventKey={index}>
                  <ListGroup variant="flush">
                    {subtemas ? subtemas?.map((subtema) => (
                      <ListGroup.Item action onClick={() => getCuestionarios(tema.Tema, subtema.Subtema)}>{subtema.Subtema}</ListGroup.Item>
                    )) : <p>NO hay subtemas</p>}

                  </ListGroup>
                </Accordion.Collapse>
              </Card>
            ))}
          </Accordion>
        </Col>
        <Col xs={4} className="shadow bg-white p-2">
          <h3>Cuestionarios</h3>
          {cuestionarios == null && <p>Sin cuestionarios</p>}
          <CuestionarioModalDocente data={temaCompuesto} user={user} />
          <br></br>
          <ListGroup defaultActiveKey="#link1">
            {cuestionarios?.map((cuestionario) => (

              <>
                <ListGroup.Item>
                  {cuestionario.Titulo}
                </ListGroup.Item>
                <CuestionarioModal quiz={cuestionario} />
              </>
            ))
            }
          </ListGroup>
        </Col>
      </Row>
    </Section >
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