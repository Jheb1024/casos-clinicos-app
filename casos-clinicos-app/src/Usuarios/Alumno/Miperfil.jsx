import React, { useState, useEffect } from "react";
import styled from "styled-components";
import scrollreveal from "scrollreveal";
import Modal from "../../Componentes/Modal/Modal";

export default function Miperfil() {
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
  const [estadoModalE, cambiarEstadoModalE] = useState(false);
  return (
    <Section>
      <div className="border bg-light px-4">

        <form className="" method="POST" action="">
          <fieldset>
            <br></br>
            <h1>Información personal</h1>

            <div class="form-group">
              <label for="InputMatricula">Matrícula</label>
              <input type="txt" class="form-control" id="InputMatricula" />
            </div>
            <div class="form-group">
              <label for="InputNombre">Nombres</label>
              <input type="txt" class="form-control" id="InputNombre" />
            </div>
            <div class="form-group">
              <label for="InputApellidoP">Apellido paterno</label>
              <input type="txt" class="form-control" id="InputApellidoP" />
            </div>
            <div class="form-group">
              <label for="InputApellidoM">Apellido materno</label>
              <input type="txt" class="form-control" id="InputApellidoM" />
            </div>
            <div class="form-group">
              <label for="InputNRC">NRC</label>
              <input type="txt" class="form-control" id="InputNRC" />
            </div>

          </fieldset>
        </form>
        <br></br>
        <div>
          <ContenedorBotones>
            <Boton onClick={() => cambiarEstadoModalE(!estadoModalE)}>Modal 1</Boton>
          </ContenedorBotones>

          <Modal
            estado={estadoModalE}
            cambiarEstado={cambiarEstadoModalE}
            titulo="Editar datos"
				    mostrarHeader={true}
          >
            <Contenido>
              <h2>Información personal</h2>
              <Boton onClick={() => cambiarEstadoModalE(!estadoModalE)}>Aceptar</Boton>
            </Contenido>
          </Modal>
        </div>

      </div>
    </Section>
  );
}
const ContenedorBotones = styled.div`
	padding: 40px;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 20px;
`;

const Boton = styled.button`
	display: block;
	padding: 10px 30px;
	border-radius: 100px;
	color: #fff;
	border: none;
	background: #1766DC;
	cursor: pointer;
	font-family: 'Roboto', sans-serif;
	font-weight: 500;
	transition: .3s ease all;
	&:hover {
		background: #0066FF;
	}
`;

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
