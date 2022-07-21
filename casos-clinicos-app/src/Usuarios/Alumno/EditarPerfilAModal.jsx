import { Modal, Button } from "react-bootstrap";
import { useState } from "react";
import Swal from "sweetalert2";
import { BiEdit } from "react-icons/bi";
import AdministradorAlumno from "../../Modelo/AdministrarUsuarios/AdministradorAlumno";
import { getFirestore, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { Formik, Form, Field, ErrorMessage } from "formik";

const db = getFirestore();
const EditarPerfilAModal = ({ alumno, id }) => {
  const admiAl = new AdministradorAlumno();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  async function ActualizarInformacion(
    nombre,
    apellidoPaterno,
    apellidoMaterno,
    edad,
    matricula,
    nrc,
    selectSexo,
    email,
    password
  ) {
    const docuRef = doc(db, "Alumno", id);

    await updateDoc(docuRef, {
      Nombre: nombre,
      ApellidoPaterno: apellidoPaterno,
      ApellidoMaterno: apellidoMaterno,
      Edad: edad,
      Matricula: matricula,
      NRC: nrc,
      Sexo: selectSexo,
      Correo: email,
      Password: password,
    });
  }
  function submitHandler(e) {
    e.preventDefault();
    const MatriculaN = e.target.elements.InputMatricula.value;
    const NombreN = e.target.elements.InputNombre.value;
    const ApellidoPN = e.target.elements.InputApellidoP.value;
    const ApellidoMN = e.target.elements.InputApellidoM.value;
    const NRCn = e.target.elements.InputNRC.value;
    const sexoN = e.target.elements.SelectSexo.value;
    const emailN = e.target.elements.email.value;
    const passN = e.target.elements.InputPassword.value;
    const edadN = e.target.elements.InputEdad.value;

    if (
      MatriculaN === "" ||
      NombreN === "" ||
      ApellidoPN === "" ||
      ApellidoMN === "" ||
      NRCn === "" ||
      sexoN === "" ||
      emailN === "" ||
      passN === "" ||
      edadN === ""
    ) {
      new Swal({
        position: "top-end",
        icon: "info",
        title: "Favor de completar los datos!!",
        showConfirmButton: false,
        timer: 3000,
      });
    } else {
      new Swal({
        title: "Actualizar alumno",
        text: "¿Desea confirmar la actualización?",
        icon: "question",
        showDenyButton: true,
        confirmButtonText: "Si",
        denyButtonText: `No`,
      }).then((respuesta) => {
        if (respuesta.isConfirmed) {
          if (
            ActualizarInformacion(
              NombreN,
              ApellidoPN,
              ApellidoMN,
              edadN,
              MatriculaN,
              NRCn,
              sexoN,
              emailN,
              passN
            )
          ) {
            new Swal({
              position: "center",
              icon: "success",
              title: "Actualización de datos exitosa.",
              text: "Los datos del alumno ha sido actualizada correctamente.",
              showConfirmButton: true,
            });
          }
        } else if (respuesta.isDenied) {
          new Swal(
            "Sin cambios guardados.",
            "¡Verificar su información!",
            "info"
          );
        }
        handleClose();
      });
    }
  }
  function mostrarContrasena() {
    var tipo = document.getElementById("InputPassword");
    console.log("tipo", tipo.type);
    if (tipo.type == "password") {
      tipo.type = "text";
    } else {
      tipo.type = "password";
    }
  }
  function mostrarContrasena2() {
    var tipo = document.getElementById("passwordr2");
    console.log("tipo", tipo.type);
    if (tipo.type == "password") {
      tipo.type = "text";
    } else {
      tipo.type = "password";
    }
  }
  return (
    <>
      <Button variant="info" onClick={handleShow}>
        <BiEdit />
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        animation={false}
        centered
        scrollable={true}
      >
        <Modal.Header closeButton>
          <Modal.Title>Información {alumno.rol}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              email: alumno.correo,
              InputPassword: alumno.password,
              passwordr2: alumno.password,
              InputNombre: alumno.Nombre,
              InputApellidoP: alumno.ApellidoPaterno,
              InputApellidoM: alumno.ApellidoMaterno,
              InputEdad: alumno.Edad,
              InputMatricula: alumno.Matricula,
              InputNRC: alumno.NRC,
              SelectSexo: alumno.Sexo,
            }}
            validate={(values) => {
              let errors = {};
              if (!values.email) {
                errors.email = "Campo requerido";
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              ) {
                errors.email = "Correo invalido";
              }
              if (!values.InputPassword) {
                errors.password = "Campo requerido";
              } else if (!/^[A-Za-z0-9]{7}$/.test(values.InputPassword)) {
                errors.password =
                  "Su contraseña solo puede tener números y letras, sin espacios.";
              } else if (
                values.InputPassword.length < 7 ||
                values.InputPassword.length > 7
              ) {
                errors.password =
                  "Su contraseña debe de tener 7 elementos.Sin espacios!";
              }
              //Validaciones contraseña2
              if (!values.passwordr2) {
                errors.passwordr2 = "Por favor repita su contraseña.";
              } else if (values.passwordr != values.passwordr2) {
                errors.passwordr2 = "Verifique su contraseña, no coinciden.";
              }

              if (!values.InputNombre) {
                errors.nombre = "Campo requerido";
              } else if (!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(values.InputNombre)) {
                errors.nombre =
                  "El nombre solo puede tener letras y espacios, pueden llevar acentos.";
              }
              if (!values.InputApellidoP) {
                errors.apellidoPaterno = "Campo requerido";
              } else if (!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(values.InputApellidoP)) {
                errors.apellidoPaterno =
                  "El Apellido solo puede tener letras y espacios, pueden llevar acentos.";
              }
              if (!values.InputApellidoM) {
                errors.apellidoMaterno = "Campo requerido";
              } else if (!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(values.InputApellidoM)) {
                errors.apellidoMaterno =
                  "El Apellido solo puede tener letras y espacios, pueden llevar acentos.";
              }
              if (!values.InputEdad) {
                errors.edad = "Campo requerido";
              } else if (!/^[0-9]{2}$/.test(values.InputEdad)) {
                errors.edad = "La edad es un campo numérico";
              }
              if (!values.InputMatricula) {
                errors.matricula = "Campo requerido";
              } else if (!/^[0-9]{9}$/.test(values.InputMatricula)) {
                errors.matricula = "La matricula es un campo numérico";
              } else if (
                values.InputMatricula.length < 9 ||
                values.InputMatricula.length > 9
              ) {
                errors.matricula =
                  "La matricula solo puede tener 5 números, sin espacios.";
              }
              if (!values.InputNRC) {
                values.nrc = "Por favor ingrese el NRC.";
              } else if (!/^(?:\+|-)?\d+$/.test(values.InputNRC)) {
                errors.nrc =
                  "El NRC de la materia solo puede tener números, sin espacios.";
              } else if (
                values.InputNRC.length < 5 ||
                values.InputNRC.length > 7
              ) {
                errors.nrc =
                  "El NRC solo puede tener de 5 a 7 números, sin espacios.";
              }
              //Validaciones SelectVeces
              if (
                !values.SelectSexo ||
                values.SelectSexo === "Elige una opción"
              ) {
                errors.selectSexo = "Por favor seleccione una opción.";
              }
              return errors;
            }}
            onSubmit={(valores, { resetForm }) => {
              resetForm();
            }}
          >
            {({ errors }) => (
              <Form
                className="row g-3"
                onSubmit={submitHandler}
                style={{
                  textAlign: "left",
                  fontSize: "20px",
                  padding: "10px",
                  scrollBehavior: "smooth",
                }}
              >
                <div className="form-group">
                  <label className="form-label" htmlFor="nombre">
                    Nombre
                  </label>
                  <Field
                    type="txt"
                    className="form-control"
                    name="InputNombre"
                  />
                  <ErrorMessage
                    name="nombre"
                    component="div"
                    style={{ color: "red", fontSize: "15px" }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="apellidoPaterno">
                    Apellido Paterno
                  </label>
                  <Field
                    type="txt"
                    className="form-control"
                    name="InputApellidoP"
                  />
                  <ErrorMessage
                    name="apellidoPaterno"
                    component="div"
                    style={{ color: "red", fontSize: "15px" }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="apellidoMaterno">
                    Apellido Materno
                  </label>
                  <Field
                    type="txt"
                    className="form-control"
                    name="InputApellidoM"
                  />
                  <ErrorMessage
                    name="apellidoMaterno"
                    component="div"
                    style={{ color: "red", fontSize: "15px" }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="edad">
                    Edad
                  </label>
                  <Field
                    type="number"
                    className="form-control"
                    name="InputEdad"
                    min="18"
                    max="80"
                  />
                  <ErrorMessage
                    name="edad"
                    component="div"
                    style={{ color: "red", fontSize: "15px" }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="matricula">
                    Matricula
                  </label>
                  <Field
                    type="text"
                    className="form-control"
                    name="InputMatricula"
                  />
                  <ErrorMessage
                    name="matricula"
                    component="div"
                    style={{ color: "red", fontSize: "15px" }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="nrc">
                    NRC Inscrito
                  </label>
                  <Field type="text" className="form-control" name="InputNRC" />
                  <ErrorMessage
                    name="nrc"
                    component="div"
                    style={{ color: "red", fontSize: "15px" }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="selectSexo">
                    Sexo
                  </label>
                  <Field
                    className="form-select"
                    id="selectSexo"
                    name="SelectSexo"
                    as="select"
                  >
                    <option value="Elige una opción">Elige una opción</option>
                    <option value="Mujer">Mujer</option>
                    <option value="Hombre">Hombre</option>
                    <option value="Hombre">Otro</option>
                  </Field>
                  <ErrorMessage
                    name="selectSexo"
                    component="div"
                    style={{ color: "red", fontSize: "15px" }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="email">
                    Correo
                  </label>
                  <Field type="email" name="email" className="form-control" />
                  <ErrorMessage
                    name="email"
                    component="div"
                    style={{ color: "red", fontSize: "15px" }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="password">
                    Contraseña
                  </label>
                  <Field
                    type="password"
                    className="form-control"
                    name="InputPassword"
                    id="InputPassword"
                  />
                  <button
                    className="btn btn-primary btn-sm"
                    type="button"
                    onClick={() => mostrarContrasena()}
                  >
                    Mostrar/Ocultar
                  </button>
                  <ErrorMessage
                    name="password"
                    component="div"
                    style={{ color: "red", fontSize: "15px" }}
                  />
                </div>
                <div className="form-group">
                  <label for="passwordr2">Confirmar Contraseña</label>
                  <Field
                    type="password"
                    className="form-control"
                    id="passwordr2"
                    name="passwordr2"
                    placeholder="Constraseña"
                  />
                  <button
                    className="btn btn-primary btn-sm"
                    type="button"
                    onClick={() => mostrarContrasena2()}
                  >
                    Mostrar/Ocultar
                  </button>

                  <ErrorMessage
                    name="passwordr2"
                    component={() => (
                      <div className="error">
                        <p className="text-danger">
                          <small>{errors.passwordr2}</small>
                        </p>
                      </div>
                    )}
                  />
                </div>
                <br></br>
                <div className="btn-group" role="group">
                  <input
                    type="submit"
                    className="btn btn-success"
                    value="Guardar"
                  />
                  <Button variant="danger" onClick={handleClose}>
                    Cancelar
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
};
export default EditarPerfilAModal;
