import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { registrarResultadoCuestionario } from "../../Modelo/AdministrarCuestionarios/administrarCuestionarios";
import Swal from "sweetalert2";
//import './CuestionarioModal.css';

function CuestionarioModalContestar({ quiz }) {
  const [show, setShow] = useState(false);
  const [valor1, setValor1] = useState(0);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  function getImage(refImage) {
    if (refImage !== "none") {
      const storage = getStorage();
      getDownloadURL(ref(storage, refImage))
        .then((url) => {
          const xhr = new XMLHttpRequest();
          xhr.responseType = "blob";
          xhr.onload = (event) => {};
          xhr.open("GET", url);
          xhr.send();

          const img = document.getElementById("myimg");
          img.setAttribute("src", url);
        })
        .catch((error) => {
          console.log("Hubo un error al cargar la imagen", error);
        });
    } else {
    }
  }

  getImage(quiz.imageRef);
  return (
    <>
      <Button variant="secondary" onClick={handleShow}>
        Practicar
      </Button>

      <Modal show={show} onHide={handleClose} size="lg" scrollable={true}>
        <Modal.Header closeButton>
          <Modal.Title>{quiz.Titulo}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              respuesta1: "",
              respuesta2: "",
              respuesta3: "",
              respuesta4: "",
            }}
            validate={(values) => {
              const errors = {};
              if (!document.querySelector('input[name="respuesta1"]:checked'))
                errors.respuesta1 = "Respuesta requerida";
              if (!document.querySelector('input[name="respuesta2"]:checked'))
                errors.respuesta2 = "Respuesta requerida";
              if (!document.querySelector('input[name="respuesta3"]:checked'))
                errors.respuesta3 = "Respuesta requerida";
              if (!document.querySelector('input[name="respuesta4"]:checked'))
                errors.respuesta4 = "Respuesta requerida";

              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              Swal.fire({
                title: "Enviar respuestas?",
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: "Enviar",
                denyButtonText: `No enviar`,
              }).then((result) => {
                if (result.isConfirmed) {
                  registrarResultadoCuestionario(values, quiz).then(
                    (calificacion) => {
                      console.log(calificacion);
                      Swal.fire(
                        `Respuestas enviadas! Su calificación es: ${calificacion}/10`,
                        "",
                        "success"
                      );
                    }
                  );
                } else if (result.isDenied) {
                  Swal.fire("Vuelva a verificar sus respuestas", "", "info");
                }
              });
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="enunciado">
                  <textarea
                    rows="6"
                    cols="80"
                    value={quiz.Enunciado}
                    readOnly
                  ></textarea>
                </div>
                {<img id="myimg" alt=""></img>}
                <p>
                  <em>
                    Nota: En las preguntas con valor 0 puntos podra selección cualquier
                    opción.
                  </em>
                </p>
                {/*Pregunta 1*/}
                <label>
                  <b>
                    1.{quiz.pregunta_1} ({quiz.valorResPregunta1} pts){" "}
                  </b>
                </label>
                <div role="group" aria-labelledby="my-radio-group">
                  <div className="form-check form-check">
                    <Field
                      className="form-check-input"
                      type="radio"
                      name="respuesta1"
                      id="res1"
                      value="respuesta_1"
                    />
                    <label className="form-check-label" htmlFor="res1_1">
                      {quiz.respuesta_1}
                    </label>
                  </div>
                  <div className="form-check form-check">
                    <Field
                      className="form-check-input"
                      type="radio"
                      name="respuesta1"
                      id="res2"
                      value="respuesta_2"
                    />
                    <label className="form-check-label" htmlFor="res1_2">
                      {quiz.respuesta_2}
                    </label>
                  </div>
                  <div className="form-check form-check">
                    <Field
                      className="form-check-input"
                      type="radio"
                      name="respuesta1"
                      id="res3"
                      value="respuesta_3"
                    />
                    <label className="form-check-label" htmlFor="res1_3">
                      {quiz.respuesta_3}
                    </label>
                  </div>
                  <div className="form-check form-check">
                    <Field
                      className="form-check-input"
                      type="radio"
                      name="respuesta1"
                      id="res4"
                      value="respuesta_4"
                    />
                    <label className="form-check-label" htmlFor="res1_4">
                      {quiz.respuesta_4}
                    </label>
                  </div>
                </div>
                <ErrorMessage
                  name="respuesta1"
                  component="div"
                  className="errors"
                />
                <br />
                {/*Pregunta 2*/}

                <label>
                  <b>
                    2.{quiz.pregunta_2} ({quiz.valorResPregunta2} pts){" "}
                  </b>
                </label>
                <div role="group" aria-labelledby="my-radio-group">
                  <div className="form-check form-check">
                    <Field
                      className="form-check-input"
                      type="radio"
                      name="respuesta2"
                      id="res1"
                      value="respuesta_1"
                    />
                    <label className="form-check-label" htmlFor="res2_1">
                      {quiz.respuesta_2_1}
                    </label>
                  </div>
                  <div className="form-check form-check">
                    <Field
                      className="form-check-input"
                      type="radio"
                      name="respuesta2"
                      id="res2"
                      value="respuesta_2"
                    />
                    <label className="form-check-label" htmlFor="res2_2">
                      {quiz.respuesta_2_2}
                    </label>
                  </div>
                  <div className="form-check form-check">
                    <Field
                      className="form-check-input"
                      type="radio"
                      name="respuesta2"
                      id="res3"
                      value="respuesta_3"
                    />
                    <label className="form-check-label" htmlFor="res2_3">
                      {quiz.respuesta_2_3}
                    </label>
                  </div>
                  <div className="form-check form-check">
                    <Field
                      className="form-check-input"
                      type="radio"
                      name="respuesta2"
                      id="res4"
                      value="respuesta_4"
                    />
                    <label className="form-check-label" htmlFor="res2_4">
                      {quiz.respuesta_2_4}
                    </label>
                  </div>
                </div>
                <ErrorMessage
                  name="respuesta2"
                  component="div"
                  className="errors"
                />
                <br />
                {/*Pregunta 3*/}
                <label>
                  <b>
                    3.{quiz.pregunta_3} ({quiz.valorResPregunta3} pts){" "}
                  </b>
                </label>
                <div role="group" aria-labelledby="my-radio-group">
                  <div className="form-check form-check">
                    <Field
                      className="form-check-input"
                      type="radio"
                      name="respuesta3"
                      id="res3_1"
                      value="respuesta_1"
                    />
                    <label className="form-check-label" htmlFor="res3_1">
                      {quiz.respuesta_3_1}
                    </label>
                  </div>
                  <div className="form-check form-check">
                    <Field
                      className="form-check-input"
                      type="radio"
                      name="respuesta3"
                      id="res3_2"
                      value="respuesta_2"
                    />
                    <label className="form-check-label" htmlFor="res3_2">
                      {quiz.respuesta_3_2}
                    </label>
                  </div>
                  <div className="form-check form-check">
                    <Field
                      className="form-check-input"
                      type="radio"
                      name="respuesta3"
                      id="res3_3"
                      value="respuesta_3"
                    />
                    <label className="form-check-label" htmlFor="res3_3">
                      {quiz.respuesta_3_3}
                    </label>
                  </div>
                  <div className="form-check form-check">
                    <Field
                      className="form-check-input"
                      type="radio"
                      name="respuesta3"
                      id="res3_4"
                      value="respuesta_4"
                    />
                    <label className="form-check-label" htmlFor="res3_4">
                      {quiz.respuesta_3_4}
                    </label>
                  </div>
                  <ErrorMessage
                    name="respuesta3"
                    component="div"
                    className="errors"
                  />
                </div>
                <br />
                {/*Pregunta 4*/}
                <label>
                  <b>
                    4.{quiz.pregunta_4} ({quiz.valorResPregunta4} pts){" "}
                  </b>
                </label>
                <div role="group" aria-labelledby="my-radio-group">
                  <div className="form-check form-check">
                    <Field
                      className="form-check-input"
                      type="radio"
                      name="respuesta4"
                      id="res4_1"
                      value="respuesta_1"
                    />
                    <label className="form-check-label" htmlFor="res4_1">
                      {quiz.respuesta_4_1}
                    </label>
                  </div>
                  <div className="form-check form-check">
                    <Field
                      className="form-check-input"
                      type="radio"
                      name="respuesta4"
                      id="res4_2"
                      value="respuesta_2"
                    />
                    <label className="form-check-label" htmlFor="res4_2">
                      {quiz.respuesta_4_2}
                    </label>
                  </div>
                  <div className="form-check form-check">
                    <Field
                      className="form-check-input"
                      type="radio"
                      name="respuesta4"
                      id="res4_3"
                      value="respuesta_3"
                    />
                    <label className="form-check-label" htmlFor="res4_3">
                      {quiz.respuesta_4_3}
                    </label>
                  </div>
                  <div className="form-check form-check">
                    <Field
                      className="form-check-input"
                      type="radio"
                      name="respuesta4"
                      id="res4_4"
                      value="respuesta_4"
                    />
                    <label className="form-check-label" htmlFor="res4_4">
                      {quiz.respuesta_4_4}
                    </label>
                  </div>
                  <ErrorMessage
                    name="respuesta4"
                    component="div"
                    className="errors"
                  />
                </div>
                <br></br>
                <div className="btn-group">
                  <button className="btn btn-success" type="submit">
                    Enviar
                  </button>
                  <button className="btn btn-secondary" type="reset">
                    Limpiar
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CuestionarioModalContestar;
