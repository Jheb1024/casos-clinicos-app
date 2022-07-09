import React, { useEffect, useState } from "react";
import styled from "styled-components";
import scrollreveal from "scrollreveal";
import AdministradorAlumno from "../../Modelo/AdministrarUsuarios/AdministradorAlumno";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GoSearch } from "react-icons/go";
import RegistroAlumnoModal from "../../Componentes/Registro/RegistroAlumnoModal";
import RegistroDocenteModal from "../../Componentes/Registro/RegistroDocenteModal"
import { BsArrowReturnLeft } from "react-icons/bs";
import EditarUsuarioModal from "./EditarUsuarioModal";
import Swal from "sweetalert2";
import moment from 'moment'
import 'moment/locale/es'
import firebaseApp from "../../../src/Firebase/firebase-config.js";
import { collection, getFirestore, query, where, onSnapshot, orderBy } from "firebase/firestore";

import { Link } from 'react-router-dom';
import { deleteUser } from "firebase/auth";
export default function ListaUsuarios() {
  const db = getFirestore(firebaseApp);
  const admiAl = new AdministradorAlumno();
  const [docentes, setDocentes] = useState([]);
  useEffect(() => {
    const collecionRefD = collection(db, "Docente");
    const queryDocente = query(collecionRefD);
    onSnapshot(queryDocente, (querySnapshot) => {
      if (querySnapshot.size > 0) {
        setDocentes(querySnapshot.docs.map((doc) => doc.data()));
      }
    });
    console.log("Current docentes: ", docentes);

  }, []);


  function actualizarEstadoUsuarios() {
    const collecionRefD = collection(db, "Docente");
    const queryDocente = query(collecionRefD);
    onSnapshot(queryDocente, (querySnapshot) => {
      if (querySnapshot.size > 0) {
        setDocentes(querySnapshot.docs.map((doc) => doc.data()));
      }
    });
  }
  function borrarUsuario(id, rol, user) {
    console.log("id dentro de la funcion borrarClase()", id);
    console.log(user)
    new Swal({
      title: "Está seguro?",
      text: "El usuario se borrara del registro de Alumnos/Docentes.",
      icon: "question",
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: `No`,
    })
      .then((respuesta) => {
        if (respuesta.isConfirmed) {
          if (admiAl.borrarUsuarioAd(id, rol)) {
            deleteUser(user).then(()=>{
              new Swal({
              position: 'center',
              icon: 'success',
              title: 'Eliminación exitosa.',
              showConfirmButton: false,
              timer: 3000
            });
            }).catch((error)=>{
              console.error(error);
            })
            
            //  actualizarEstadoUsuarios();
          }
        } else if (respuesta.isDenied) {
          new Swal("El usuario no se borró!");
        }
      });

  }

  async function busquedaFormHandler(e) {
    e.preventDefault();
    const busqueda = e.target.busqueda.value;
    const nvosDocus = await admiAl.filtrarDatosU(busqueda);
    setDocentes(nvosDocus);
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
        <Link to="/usuario/admin/lista-usuarios" className="btn btn-info" active>Lista de docentes</Link>
        <Link to="/usuario/admin/ListaAlumnos" className="btn btn-outline-info">Lista de alumnos</Link>
        </div>
      </div>
      <div class="col-6 col-md-4">
        <RegistroAlumnoModal />
        <RegistroDocenteModal />
      </div>
    </div>
    <br></br>
    <h1>Lista de docentes</h1>
    <div class="container-fluid">
      <form className="d-flex" onSubmit={busquedaFormHandler}>
        <input className="form-control me-2" type="search" id="busqueda" placeholder="Buscar por nombre o apellido paterno " />
        <button className="btn btn-outline-success" type="submit"><GoSearch /></button>
      </form>
      <button className="btn btn-secondary"
        onClick={() => {
          const input = document.getElementById("busqueda");
          input.value = "";
         actualizarEstadoUsuarios();
        }}>Resetear </button>
    </div>
    <br></br>

    <div className="table-responsive border bg-light px-4">
      <table className=" WIDTH=50% table table-bordered">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Nombre</th>
            <th scope="col">ApellidoPaterno</th>
            <th scope="col">ApellidoMaterno</th>
            <th scope="col">Rol</th>
            <th scope="col">FechaRegistro</th>
            <th scope="col">Acción</th>
          </tr>
        </thead>
        <tbody>
          {docentes && docentes.map((docente, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{docente.Nombre}</td>
              <td>{docente.ApellidoPaterno}</td>
              <td>{docente.ApellidoMaterno}</td>
              <td>{docente.rol}</td>
              <td>{moment(docente.FechaRegistro).format('MMMM Do YYYY, h:mm:ss a')}</td>
              <td>
                <div className="btn-group btn-group-sm" role="group">
                  <button className="btn btn-danger m-1" onClick={() => {
                    borrarUsuario(docente.id, docente.rol, docente);
                    //  actualizarEstadoUsuarios();
                  }}><RiDeleteBin6Line /></button>
                  <EditarUsuarioModal usuario={docente} id={docente.id} />
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