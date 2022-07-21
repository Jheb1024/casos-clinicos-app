//Aqui el docente podra ver su informacion personal
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import scrollreveal from "scrollreveal";
import { Card } from "react-bootstrap";
import app from '../../Firebase/firebase-config';
import { getFirestore, onSnapshot, doc, query, collection, where } from "firebase/firestore";
import EditarPerfil from "./EditarPerfilDocente";
import AgregarClaseModal from "../../Componentes/Clase/AgregarClaseModal";
import { RiDeleteBin6Line } from "react-icons/ri";
import { borrarClaseAd} from "../../Modelo/AdministrarClase/administrarClase";
import Swal from "sweetalert2";
import EditarClaseModal from "../../Componentes/Clase/EditarClaseModal";
export default function MiperfilD({ user }) {
  const [docente, setDocente] = useState(null);
  const [clases, setClases] = useState([]);
  console.log(user);
  const db = getFirestore(app);
  function borrarClase(id){
    console.log("id dentro de la funcion borrarClase()",id)
    new Swal({
      title: "Está seguro?",
      text: "Podrá volver a registrar esta clase después.",
      icon: "question",
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: `No`,
    })
    .then((respuesta) => {
      if (respuesta.isConfirmed) {
        borrarClaseAd(id).then(()=>Swal("La clase se ha eliminado!", {
          icon: "success",
        }))
        
      } else {
       new Swal("La clase no se borró!");
      }
    });
    
  }
  useEffect(() => {
    const docRef = doc(db, `Docente/${user.uid}`);
    const unsubscribe = onSnapshot(docRef, (doc) => {
      console.log("Current data: ", doc.data());
      setDocente(doc.data());
    });

    const q = query(collection(db, "Clase"), where("idDocente", "==", user.uid));
    onSnapshot(q, (querySnapshot) => {
      const clases = [];
      const clasesCom = [];
      var i = 0;
      querySnapshot.forEach((doc) => {
        clases.push('Clase ' + i + '=> ' + doc.data().NombreClase + ',' + doc.data().NRC + '\n');
        i = i + 1;
        clasesCom.push(doc.data());
      });
      console.log("Current cities in CA: ", clases.join(","));
      setClases(clasesCom);
    });
    

    return () => {
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
    return () => sr.reveal(
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
      <h1 className="h1">Mi perfil</h1>
      <div class="row justify-content-around">
        <div class="col-4 shadow p-2">
          {docente ?
            <Card >
              <Card.Body>
                <Card.Title><h4 claseName="h4"><b>Datos personales</b></h4></Card.Title>
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
                <EditarPerfil Perfil={docente} uid={user.uid} /> {/**AQui podemos llamar al modal */}
              </Card.Body>
            </Card> : null}
        </div>
        <div class="col-4 shadow bg-white p-2">
          <h4 claseName="h4"><b>Clases registradas</b></h4>
          <AgregarClaseModal uid={user.uid} />
          <table className=" WIDTH=50% table table-bordered">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Nombre clase</th>
                <th scope="col">NRC</th>
                <th scope="col">Acción</th>
              </tr>
            </thead>
            <tbody>
              {clases && clases.map((clase, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{clase.NombreClase}</td>
                  <td>{clase.NRC}</td>
                  <td>
                  <div className="btn-group btn-group-sm" role="group">
                    <button className="btn btn-danger m-1" onClick={()=>borrarClase(clase.idClase)}><RiDeleteBin6Line /></button>
                   <EditarClaseModal clase={clase} id={clase.idClase}/>
                  </div>
                </td>
                </tr>
              ))}
            </tbody>
          </table>
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