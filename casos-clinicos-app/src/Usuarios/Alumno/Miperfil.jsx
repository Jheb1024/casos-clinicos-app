import React, { useState, useEffect } from "react";
import styled from "styled-components";
import scrollreveal from "scrollreveal";
import Modal from "../../Componentes/Modal/Modal";
import { getFirestore, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Card, FormControl } from "react-bootstrap";
import './Miperfil.css'
import Swal from "sweetalert2";

const db = getFirestore();


export default function Miperfil({ user }) {
  //Hooks para poder obtener los datos del alumno

  console.log("usuario dntro de mi perfil: ", user.uid);
  //const user = auth.currentUser;
  const [alumno, setAlumno] = useState(null);
  const [alumnoEdit, setAlumnoEdit] = useState(null);

  useEffect(() => {

    const docRef = doc(db, `Alumno/${user.uid}`);
    const unsubscribe = onSnapshot(docRef, (doc) => {
      console.log("Current data: ", doc.data());
      const alumnoData = doc.data();
      setAlumno(alumnoData);
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

    return () => {
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


    }
  }, []);

  async function ActualizarInformacion(nombre,
    apellidoPaterno,
    apellidoMaterno,
    edad,
    matricula,
    nrc,
    selectSexo,
    email,
    password) {
    const docuRef = doc(db, "Alumno", user.uid);

    await updateDoc(docuRef, {
      Nombre: nombre,
      ApellidoPaterno: apellidoPaterno,
      ApellidoMaterno: apellidoMaterno,
      Edad: edad,
      Matricula: matricula,
      NRC: nrc,
      Sexo: selectSexo,
      Correo: email,
      Password: password
    });
  }

  const [estadoModalE, cambiarEstadoModalE] = useState(false);
  return (
    <Section>
      {alumno ?
        <div className="border bg-light px-4">

          <Card style={{ width: '18rem', flex: 'left' }}>
            <Card.Body>
              <Card.Title>Información del alumno</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">Datos personales</Card.Subtitle>
              <Card.Text style={{ textAlign: 'left', fontSize: '20px' }}>
                <b>Nombre:</b> {alumno.Nombre}
              </Card.Text>
              <Card.Text style={{ textAlign: 'left', fontSize: '20px' }}>
                <b>Apellidos:</b> {alumno.ApellidoPaterno} {alumno.ApellidoMaterno}
              </Card.Text>
              <Card.Text style={{ textAlign: 'left', fontSize: '20px' }}>
                <b>Edad:</b> {alumno.Edad}
              </Card.Text>
              <Card.Text style={{ textAlign: 'left', fontSize: '20px' }}>
                <b>Matricula:</b> {alumno.Matricula}
              </Card.Text>
              <Card.Text style={{ textAlign: 'left', fontSize: '20px' }}>
                <b>NRC Inscrito:</b> {alumno.NRC}
              </Card.Text>
              <Card.Text style={{ textAlign: 'left', fontSize: '20px' }}>
                <b>Sexo:</b> {alumno.Sexo}
              </Card.Text>
              <Card.Text style={{ textAlign: 'left', fontSize: '20px' }}>
                <b>Correo:</b> {alumno.correo}
              </Card.Text>
            </Card.Body>
          </Card>
          <br></br>
          <div>
            <ContenedorBotones>
              <Boton onClick={() => cambiarEstadoModalE(!estadoModalE)}>Actualizar Datos</Boton>
            </ContenedorBotones>

            <Modal
              estado={estadoModalE}
              cambiarEstado={cambiarEstadoModalE}
              titulo="Editar datos"
              mostrarHeader={true}
              style={{ scrollBehavior: 'smooth' }}>
              <Contenido>
                <h2>Información personal</h2>

                <Formik
                  

                  initialValues={{
                    email: alumno.correo,
                    password: alumno.password,
                    nombre: alumno.Nombre,
                    apellidoPaterno: alumno.ApellidoPaterno,
                    apellidoMaterno: alumno.ApellidoMaterno,
                    edad: alumno.Edad,
                    matricula: alumno.Matricula,
                    nrc: alumno.NRC,
                    SelectSexo: alumno.Sexo,

                  }}
                  validate={values => {
                    const errors = {};
                    if (!values.email) {
                      errors.email = 'Campo requerido';
                    } else if (
                      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                    ) {
                      errors.email = 'Correo invalido';
                    }

                    if (!values.password) {
                      errors.password = 'Campo requerido'
                    } else if (values.password.length < 7) {
                      errors.password = 'La contraseña es muy debil'
                    }

                    if (!values.nombre) {
                      errors.nombre = 'Campo requerido'
                    } else if (!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(values.nombre)) {
                      errors.nombre = "El nombre solo puede tener letras y espacios, pueden llevar acentos."
                    }
                    if (!values.apellidoPaterno) {
                      errors.apellidoPaterno = 'Campo requerido'
                    } else if (!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(values.apellidoPaterno)) {
                      errors.apellidoPaterno = "El Apellido solo puede tener letras y espacios, pueden llevar acentos."
                    } if (!values.apellidoMaterno) {
                      errors.apellidoMaterno = 'Campo requerido'
                    } else if (!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(values.apellidoMaterno)) {
                      errors.apellidoMaterno = "El Apellido solo puede tener letras y espacios, pueden llevar acentos."
                    }
                    if (!values.edad) {
                      errors.edad = 'Campo requerido'
                    } else if (!/^[0-9]{2}$/.test(values.edad)) {
                      errors.edad = "La edad es un campo numérico"
                    }
                    if (!values.matricula) {
                      errors.matricula = 'Campo requerido'
                    } else if (!/^[0-9]{9}$/.test(values.matricula)) {
                      errors.matricula = "La matricula es un campo numérico"
                    } else if (values.matricula.length < 9 || values.matricula.length > 9) {
                      errors.matricula = "La matricula solo puede tener 5 números, sin espacios."
                    }
                    if (!values.nrc) {
                      values.nrc = "Por favor ingrese el NRC."
                    } else if (!/^(?:\+|-)?\d+$/.test(values.nrc)) {
                      errors.nrc = "El NRC de la materia solo puede tener números, sin espacios."
                    } else if (values.nrc.length < 5 || values.nrc.length > 7) {
                      errors.nrc = "El NRC solo puede tener de 5 a 7 números, sin espacios."
                    }


                    return errors;
                  }}
                  onSubmit={async (values, { setSubmitting }) => {



                    new Swal({
                      title: '¿Sus datos son correctos?',
                      text: "Si está seguro pulse Actualizar",
                      icon: 'warning',
                      showCancelButton: true,
                      confirmButtonColor: '#3085d6',
                      cancelButtonColor: '#d33',
                      confirmButtonText: 'Actualizar'
                    }).then((result) => {
                      if (result.isConfirmed) {

                        if (ActualizarInformacion(values.nombre,
                          values.apellidoPaterno,
                          values.apellidoMaterno,
                          values.edad,
                          values.matricula,
                          values.nrc,
                          values.SelectSexo,
                          values.email,
                          values.password
                        )) {
                          new Swal({
                            title: "Registro exitoso",
                            text: "Su información se ha actualizado con éxito",
                            icon: "success",
                            timer: 3000
                          });

                        }



                      }else{
                        cambiarEstadoModalE(!estadoModalE);
                      }
                    })

                    cambiarEstadoModalE(!estadoModalE);
                  }}
                >
                  {({ isSubmitting }) => (
                    <Form style={{ textAlign: 'left', fontSize: '20px', padding: '10px', scrollBehavior: 'smooth' }}>
                      <div className="mb3">
                        <label htmlFor="nombre">Nombre</label>
                        <Field name="nombre" />
                        <ErrorMessage name="nombre" component="div" style={{ color: 'red', fontSize: '15px' }} />
                      </div>


                      <div className="mb3">
                        <label htmlFor="apellidoPaterno">Apellido Paterno</label>
                        <Field name="apellidoPaterno" />
                        <ErrorMessage name="nomapellidoPaternobre" component="div" style={{ color: 'red', fontSize: '15px' }} />
                      </div>

                      <div className="mb3">
                        <label htmlFor="apellidoMaterno">Apellido Materno</label>
                        <Field name="apellidoMaterno" />
                        <ErrorMessage name="apellidoMaterno" component="div" style={{ color: 'red', fontSize: '15px' }} />
                      </div>

                      <div className="mb3">
                        <label htmlFor="edad">Edad</label>
                        <Field name="edad" />
                        <ErrorMessage name="edad" component="div" style={{ color: 'red', fontSize: '15px' }} />
                      </div>

                      <div className="mb3">
                        <label htmlFor="matricula">Matricula</label>
                        <Field name="matricula" />
                        <ErrorMessage name="matricula" component="div" style={{ color: 'red', fontSize: '15px' }} />
                      </div>

                      <div className="mb3">
                        <label htmlFor="nrc">NRC Inscrito</label>
                        <Field name="nrc" />
                        <ErrorMessage name="nrc" component="div" style={{ color: 'red', fontSize: '15px' }} />
                      </div>

                      <div className="mb3">
                        <label htmlFor="selectSexo">Sexo</label>
                        <Field class="form-select" id="selectSexo" name="SelectSexo" as="select">
                          <option value="Elige una opción">Elige una opción</option>
                          <option value="Mujer">Mujer</option>
                          <option value="Hombre">Hombre</option>
                          <option value="Hombre">Otro</option>
                        </Field>
                        <ErrorMessage name="selectSexo" component="div" style={{ color: 'red', fontSize: '15px' }} />
                      </div>
                      <div className="mb3">
                        <label htmlFor="email">Correo</label>
                        <Field type="email" name="email" />
                        <ErrorMessage name="email" component="div" style={{ color: 'red', fontSize: '15px' }} />
                      </div>
                      <div className="mb3">
                        <label htmlFor="password">Contraseña</label>
                        <Field type="password" name="password" />
                        <ErrorMessage name="password" component="div" style={{ color: 'red', fontSize: '15px' }} />
                      </div>

                      <button className="bg blue" type="submit" disabled={isSubmitting}>
                        Actualizar
                      </button>
                    </Form>
                  )}
                </Formik>
                <Boton onClick={() => cambiarEstadoModalE(!estadoModalE)}>Cancelar</Boton>
              </Contenido>
            </Modal>
          </div>

        </div> : null}
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
