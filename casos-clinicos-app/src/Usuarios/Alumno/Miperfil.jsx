import React, { useState, useEffect } from "react";
import styled from "styled-components";
import scrollreveal from "scrollreveal";
import { getFirestore, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { Card } from "react-bootstrap";
import "./Miperfil.css";
import EditarPerfilAModal from "./EditarPerfilAModal";

const db = getFirestore();

export default function Miperfil({ user }) {
  //Hooks para poder obtener los datos del alumno

  console.log("usuario dntro de mi perfil: ", user.uid);
  //const user = auth.currentUser;
  const [alumno, setAlumno] = useState(null);

  useEffect(() => {
    const docRef = doc(db, `Alumno/${user.uid}`);
    const unsubscribe = onSnapshot(docRef, (doc) => {
      console.log("Current data: ", doc.data());
      const alumnoData = doc.data();
      setAlumno(alumnoData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

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
    };
  }, []);

  async function ActualizarInformacion(
    nombre,
    apellidoPaterno,
    apellidoMaterno,
    edad,
    matricula,
    nrc,
    selectSexo,
    email,
    password
  ) {
    const docuRef = doc(db, "Alumno", user.uid);

    await updateDoc(docuRef, {
      Nombre: nombre,
      ApellidoPaterno: apellidoPaterno,
      ApellidoMaterno: apellidoMaterno,
      Edad: edad,
      Matricula: matricula,
      NRC: nrc,
      Sexo: selectSexo,
      Correo: email,
      Password: password,
    });
  }

  const [estadoModalE, cambiarEstadoModalE] = useState(false);
  return (
    <Section>
      <h1 className="h1">Mi perfil</h1>
      <div class="row justify-content-around">
        <div class="col-5 shadow bg-white p-2">
          {alumno ? (
            <div className=" shadow bg-white px-4">
              <Card border="primary" style={{ width: "24rem" }}>
                <Card.Body>
                  <Card.Title>
                    <h4 claseName="h4">Datos personales</h4>
                  </Card.Title>
                  <Card.Subtitle className="mb-1 text-muted">
                    Alumno
                  </Card.Subtitle>
                  <Card.Text style={{ textAlign: "left", fontSize: "20px" }}>
                    <b>Nombre:</b> {alumno.Nombre}
                  </Card.Text>
                  <Card.Text style={{ textAlign: "left", fontSize: "20px" }}>
                    <b>Apellidos:</b> {alumno.ApellidoPaterno}{" "}
                    {alumno.ApellidoMaterno}
                  </Card.Text>
                  <Card.Text style={{ textAlign: "left", fontSize: "20px" }}>
                    <b>Edad:</b> {alumno.Edad}
                  </Card.Text>
                  <Card.Text style={{ textAlign: "left", fontSize: "20px" }}>
                    <b>Matrícula:</b> {alumno.Matricula}
                  </Card.Text>
                  <Card.Text style={{ textAlign: "left", fontSize: "20px" }}>
                    <b>NRC Inscrito:</b> {alumno.NRC}
                  </Card.Text>
                  <Card.Text style={{ textAlign: "left", fontSize: "20px" }}>
                    <b>Sexo:</b> {alumno.Sexo}
                  </Card.Text>
                  <Card.Text style={{ textAlign: "left", fontSize: "20px" }}>
                    <b>Correo electrónico:</b> {alumno.correo}
                  </Card.Text>
                </Card.Body>
                <Card.Footer>
                  <EditarPerfilAModal alumno={alumno} id={user.uid} />
                </Card.Footer>
              </Card>
            </div>
          ) : null}
        </div>
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
