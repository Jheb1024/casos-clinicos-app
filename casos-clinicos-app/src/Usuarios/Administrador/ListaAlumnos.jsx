import React, { useEffect, useState } from "react";
import styled from "styled-components";
import scrollreveal from "scrollreveal";
import AdministradorAlumno from "../../Modelo/AdministrarUsuarios/AdministradorAlumno";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GoSearch } from "react-icons/go";
import RegistroAlumnoModal from "../../Componentes/Registro/RegistroAlumnoModal";
import RegistroDocenteModal from "../../Componentes/Registro/RegistroDocenteModal";
import EditarAlumnoModal from "./EditarAlumnoModal";
import Swal from "sweetalert2";
import moment from "moment";
import "moment/locale/es";
import firebaseApp from "../../../src/Firebase/firebase-config.js";
import {
  collection,
  getFirestore,
  query,
  onSnapshot,
  orderBy,
} from "firebase/firestore";

import { Link } from "react-router-dom";
import Alert from "react-bootstrap/Alert";

export default function ListaUsuarios() {
  const db = getFirestore(firebaseApp);
  const admiAl = new AdministradorAlumno();
  const [alumnos, setAlumnos] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const collecionRefA = collection(db, "Alumno");
    const queryAlumno = query(
      collecionRefA,
      orderBy("ApellidoPaterno")
    );
    onSnapshot(queryAlumno, (querySnapshot) => {
      if (querySnapshot.size > 0) {
        setAlumnos(querySnapshot.docs.map((doc) => doc.data()));
      }
    });
    console.log("Current alumnos: ", alumnos);
  }, []);

  function actualizarEstadoUsuarios() {
    const collecionRefD = collection(db, "Alumno");
    const queryAlumno = query(
      collecionRefD,
      orderBy("ApellidoPaterno")
    );
    onSnapshot(queryAlumno, (querySnapshot) => {
      if (querySnapshot.size > 0) {
        setAlumnos(querySnapshot.docs.map((doc) => doc.data()));
      }
    });
  }
  function borrarAlumno(id) {
    new Swal({
      title: "Está seguro?",
      text: "El alumno se borrara del registro de Alumnos.",
      icon: "question",
      showDenyButton: true,
      confirmButtonText: "Si",
      denyButtonText: `No`,
    }).then((respuesta) => {
      if (respuesta.isConfirmed) {
        if (admiAl.borrarAlumnoAd(id)) {
          new Swal({
            position: "center",
            icon: "success",
            title: "Eliminación exitosa.",
            showConfirmButton: false,
            timer: 3000,
          });
        }
      } else if (respuesta.isDenied) {
        new Swal("El usuario no se borró!");
      }
    });
  }

  async function busquedaFormHandler(e) {
    e.preventDefault();
    const busqueda = e.target.busqueda.value;
    const criterio = e.target.criterio.value;
    const nvosDocus = await admiAl.busquedaAdministrador(criterio, busqueda);
    if (nvosDocus.length > 0) {
      setAlumnos(nvosDocus);
      setShow(false);
    } else {
      setAlumnos(null);
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
  }, []);
  return (
    <Section>
      <div class="row g-0">
        <div class="col-sm-6 col-md-8">
          <div class="btn-group" role="group" aria-label="Basic example">
            <Link
              to="/usuario/admin/lista-usuarios"
              className="btn btn-outline-info"
            >
              Lista de docentes
            </Link>
            <Link to="/usuario/admin/ListaAlumnos" className="btn btn-info">
              Lista de alumnos
            </Link>
          </div>
        </div>
        <div class="col-6 col-md-4">
          <RegistroAlumnoModal />
          <RegistroDocenteModal />
        </div>
      </div>
      <br></br>
      <h1>Lista de alumnos</h1>
      <div class="container-fluid">
        <form className="d-flex" onSubmit={busquedaFormHandler}>
          <label for="criterio">Buscar por:</label>
          <select name="criterio" id="criterio">
            <option value="1" selected>
              Apellido paterno
            </option>
            <option value="2">Nombre</option>
            <option value="3">Matrícula</option>
          </select>
          <input
            className="form-control me-2"
            type="search"
            id="busqueda"
            placeholder="Escribir nombre, apellido paterno o matrícula."
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
            actualizarEstadoUsuarios();
          }}
        >
          Resetear{" "}
        </button>
      </div>
      <br></br>
      {alumnos == null && (
        <Alert variant="warning">
          <Alert.Heading>Sin registros!</Alert.Heading>
          <p>
            Intente con otro dato de búsqueda o de "Clic" en <b>Resetear</b>
            para volver a visualizar la lista de alumnos actualizada.
          </p>
        </Alert>
      )}

      {alumnos != null && (
        <div className="table-responsive border bg-light px-4">
          <table className=" WIDTH=50% table table-bordered">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Nombre</th>
                <th scope="col">ApellidoPaterno</th>
                <th scope="col">ApellidoMaterno</th>
                <th scope="col">FechaRegistro</th>
                <th scope="col">Acción</th>
              </tr>
            </thead>
            <tbody>
              {alumnos &&
                alumnos.map((alumno, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{alumno.Nombre}</td>
                    <td>{alumno.ApellidoPaterno}</td>
                    <td>{alumno.ApellidoMaterno}</td>
                    <td>
                      {moment(alumno.FechaRegistro).format(
                        "MMMM Do YYYY, h:mm:ss a"
                      )}
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm" role="group">
                        <button
                          className="btn btn-danger m-1"
                          onClick={() => {
                            borrarAlumno(alumno.id);
                          }}
                        >
                          <RiDeleteBin6Line />
                        </button>
                        <EditarAlumnoModal usuario={alumno} id={alumno.id} />
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </Section>
  );
}
const Contenido = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  h1 {
    font-size: 42px;
    font-weight: 700;
    margin-bottom: 10px;
  }
  p {
    font-size: 18px;
    margin-bottom: 20px;
  }
  img {
    width: 100%;
    vertical-align: top;
    border-radius: 3px;
  }
`;
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
