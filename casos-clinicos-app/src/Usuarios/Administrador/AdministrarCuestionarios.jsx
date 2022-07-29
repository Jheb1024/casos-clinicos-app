//El admi podra visualizar la lista de temas para visualizar
//los subtemas y así poder agregar,eliminar o modificar el cuestionario
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import scrollreveal from "scrollreveal";
import { Table, Button } from "react-bootstrap";
import {
  collection,
  getFirestore,
  query,
  onSnapshot,
} from "firebase/firestore";
import firebaseApp from "../../Firebase/firebase-config";
import EditarCuestionarioModalDocente from "../../Componentes/Cuestionario/EditarCuestionarioModalDocente";
import Swal from "sweetalert2";
import {
  borrarCuestionarioDocente,
  buscarCuestionario,
} from "../../Modelo/AdministrarCuestionarios/administrarCuestionarios";
import { GoSearch } from "react-icons/go";
import Alert from "react-bootstrap/Alert";
export default function AdministrarCuestionarios() {
  const db = getFirestore(firebaseApp);
  const [cuestionarios, setCuestionarios] = useState(null);
  const [show, setShow] = useState(false);
  function borrarCuestionario(id) {
    new Swal({
      title: 'Cuestionarios',
      text: '¿Está seguro de eliminar este cuestionario? Esta acción no puede deshacerse.',
      icon: 'question',
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: `No`,
    }).then((respuesta) => {
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

  async function getAllQuizzes() {
    const collecionRefD = collection(db, "Cuestionarios");
    const queryDocente = query(collecionRefD);
    onSnapshot(queryDocente, (querySnapshot) => {
      if (querySnapshot.size > 0) {
        setCuestionarios(querySnapshot.docs.map((doc) => doc.data()));
      }else{
        setCuestionarios(null);
      }
    });
  }
  async function busquedaFormHandler(e) {
    e.preventDefault();
    const busqueda = e.target.busqueda.value;
    const criterio = e.target.criterio.value;
    const nvosDocus = await buscarCuestionario(criterio, busqueda);
    console.log("Resultado de busqueda de quiz");
    console.log(nvosDocus.length);
    if (nvosDocus.length > 0) {
      setCuestionarios(nvosDocus);
      setShow(false);
    } else {
      setCuestionarios(null);
      setShow(true);
    }
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
    getAllQuizzes();
  }, []);
  return (
    <Section>
      <h1>Cuestionarios</h1>

      <div className="container-fluid">
        <form className="d-flex" onSubmit={busquedaFormHandler}>
          <label for="criterio">Buscar por:</label>
          <select name="criterio" id="criterio">
            <option value="1" selected>
              Titulo
            </option>
            <option value="2">Tema</option>
            <option value="3">Subtema</option>
            <option value="4">Autor</option>
          </select>
          <input
            className="form-control me-2"
            type="search"
            id="busqueda"
            placeholder="Escriba el valor de la búsqueda."
          />

          <button className="btn btn-outline-success" type="submit">
            <GoSearch />
          </button>
        </form>
        <button
          className="btn btn-secondary"
          onClick={() => {
            const input = document.getElementById("busqueda");
            input.value = "";
            getAllQuizzes();
          }}
        >
          Resetear
        </button>
      </div>
      {cuestionarios == null && (
        <Alert variant="warning">
          <Alert.Heading>Sin cuestionarios!</Alert.Heading>
          <p>
            Intente con otro dato de búsqueda o de "Clic" en <b>Resetear</b>
            para volver a visualizar la lista de cuestionarios actualizada.
          </p>
        </Alert>
      )}
      {cuestionarios != null && (
        <Table striped bordered hover variant='light'>
          <thead>
            <tr>
              <th></th>
              <th>Titulo</th>
              <th>Tema</th>
              <th>Subtema</th>
              <th>Autor</th>
              <th>Acciones</th>
            </tr>
          </thead>
          {cuestionarios &&
            cuestionarios?.map((cuestionario, index) => (
              <tbody>
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{cuestionario.Titulo}</td>
                  <td>{cuestionario.Tema}</td>
                  <td>{cuestionario.Subtema}</td>
                  <td>{cuestionario.Autor}</td>
                  <td>
                    <EditarCuestionarioModalDocente data={cuestionario} />
                    <Button
                      className="btn_borrar"
                      onClick={() =>
                        borrarCuestionario(cuestionario.idCuestionario)
                      }
                    >
                      Borrar
                    </Button>
                  </td>
                </tr>
              </tbody>
            ))}
        </Table>
      )}
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