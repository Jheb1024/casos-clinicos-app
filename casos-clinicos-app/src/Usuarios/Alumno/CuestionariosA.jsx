//Aqui el docente podra agregar nuevo cuestionario
import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import scrollreveal from "scrollreveal";
import { collection, getDocs, getFirestore, onSnapshot, query, where, doc } from "firebase/firestore";
import firebaseApp from "../../Firebase/firebase-config";
import { Accordion, Card, useAccordionButton, ListGroup, Col, Container, Row, AccordionContext, Badge } from 'react-bootstrap'
import CuestionarioModalContestar from "../../Componentes/Cuestionario/CuestionarioModalContestar";
import CuestionarioModalContestarAsignado from "../../Componentes/Cuestionario/CuestionarioModalContestarAsignado";
import ProgressBar from 'react-bootstrap/ProgressBar'
export default function AgregarCuestionario({ user }) {

  const [temas, setTemas] = useState(null);
  const [subtemas, setSubtemas] = useState(null);
  const [cuestionarios, setCuestionarios] = useState(null);
  const [cuestionariosA, setCuestionariosA] = useState(null);
  const [temaCompuesto, setTemaCompuesto] = useState(null);
  const [alumno, setAlumno] = useState(null);
  const [avance, setAvanceT] = useState(0);

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
    setSubtemas(null)
    setAvanceT(0);
    console.log("Entro función getSubtemas()");
    console.log("Tema en getSubtemas", tema);
    const q = query(collection(db, "Subtemas"), where("Tema", "==", tema));

    const querySnapshot = await getDocs(q);
    if (querySnapshot.size > 0) {
      setSubtemas(querySnapshot.docs.map((doc) => doc.data()))
    }

    const refR = collection(db, "Resultado");
    const qR = query(refR, where("temaCuestionario", "==", tema), where("idAlumno", "==", user.user.uid));
    const querySnapshotR = await getDocs(qR);
    var counR = 0;
    querySnapshotR.forEach((doc) => {
      console.log("idResultado::", doc.id);
      counR = counR + 1;
    });
    console.log("Numero de cuestionarios resueltos", counR);
    const qA = query(collection(db, "Cuestionarios"), where("Tema", "==", tema), where("nrcClase", "array-contains", alumno.NRC));
    const querySnapshotA = await getDocs(qA);
    var counA = 0;
    querySnapshotA.forEach((doc) => {
      console.log("idCuestionarios asignado::", doc.id);
      counA = counA + 1;
    });
    console.log("Numero de cuestionarios asignados", counA);
    const avance = (counR * 100) / counA;
    setAvanceT(avance);
    console.log("Avance del tema", avance);
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

  async function getCuestionarios(tema, subtema) {
    console.log("Entro a getCuestionarios()");
    const nrc = alumno.NRC;
    console.log("NRC_Alumno=>", nrc);
    const temaCompuesto = {
      Tema: tema,
      Subtema: subtema
    }
    setTemaCompuesto(temaCompuesto)
    //Cuestionarios generales-----------------------------------------------
    const q = query(collection(db, "Cuestionarios"), where("Subtema", "==", subtema));
    const querySnapshot = await getDocs(q);
    if ((querySnapshot.size > 0) && tema !== null) {
      console.log(querySnapshot.docs.map((doc) => doc.data()))
      setCuestionarios(querySnapshot.docs.map((doc) => doc.data()))
    } else {
      setCuestionarios(null);
    }
    //Cuestionarios Asignados----------------------------------------------
    //const qA = query(collection(db, "Cuestionarios"), where("nrcClase", "array-contains", nrc));
    const qA = query(collection(db, "Cuestionarios"), where("Subtema", "==", subtema), where("nrcClase", "array-contains", nrc));
    const querySnapshotA = await getDocs(qA);
    if ((querySnapshotA.size > 0) && tema !== null) {
      console.log(querySnapshotA.docs.map((doc) => doc.data()))
      setCuestionariosA(querySnapshotA.docs.map((doc) => doc.data()))
    } else {
      setCuestionariosA(null);
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
    <Section>
      <Row>
        <Col xs={4}>
          <h3>Temas</h3>
          <Accordion defaultActiveKey="0">
            {temas?.map((tema, index) => (
              <Card>
                <Card.Header>
                  <ContextAwareToggle eventKey={index} tema={tema.Tema}><b>{index + 1}.{tema.Tema}</b></ContextAwareToggle>
                  <Badge bg="primary" pill>
                    {tema.TotalSubtemas}
                  </Badge>
                </Card.Header>
                <Accordion.Collapse eventKey={index}>
                  <Card.Body>
                    <ProgressBar striped variant="success" now={avance} label={`${avance}%`} />
                    <ListGroup variant="flush" as="ol" numbered>
                      { subtemas ? subtemas?.map((subtema) => (
                        <ListGroup.Item as="li"
                          action onClick={() => getCuestionarios(tema.Tema, subtema.Subtema)}>
                          {subtema.Subtema}
                        </ListGroup.Item>
                      )) : <p>No hay subtemas</p>}
                    </ListGroup>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            ))}
          </Accordion>
        </Col>

        <Col xs={4}>
          <h3>Cuestionarios</h3>
          {cuestionarios == null && <p>Sin cuestionarios</p>}
          <ListGroup defaultActiveKey="#link1">
            {cuestionarios?.map((cuestionario) => (
              <>
                <ListGroup.Item>
                  {cuestionario.Titulo}
                </ListGroup.Item>
                <CuestionarioModalContestar quiz={cuestionario} />
              </>
            ))


            }
          </ListGroup>

        </Col>

        <Col xs={4}>
          <h3>Cuestionarios asignados</h3>
          {cuestionariosA == null && <p>Sin cuestionarios asignados.</p>}
          <ListGroup defaultActiveKey="#link1">
            {cuestionariosA?.map((cuestionarioA) => (

              <>
                <ListGroup.Item>
                  {cuestionarioA.Titulo}
                </ListGroup.Item>
                <CuestionarioModalContestarAsignado quiz={cuestionarioA} user={user.user} />

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