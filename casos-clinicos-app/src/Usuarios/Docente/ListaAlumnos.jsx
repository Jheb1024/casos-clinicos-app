import React, { useEffect, useState } from "react";
import styled from "styled-components";
import scrollreveal from "scrollreveal";
import AdministradorAlumno from "../../Modelo/AdministrarUsuarios/AdministradorAlumno";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GoSearch } from "react-icons/go";
import { FaListOl } from "react-icons/fa"
import firebaseApp from "../../../src/Firebase/firebase-config.js";
import AgregarAlumnoDocModal from "../../Componentes/Registro/AgregarAlumnoDocModal";
import {
  collection,
  getFirestore,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import Swal from "sweetalert2";
import EditarAlumnoModal from "../../Usuarios/Docente/EditarAlumnoModal";
import Alert from "react-bootstrap/Alert";
export default function ListaAlumno({ user }) {
  //console.log(user)
  const admiAl = new AdministradorAlumno();
  const db = getFirestore(firebaseApp);

  const [alumnos, setAlumnos] = useState(null);
  const [clases, setClases] = useState(0);
  const [show, setShow] = useState(false);

  async function busquedaFormHandler(e) {
    console.log("en busqueda form handler");
    e.preventDefault();
    const busqueda = e.target.busqueda.value;
    const criterio = e.target.criterio.value;
    const nvosDocus = await admiAl.busquedaDocente(
      user.uid,
      criterio,
      busqueda,
      alumnos
    );
    if (nvosDocus.length > 0) {
      console.log("resulll", alumnos);
      setAlumnos(nvosDocus);
      setShow(false);
    } else {
      setAlumnos(null);
      setShow(true);
    }
  }
  async function busquedaFormClase(e) {
    const input = document.getElementById("busqueda");
    input.value = "";
    const selectB = document.getElementById("criterio");
    selectB.value = "1";
    console.log("en busqueda form clase");
    e.preventDefault();
    const clase = e.target.clase.value;
    console.log("clase elegida", clase);
    const nvosDocus = await admiAl.busquedaDocentePorClase(
      clase
    );
    if (nvosDocus.length > 0) {
      console.log("resulll", alumnos);
      setAlumnos(nvosDocus);
      setShow(false);
    } else {
      setAlumnos(null);
      setShow(true);
    }
  }
  async function actualizarEstadoAlumnos(user) {
    let nrc = [];
    let clase = [];
    const collecionRef1 = collection(db, "Clase");
    const collecionRef = collection(db, "Alumno");
    const que = query(collecionRef1, where("idDocente", "==", user.uid));
    onSnapshot(que, async (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        nrc.push(doc.data().NRC);
        clase.push(doc.data());
      });
      setClases(clase);
      console.log("Clases del docente ");
      console.log(clases);
      console.log("nrc en lista alumnos::", nrc);
      for (let i = 0; i < nrc.length; i++) {
        const q1 = query(collecionRef, where("NRC", "==", nrc[i]));
        console.log("nrc i en lista alumnos::", nrc[i]);
        onSnapshot(q1, (querySnapshot1) => {
          if (querySnapshot1.size > 0) {
            console.log("Alumno con NRc de clase ant.");
            console.log(querySnapshot1.docs.map((doc) => doc.data()));
            //  setAlumnos(querySnapshot1.docs.map((doc) => doc.data()));
          }
        });
      }
    });
  }
  function borrarAlumno(id) {
    console.log("id dentro de la funcion borrarClase()", id);
    new Swal({
      title: "Está seguro?",
      text: "El alumno se borrara del registro de Alumnos.",
      icon: "question",
      showDenyButton: true,
      confirmButtonText: "Si",
      denyButtonText: `No`,
    }).then((respuesta) => {
      if (respuesta.isConfirmed) {
        if (admiAl.quitarAlumnoLista(id) == 1) {
          new Swal({
            position: "center",
            icon: "success",
            title: "Eliminación exitosa.",
            showConfirmButton: false,
            timer: 3000,
          });
        }
      } else if (respuesta.isDenied) {
        new Swal("El alumno no se borró!");
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
    actualizarEstadoAlumnos(user);
  }, []);

  return (
    <Section>
      <div className="container-fluid" style={{ width: '500px' }}>
        <form className="d-flex" onSubmit={busquedaFormClase}>
          <label htmlFor="clases">Seleccione la clase:</label>
          <select name="clases" id="clase">
            {clases != 0 &&
              (
                clases.map((clase, index) => (
                  <option value={clase.NRC} >{index + 1}.{clase.NombreClase}</option>
                ))
              )
            }
            {clases == 0 &&
              (<option value="1">Sin clases</option>)
            }
          </select>
          <button className="btn btn-outline-primary me-2" type="submit">
            <FaListOl />
          </button>
        </form>
      </div>
      <div class="shadow-lg p-3 mb-5 bg-white rounded mt-3">
        <div className="container-fluid">
          <form className="d-flex" onSubmit={busquedaFormHandler}>
            <label htmlFor="criterio">Buscar por:</label>
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
              name="busqueda"
              placeholder="Buscar por nombre,apellido paterno o por matrícula"
            />
            <button className="btn btn-outline-success" type="submit">
              <GoSearch />
            </button>
          </form>
        </div>
        <AgregarAlumnoDocModal />
        {alumnos == null && (
          <Alert variant="warning">
            <Alert.Heading>Sin registros!</Alert.Heading>
            <p>
              Buscar en otra clase o agregar un nuevo alumno a su clase.
            </p>
          </Alert>
        )}
        {alumnos != null && (
          <div className="table-responsive border bg-light px-4">
            <h1>Lista de Alumnos</h1>
            <table className=" WIDTH=50% table table-bordered">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">ApellidoPaterno</th>
                  <th scope="col">ApellidoMaterno</th>
                  <th scope="col">Nombre</th>
                  <th scope="col">TemasCompletos</th>
                  <th scope="col">CuestionariosCompletos</th>
                  <th scope="col">PromedioGeneral</th>
                  <th scope="col">Acción</th>
                </tr>
              </thead>
              <tbody>
                {alumnos &&
                  alumnos.map((alumno, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{alumno.ApellidoPaterno}</td>
                      <td>{alumno.ApellidoMaterno}</td>
                      <td>{alumno.Nombre}</td>
                      <td>{alumno.Avance.TemasCompletos}</td>
                      <td>{alumno.Avance.CuestionariosCompletos}</td>
                      <td>{alumno.Avance.PromedioGeneral}</td>
                      <td>
                        <div className="btn-group btn-group-sm" role="group">
                          <button
                            className="btn btn-danger m-1"
                            onClick={() => borrarAlumno(alumno.id)}
                          >
                            <RiDeleteBin6Line />
                          </button>
                          <EditarAlumnoModal alumno={alumno} id={alumno.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
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
