//Aqui el docente podra ver su informacion personal
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import scrollreveal from "scrollreveal";
import { Card } from "react-bootstrap";
import app from '../../Firebase/firebase-config';
import { getFirestore,onSnapshot , doc} from "firebase/firestore";
import EditarPerfil from "./EditarPerfilDocente";


export default function MiperfilD({user }) {
  const [docente, setDocente]=useState(null);
  console.log(user);
const db = getFirestore(app);

useEffect(()=>{
  const docRef = doc(db, `Docente/${user.uid}`);
  const unsubscribe = onSnapshot(docRef, (doc) => {
    console.log("Current data: ", doc.data());
    setDocente(doc.data());
});
return()=>{
  unsubscribe();
}

}, []);
  useEffect(() => {
    const sr = scrollreveal({
      origin: "bottom",
      distance: "80px",
      duration: 2000,
      reset: false,
    });
    return () =>sr.reveal(
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
      <p>aqui van los datos del docente logeado</p>
      <div>
        {docente ? 
        <Card style={{ width: '18rem' }}>
          <Card.Body>
            <Card.Title>Datos personales</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">Docente</Card.Subtitle>
            <Card.Text>
              <b>Nombre: </b>{docente.Nombre}
            </Card.Text>
            <Card.Text>
              <b>Apellidos: </b>{docente.ApellidoPaterno} {docente.ApellidoMaterno}
            </Card.Text>
            <Card.Text>
              <b>Edad: </b>{docente.Edad} {/* creo no debemos pponer la edad */}
            </Card.Text>
            <Card.Text>
              <b>Sexo: </b>{docente.Sexo}
            </Card.Text>
            <Card.Text>
              <b>ID: </b>{docente.Matricula}
            </Card.Text>
            <Card.Text>
              <b>NRC: </b>{docente.NRC}
            </Card.Text>
            <Card.Text>
              <b>Correo: </b>{docente.correo}
            </Card.Text>
            <EditarPerfil Perfil={docente} uid={user.uid}/> {/**AQui podemos llamar al modal */}
          </Card.Body>
        </Card>: null }
      </div>
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