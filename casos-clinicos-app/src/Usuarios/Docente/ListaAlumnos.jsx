import React, { useEffect, useState } from "react";
import styled from "styled-components";
import scrollreveal from "scrollreveal";
import AdministradorAlumno from "../../Modelo/AdministrarUsuarios/AdministradorAlumno";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GoSearch } from "react-icons/go";
import firebaseApp from "../../../src/Firebase/firebase-config.js";
import AgregarAlumnoDocModal from "../../Componentes/Registro/AgregarAlumnoDocModal"
import { collection, getFirestore, query, where, onSnapshot, orderBy } from "firebase/firestore";
import Swal from "sweetalert2";
import EditarAlumnoModal from "../../Usuarios/Docente/EditarAlumnoModal";
import { Button } from "react-bootstrap";
export default function ListaAlumno({ user }) {
  console.log(user)
  const admiAl = new AdministradorAlumno();
  const db = getFirestore(firebaseApp);

  const [alumnos, setAlumnos] = useState([]);
  const [nrc, setNrc] = useState(0);

  async function busquedaFormHandler(e) {
    e.preventDefault();
    const busqueda = e.target.busqueda.value;
    const nvosDocus = await admiAl.filtrarDatos(busqueda);
    setAlumnos(nvosDocus);
  }

  async function actualizarEstadoAlumnos(user) {
    console.log("Id del docente:::", user.uid);
    const q = query(collection(db, "Clase"), where("idDocente", "==", user.uid));
    onSnapshot(q, (querySnapshot) => {
      const nrcA = [];
      querySnapshot.forEach((doc) => {
        nrcA.push(doc.data().NRC);
        setNrc(doc.data().NRC);
        const q1 = query(collection(db, "Alumno"), where("NRC", "==", doc.data().NRC));
        onSnapshot(q1, (querySnapshot) => {
          if (querySnapshot.size > 0) {
            setAlumnos(querySnapshot.docs.map((doc) => doc.data()))
          }
        })
      });

    })

  }
  function borrarAlumno(id) {
    console.log("id dentro de la funcion borrarClase()", id)
    new Swal({
      title: "Está seguro?",
      text: "El alumno se borrara del registro de Alumnos.",
      icon: "question",
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: `No`,
    })
      .then((respuesta) => {
        if (respuesta.isConfirmed) {
          if (admiAl.borrarAlumnoAd(id)) {
            new Swal({
              position: 'center',
              icon: 'success',
              title: 'Eliminación exitosa.',
              showConfirmButton: false,
              timer: 3000
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
      })
    actualizarEstadoAlumnos(user)

  }, []);

  return (
    <Section>
      <AgregarAlumnoDocModal />
      <div className="container-fluid">
        <form className="d-flex" onSubmit={busquedaFormHandler}>
          <input className="form-control me-2" type="search" id="busqueda" placeholder="Buscar por nombre o apellido paterno." />

          <button className="btn btn-outline-success" type="submit"><GoSearch /></button>

        </form>
        <button
          className="btn btn-secondary"
          onClick={() => {
            const input = document.getElementById("busqueda");
            input.value = "";
            actualizarEstadoAlumnos(user);
          }}
        >
          Resetear
        </button>
      </div>
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
            {alumnos && alumnos.map((alumno, index) => (
              <tr key={index}>
                <td>{index}</td>
                <td>{alumno.ApellidoPaterno}</td>
                <td>{alumno.ApellidoMaterno}</td>
                <td>{alumno.Nombre}</td>
                <td>{alumno.Avance.TemasCompletos}</td>
                <td>{alumno.Avance.CuestionariosCompletos}</td>
                <td>{alumno.Avance.PromedioGeneral}</td>
                <td>
                  <div className="btn-group btn-group-sm" role="group">
                    <button className="btn btn-danger m-1" onClick={() => borrarAlumno(alumno.id)}><RiDeleteBin6Line /></button>
                    <EditarAlumnoModal alumno={alumno} id={alumno.id} />
                  </div>

                </td>
              </tr>
            ))}

          </tbody>
        </table>
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