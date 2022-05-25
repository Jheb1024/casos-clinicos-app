//Aqui el docente podra visualizar su lista de alumnos
//y podra cargar nuevo alumno

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import scrollreveal from "scrollreveal";

import { Link } from "react-router-dom";

import AdministradorAlumno from "../../Modelo/AdministrarUsuarios/AdministradorAlumno";

import { BsArrowReturnLeft } from "react-icons/bs";
import { AiTwotoneEdit } from "react-icons/ai";
import Modal from "../../Componentes/Modal/Modal";


import { RiDeleteBin6Line } from "react-icons/ri";
import { AiOutlineFileSearch } from "react-icons/ai";
import { GoSearch } from "react-icons/go";

export default function ListaAlumno({ user }) {
  console.log("usuario dntro de mi lista alumnos en opciones DOCENTE: ", user.uid);

  const admiAl = new AdministradorAlumno();

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

  function actualizarEstadoAlumnos() {
    admiAl.getNRCDocenteLogeado().then((nrc) => {
      setNrc(nrc);
      console.log("dddddddddddddddddddddddddddddddd");
      console.log(nrc);
    
    const nrcd = "11111";
    admiAl.getAlumnosFiltroNRC(nrc).then((alumnos) => {
      setAlumnos(alumnos);
      console.log("DAtos de alumno en funcion actualizas....");
      console.log(alumnos);
    });
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
    actualizarEstadoAlumnos();
  }, []);

  return (
    <Section>
      <button className="btn btn-outline-primary mb-1 p-sm-1 "> Añadir Alumno</button>

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
                    <button className="btn btn-danger m-1"><RiDeleteBin6Line /></button>
                    <button className="btn btn-info m-1 p-1" onClick={() => cambiarEstadoModalE(!estadoModalE)}><AiOutlineFileSearch /></button>
                    <Modal
                      estado={estadoModalE}
                      cambiarEstado={cambiarEstadoModalE}
                      titulo="Visualizar información alumno"
                      mostrarHeader={true}
                    >
                      <Contenido>
                        <form className="" method="POST" action="">
                          <fieldset>
                            <h1>Información alumno</h1>

                            <div className="form-group">
                              <label htmlfor="InputMatricula">Matrícula</label>
                              <input type="txt" class="form-control" id="InputMatricula" value={alumno.Matricula} onChange={(e) => this.setState(e.target.value)} />
                            </div>
                            <div className="form-group">
                              <label htmlfor="InputNombre">Nombres</label>
                              <input type="txt" class="form-control" id="InputNombre" value={alumno.Nombre} onChange={(e) => this.setState(e.target.value)} />
                            </div>
                            <div className="form-group">
                              <label htmlfor="InputApellidoP">Apellido paterno</label>
                              <input type="txt" class="form-control" id="InputApellidoP" value={alumno.ApellidoPaterno} onChange={(e) => this.setState(e.target.value)} />
                            </div>
                            <div className="form-group">
                              <label htmlfor="InputApellidoM">Apellido materno</label>
                              <input type="txt" class="form-control" id="InputApellidoM" value={alumno.ApellidoMaterno} onChange={(e) => this.setState(e.target.value)} />
                            </div>
                            <div className="form-group">
                              <label htmlfor="InputNRC">NRC</label>
                              <input type="txt" class="form-control" id="InputNRC" value={alumno.NRC} onChange={(e) => this.setState(e.target.value)} />
                            </div>

                          </fieldset>

                          <div className="btn-group btn-group-sm" role="group">
                            <button className="btn btn-secondary m-1" onClick={() => cambiarEstadoModalE(!estadoModalE)}> Regresar<BsArrowReturnLeft /></button>
                            <button className="btn btn-success m-1 p-1" >Editar<AiTwotoneEdit /></button>
                          </div>
                        </form>
                      </Contenido>
                    </Modal>
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