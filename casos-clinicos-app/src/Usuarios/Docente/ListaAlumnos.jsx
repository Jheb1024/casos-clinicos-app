import React, { useEffect, useState } from "react";
import styled from "styled-components";
import scrollreveal from "scrollreveal";
import AdministradorAlumno from "../../Modelo/AdministrarUsuarios/AdministradorAlumno";
import { BsArrowReturnLeft } from "react-icons/bs";
import { AiTwotoneEdit } from "react-icons/ai";
import Modal from "../../Componentes/Modal/Modal";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiOutlineFileSearch } from "react-icons/ai";
import { GoSearch } from "react-icons/go";
import firebaseApp from "C:/Users/jhan_/Documents/casosc-app/casos-clinicos-app/casos-clinicos-app/src/Firebase/firebase-config.js";
import AgregarAlumnoDocModal from "../../Componentes/Registro/AgregarAlumnoDocModal"
import {collection,getFirestore, query, where, onSnapshot } from "firebase/firestore";
import Swal from "sweetalert2";
import EditarAlumnoModal from "../../Usuarios/Docente/EditarAlumnoModal";
export default function ListaAlumno( {user1} ) {
  //console.log("usuario dntro de mi lista alumnos en opciones DOCENTE: ", user.uid);
  console.log(user1)
  const admiAl = new AdministradorAlumno();
  const db = getFirestore(firebaseApp);
  let i = 0;

  const [alumnos, setAlumnos] = useState([]);
  const [nrc, setNrc] = useState(0);
  const [estadoModalE, cambiarEstadoModalE] = useState(false);


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
            console.log(querySnapshot.docs.map((doc) => doc.data()))
            setAlumnos(querySnapshot.docs.map((doc) => doc.data()))
            console.log("DAtos de alumno en funcion actualizas....");
            console.log(alumnos);
          }
        })
        console.log("Nrc en Clase con el uid del docente logueadoo: ", nrcA.join(", "));
      });

    })

  }
  function borrarAlumno(id){
    console.log("id dentro de la funcion borrarClase()",id)
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
        admiAl.borrarAlumnoAd(id).then(()=>Swal("El alumno se ha eliminado!", {
          icon: "success",
        }))
        
      } else {
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
      actualizarEstadoAlumnos(user1)
    
  }, []);

  return (
    <Section>
      <AgregarAlumnoDocModal />

      <div class="container-fluid">
        <form className="d-flex" onSubmit={busquedaFormHandler}>
          <input className="form-control me-2" type="search" id="busqueda" placeholder="Buscar" />
          
            <button className="btn btn-outline-success" type="submit"><GoSearch /></button>
            
        </form>
        <button
              className="btn btn-secondary"
              onClick={() => {
                const input = document.getElementById("busqueda");
                input.value = "";
                actualizarEstadoAlumnos();
              }}
            >
              Resetear
            </button>
      </div>


      <br></br>
      <div className="table-responsive border bg-light px-4">
        <h1>Lista de Alumnos</h1>
        <table className=" WIDTH=50% table table-bordered">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Nombre</th>
              <th scope="col">ApellidoPaterno</th>
              <th scope="col">ApellidoMaterno</th>
              <th scope="col">TemasCompletos</th>
              <th scope="col">CuestionariosCompletos</th>
              <th scope="col">PromedioGeneral</th>
              <th scope="col">Acción</th>
            </tr>
          </thead>
          <tbody>
            {alumnos && alumnos.map((alumno, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{alumno.Nombre}</td>
                <td>{alumno.ApellidoPaterno}</td>
                <td>{alumno.ApellidoMaterno}</td>
                <td>{alumno.Avance.TemasCompletos}</td>
                <td>{alumno.Avance.CuestionariosCompletos}</td>
                <td>{alumno.Avance.PromedioGeneral}</td>
                <td>
                  <div className="btn-group btn-group-sm" role="group">
                  <button className="btn btn-danger m-1" onClick={()=>borrarAlumno(alumno.id)}><RiDeleteBin6Line /></button>
                  </div>
                  <EditarAlumnoModal alumno={alumno}/>
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