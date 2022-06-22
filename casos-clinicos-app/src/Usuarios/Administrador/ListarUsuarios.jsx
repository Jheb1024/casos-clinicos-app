import React, { useEffect, useState } from "react";
import styled from "styled-components";
import scrollreveal from "scrollreveal";
import AdministradorAlumno from "../../Modelo/AdministrarUsuarios/AdministradorAlumno";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiOutlineFileSearch } from "react-icons/ai";
import { GoSearch } from "react-icons/go";
import RegistroAlumnoModal from "../../Componentes/Registro/RegistroAlumnoModal";
import RegistroDocenteModal from "../../Componentes/Registro/RegistroDocenteModal"
import { BsArrowReturnLeft } from "react-icons/bs";
import { AiTwotoneEdit } from "react-icons/ai";
import Modal from "../../Componentes/Modal/Modal";
import Swal from "sweetalert2";
import moment from 'moment'
import 'moment/locale/es'

export default function ListaUsuarios() {
  const admiAl = new AdministradorAlumno();
  let i = 0;

  const [usuariosEliminar, setUsuariosEliminar] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [estadoModalE, cambiarEstadoModalE] = useState(false);

  function actualizarEstadoUsuarios() {
    admiAl.getAllUsuarios().then((usuarios) => {
      setUsuarios(usuarios);
      console.log("DAtos de usuarioss en funcion actualizas....");
      console.log(usuarios);
    });
  }
  ///Checar---------------------------------
  function actualizarEstadoUsuariosE(usuario) {
    new Swal({
      title: 'Eliminar usuario',
      text: '¿Desea confirmar la eliminación?',
      icon: 'question',
      buttons: ['No', 'Si']
    })
      .then((respuesta) => {
        if (respuesta) {
          admiAl.eliminarUsuario(usuario).then((usuariosEliminar) => {
            setUsuariosEliminar(usuariosEliminar);
            console.log("DAtos de usuarios Eliminado");
            console.log(usuariosEliminar);
          });

          if (admiAl.eliminarUsuario(usuario).res.status === 200) {
            new Swal({
              title: "Eliminación exitoso",
              text: "Usuario eliminado",
              icon: "success",
              timer: 3000
            });
          } else {
            new Swal({
              title: "Eliminación no exitoso",
              text: "Volver a intentarlo!",
              icon: "error",
              timer: 3000
            });
          }


        }
      });
  }

  async function busquedaFormHandler(e) {
    e.preventDefault();
    const busqueda = e.target.busqueda.value;
    const nvosDocus = await admiAl.filtrarDatosU(busqueda);
    setUsuarios(nvosDocus);
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

    actualizarEstadoUsuarios();
  }, []);
  return (
    <Section>
      
      <RegistroAlumnoModal/>
      <RegistroDocenteModal/>
      
      <div class="container-fluid">
        <form className="d-flex" onSubmit={busquedaFormHandler}>
          <input className="form-control me-2" type="search" id="busqueda"
            placeholder="Buscar por nombre, apellido paterno o rol" />
          <button className="btn btn-outline-success" type="submit"><GoSearch /></button>

        </form>
        <button
          className="btn btn-secondary"
          onClick={() => {
            const input = document.getElementById("busqueda");
            input.value = "";
            actualizarEstadoUsuarios();
          }}
        >
          Resetear
        </button>
      </div>
      <br></br>

      <div className="table-responsive border bg-light px-4">
        <h1>Lista de usuarios</h1>
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
            {usuarios && usuarios.map((usuarior, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{usuarior.Nombre}</td>
                <td>{usuarior.ApellidoPaterno}</td>
                <td>{usuarior.ApellidoMaterno}</td>
                <td>{usuarior.rol}</td>
                <td>{moment(usuarior.FechaRegistro).format('MMMM Do YYYY, h:mm:ss a')}</td>
                <td>
                  <div className="btn-group btn-group-sm" role="group">
                    <button className="btn btn-danger m-1" onClick={() => {
                      actualizarEstadoUsuariosE(usuarior);
                      actualizarEstadoUsuarios();
                    }}><RiDeleteBin6Line /></button>
                    <button className="btn btn-info m-1 p-1" onClick={() => cambiarEstadoModalE(!estadoModalE)}><AiOutlineFileSearch /></button>
                  </div>
                </td>
                <Modal
                  estado={estadoModalE}
                  cambiarEstado={cambiarEstadoModalE}
                  titulo="Detalles del usuario"
                  mostrarHeader={true}
                >
                  <Contenido>
                    {usuarior ? <form className="" method="POST" action="">
                      <fieldset>
                        <br></br>
                        <h1>Información del usuario</h1>
                        <div className="form-group">
                          <label htmlfor="InputMatricula">NRC</label>
                          <input type="txt" class="form-control" id="InputMatricula" value={usuarior.Matricula} onChange={(e) => this.setState(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label htmlfor="InputNombre">Correo electrónico</label>
                          <input type="txt" class="form-control" id="InputNombre" value={usuarior.correo} onChange={(e) => this.setState(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label htmlfor="InputApellidoP">Edad</label>
                          <input type="txt" class="form-control" id="InputApellidoP" value={usuarior.Edad} onChange={(e) => this.setState(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label htmlfor="InputApellidoM">Matricula</label>
                          <input type="txt" class="form-control" id="InputApellidoM" value={usuarior.Matricula} onChange={(e) => this.setState(e.target.value)} />
                        </div>
                      </fieldset>

                      <div className="btn-group btn-group-sm" role="group">
                        <button className="btn btn-secondary m-1" onClick={() => cambiarEstadoModalE(!estadoModalE)}> Regresar<BsArrowReturnLeft /></button>
                        <button className="btn btn-success m-1 p-1" >Editar<AiTwotoneEdit /></button>
                      </div>
                    </form> : null}
                  </Contenido>
                </Modal>
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