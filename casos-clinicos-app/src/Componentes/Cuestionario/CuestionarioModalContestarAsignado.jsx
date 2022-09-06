import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import {
  collection,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import firebaseApp from "../../Firebase/firebase-config";
import { registrarResultadoCuestionarioAsignado } from "../../Modelo/AdministrarCuestionarios/administrarCuestionarios";
import Swal from "sweetalert2";

function CuestionarioModalContestarAsignado({ quiz, user }) {
  const [show, setShow] = useState(false);
  const [showresp, setShowresp] = useState(false);
  const [intento, setIntento] = useState(0);
  const [calificacion, setCalificacion] = useState(0);

  const handleClose = () => setShow(false, setShowresp(false));
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

          // Or inserted into an <img> element
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

  async function getIntento() {
    let intento = 0;
    const cuestionarioRef = collection(db, "Resultado");
    const museums = query(
      cuestionarioRef,
      where("idCuestionario", "==", quiz.idCuestionario),
      where("idAlumno", "==", user.uid)
    );
    const querySnapshot = await getDocs(museums);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      intento = doc.data().intento;
    });
    return intento;
  }

  function openModal() {
    getIntento().then((res) => {
      setIntento(res);
      console.log("Resultado de intento", res);

      if (res.valueOf() >= 3) {
        new Swal({
          position: "top-end",
          icon: "error",
          title: "Sus 3 intentos ya han sido utilizados",
          showConfirmButton: false,
          timer: 3000,
        });
      } else {
        setShow(true);
      }
    });
  }

  const db = getFirestore(firebaseApp);

  useEffect(() => {
    document.cal = `You clicked ${calificacion} times`;
    document.intento = `Intento${intento}`;
    console.log("Cuestionario en resultado:::", quiz.idCuestionario);
    console.log("Id alumno en resultado:::", user.uid);
    const cuestionarioRef = collection(db, "Resultado");
    const q = query(
      cuestionarioRef,
      where("idCuestionario", "==", quiz.idCuestionario),
      where("idAlumno", "==", user.uid)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const cities = [];
      querySnapshot.forEach((doc) => {
        cities.push(doc.data().idResultado);
        setIntento(doc.data().intento);
        setCalificacion(doc.data().calificacion);
      });
      console.log("Current cities in CA: ", cities.join(", "));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      <Button variant="primary" onClick={() => openModal()}>
        Contestar
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        style={{ width: "100%" }}
        size="lg"
        scrollable={true}
      >
        <Modal.Header closeButton>
          <Modal.Title>{quiz.Titulo}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>
              Número de intento:<mark>{intento}</mark>
            </strong>
          </p>
          {calificacion > 5 && (
            <p>
              <strong>
                Calificación:{" "}
                <mark style={{ color: "green" }}>{calificacion}</mark>
              </strong>
            </p>
          )}
          {calificacion < 6 && (
            <p>
              <strong>
                Calificación:{" "}
                <mark style={{ color: "red" }}>{calificacion}</mark>
              </strong>
            </p>
          )}
          <Formik
            initialValues={{
              respuesta1: "",
              respuesta2: "",
              respuesta3: "",
              respuesta4: "",
              respuesta5: "",
              respuesta6: "",
              respuesta7: "",
              respuesta8: "",
              respuesta9: "",
              respuesta10: "",
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
              if (!document.querySelector('input[name="respuesta5"]:checked'))
                errors.respuesta5 = "Respuesta requerida";
              if (!document.querySelector('input[name="respuesta6"]:checked'))
                errors.respuesta6 = "Respuesta requerida";
              if (!document.querySelector('input[name="respuesta7"]:checked'))
                errors.respuesta7 = "Respuesta requerida";
              if (!document.querySelector('input[name="respuesta8"]:checked'))
                errors.respuesta8 = "Respuesta requerida";
              if (!document.querySelector('input[name="respuesta9"]:checked'))
                errors.respuesta9 = "Respuesta requerida";
              if (!document.querySelector('input[name="respuesta10"]:checked'))
                errors.respuesta10 = "Respuesta requerida";

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
                  registrarResultadoCuestionarioAsignado(
                    values,
                    quiz,
                    user
                  ).then((cal) => {
                    console.log(cal);
                    Swal.fire(
                      `Respuestas enviadas! Intento: ${
                        intento + 1
                      }.Su calificación es: ${cal}/10.`,
                      "",
                      "success"
                    );
                  });
                  setShowresp(true);
                  setTimeout(() => setShowresp(false), 20000);
                } else if (result.isDenied) {
                  Swal.fire("Vuelva a verificar sus respuestas", "", "info");
                }
              });
            }}
          >
            {({ isSubmitting }) => (
              <Form style={{ width: "100%" }}>
                <div className="enunciado">
                  <textarea
                    rows="6"
                    cols="80"
                    style={{ border: "none", outline: "none" }}
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
                    1.{quiz.pregunta_1} ({quiz?.valorResPregunta1} pts){" "}
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
                {showresp && (
                  <p>
                    <mark className="respuestaCorr">
                      <b>Respuesta correcta:</b> {quiz.respuestaCorrectaP1}
                    </mark>
                  </p>
                )}
                {/*Pregunta 2*/}
                <label>
                  <b>
                    2.{quiz.pregunta_2} ({quiz?.valorResPregunta2} pts){" "}
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
                  <ErrorMessage
                    name="respuesta2"
                    component="div"
                    className="errors"
                  />
                  {showresp && (
                    <p>
                      <mark className="respuestaCorr">
                        <b>Respuesta correcta:</b> {quiz.respuestaCorrectaP2}
                      </mark>
                    </p>
                  )}
                </div>
                {/*Pregunta 3*/}
                <label>
                  <b>
                    3.{quiz.pregunta_3} ({quiz?.valorResPregunta3} pts){" "}
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
                  {showresp && (
                    <p>
                      <mark className="respuestaCorr">
                        <b>Respuesta correcta:</b> {quiz.respuestaCorrectaP3}
                      </mark>
                    </p>
                  )}
                </div>
                {/*Pregunta 4*/}
                <label>
                  <b>
                    4.{quiz.pregunta_4} ({quiz?.valorResPregunta4} pts){" "}
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
                  {showresp && (
                    <p>
                      <mark className="respuestaCorr">
                        <b>Respuesta correcta:</b> {quiz.respuestaCorrectaP4}
                      </mark>
                    </p>
                  )}
                </div>
                {/*Pregunta 5*/}
                <label>
                  <b>
                    5.{quiz.pregunta_5} ({quiz?.valorResPregunta5} pts){" "}
                  </b>
                </label>
                <div role="group" aria-labelledby="my-radio-group">
                  <div className="form-check form-check">
                    <Field
                      className="form-check-input"
                      type="radio"
                      name="respuesta5"
                      id="res5_1"
                      value="respuesta_1"
                    />
                    <label className="form-check-label" htmlFor="res5_1">
                      {quiz.respuesta_5_1}
                    </label>
                  </div>
                  <div className="form-check form-check">
                    <Field
                      className="form-check-input"
                      type="radio"
                      name="respuesta5"
                      id="res5_2"
                      value="respuesta_2"
                    />
                    <label className="form-check-label" htmlFor="res5_2">
                      {quiz.respuesta_5_2}
                    </label>
                  </div>
                  <div className="form-check form-check">
                    <Field
                      className="form-check-input"
                      type="radio"
                      name="respuesta5"
                      id="res5_3"
                      value="respuesta_3"
                    />
                    <label className="form-check-label" htmlFor="res5_3">
                      {quiz.respuesta_5_3}
                    </label>
                  </div>
                  <div className="form-check form-check">
                    <Field
                      className="form-check-input"
                      type="radio"
                      name="respuesta5"
                      id="res5_4"
                      value="respuesta_4"
                    />
                    <label className="form-check-label" htmlFor="res5_4">
                      {quiz.respuesta_5_4}
                    </label>
                  </div>
                  <ErrorMessage
                    name="respuesta5"
                    component="div"
                    className="errors"
                  />
                  {showresp && (
                    <p>
                      <mark className="respuestaCorr">
                        <b>Respuesta correcta:</b> {quiz.respuestaCorrectaP5}
                      </mark>
                    </p>
                  )}
                </div>
                {/*Pregunta 6*/}
                <label>
                  <b>
                    6.{quiz.pregunta_6} ({quiz?.valorResPregunta6} pts){" "}
                  </b>
                </label>
                <div role="group" aria-labelledby="my-radio-group">
                  <div className="form-check form-check">
                    <Field
                      className="form-check-input"
                      type="radio"
                      name="respuesta6"
                      id="res6_1"
                      value="respuesta_1"
                    />
                    <label className="form-check-label" htmlFor="res6_1">
                      {quiz.respuesta_6_1}
                    </label>
                  </div>
                  <div className="form-check form-check">
                    <Field
                      className="form-check-input"
                      type="radio"
                      name="respuesta6"
                      id="res6_2"
                      value="respuesta_2"
                    />
                    <label className="form-check-label" htmlFor="res6_2">
                      {quiz.respuesta_6_2}
                    </label>
                  </div>
                  <div className="form-check form-check">
                    <Field
                      className="form-check-input"
                      type="radio"
                      name="respuesta6"
                      id="res6_3"
                      value="respuesta_3"
                    />
                    <label className="form-check-label" htmlFor="res6_3">
                      {quiz.respuesta_6_3}
                    </label>
                  </div>
                  <div className="form-check form-check">
                    <Field
                      className="form-check-input"
                      type="radio"
                      name="respuesta6"
                      id="res6_4"
                      value="respuesta_4"
                    />
                    <label className="form-check-label" htmlFor="res6_4">
                      {quiz.respuesta_6_4}
                    </label>
                  </div>
                  <ErrorMessage
                    name="respuesta6"
                    component="div"
                    className="errors"
                  />
                  {showresp && (
                    <p>
                      <mark className="respuestaCorr">
                        <b>Respuesta correcta:</b> {quiz.respuestaCorrectaP6}
                      </mark>
                    </p>
                  )}
                </div>
                {/*Pregunta 7*/}
                <label>
                  <b>
                    7.{quiz.pregunta_7} ({quiz?.valorResPregunta7} pts){" "}
                  </b>
                </label>
                <div role="group" aria-labelledby="my-radio-group">
                  <div className="form-check form-check">
                    <Field
                      className="form-check-input"
                      type="radio"
                      name="respuesta7"
                      id="res7_1"
                      value="respuesta_1"
                    />
                    <label className="form-check-label" htmlFor="res7_1">
                      {quiz.respuesta_7_1}
                    </label>
                  </div>
                  <div className="form-check form-check">
                    <Field
                      className="form-check-input"
                      type="radio"
                      name="respuesta7"
                      id="res7_2"
                      value="respuesta_2"
                    />
                    <label className="form-check-label" htmlFor="res7_2">
                      {quiz.respuesta_3_2}
                    </label>
                  </div>
                  <div className="form-check form-check">
                    <Field
                      className="form-check-input"
                      type="radio"
                      name="respuesta7"
                      id="res7_3"
                      value="respuesta_3"
                    />
                    <label className="form-check-label" htmlFor="res7_3">
                      {quiz.respuesta_7_3}
                    </label>
                  </div>
                  <div className="form-check form-check">
                    <Field
                      className="form-check-input"
                      type="radio"
                      name="respuesta7"
                      id="res7_4"
                      value="respuesta_4"
                    />
                    <label className="form-check-label" htmlFor="res7_4">
                      {quiz.respuesta_7_4}
                    </label>
                  </div>
                  <ErrorMessage
                    name="respuesta7"
                    component="div"
                    className="errors"
                  />
                  {showresp && (
                    <p>
                      <mark className="respuestaCorr">
                        <b>Respuesta correcta:</b> {quiz.respuestaCorrectaP7}
                      </mark>
                    </p>
                  )}
                </div>
                {/*Pregunta 8*/}
                <label>
                  <b>
                    8.{quiz.pregunta_8} ({quiz?.valorResPregunta8} pts){" "}
                  </b>
                </label>
                <div role="group" aria-labelledby="my-radio-group">
                  <div className="form-check form-check">
                    <Field
                      className="form-check-input"
                      type="radio"
                      name="respuesta8"
                      id="res8_1"
                      value="respuesta_1"
                    />
                    <label className="form-check-label" htmlFor="res8_1">
                      {quiz.respuesta_8_1}
                    </label>
                  </div>
                  <div className="form-check form-check">
                    <Field
                      className="form-check-input"
                      type="radio"
                      name="respuesta8"
                      id="res8_2"
                      value="respuesta_2"
                    />
                    <label className="form-check-label" htmlFor="res8_2">
                      {quiz.respuesta_8_2}
                    </label>
                  </div>
                  <div className="form-check form-check">
                    <Field
                      className="form-check-input"
                      type="radio"
                      name="respuesta8"
                      id="res8_3"
                      value="respuesta_3"
                    />
                    <label className="form-check-label" htmlFor="res8_3">
                      {quiz.respuesta_8_3}
                    </label>
                  </div>
                  <div className="form-check form-check">
                    <Field
                      className="form-check-input"
                      type="radio"
                      name="respuesta8"
                      id="res8_4"
                      value="respuesta_4"
                    />
                    <label className="form-check-label" htmlFor="res8_4">
                      {quiz.respuesta_8_4}
                    </label>
                  </div>
                  <ErrorMessage
                    name="respuesta8"
                    component="div"
                    className="errors"
                  />
                  {showresp && (
                    <p>
                      <mark className="respuestaCorr">
                        <b>Respuesta correcta:</b> {quiz.respuestaCorrectaP8}
                      </mark>
                    </p>
                  )}
                </div>
                {/*Pregunta 9*/}
                <label>
                  <b>
                    9.{quiz.pregunta_9} ({quiz?.valorResPregunta9} pts){" "}
                  </b>
                </label>
                <div role="group" aria-labelledby="my-radio-group">
                  <div className="form-check form-check">
                    <Field
                      className="form-check-input"
                      type="radio"
                      name="respuesta9"
                      id="res9_1"
                      value="respuesta_1"
                    />
                    <label className="form-check-label" htmlFor="res9_1">
                      {quiz.respuesta_9_1}
                    </label>
                  </div>
                  <div className="form-check form-check">
                    <Field
                      className="form-check-input"
                      type="radio"
                      name="respuesta9"
                      id="res9_2"
                      value="respuesta_2"
                    />
                    <label className="form-check-label" htmlFor="res9_2">
                      {quiz.respuesta_9_2}
                    </label>
                  </div>
                  <div className="form-check form-check">
                    <Field
                      className="form-check-input"
                      type="radio"
                      name="respuesta9"
                      id="res9_3"
                      value="respuesta_3"
                    />
                    <label className="form-check-label" htmlFor="res9_3">
                      {quiz.respuesta_9_3}
                    </label>
                  </div>
                  <div className="form-check form-check">
                    <Field
                      className="form-check-input"
                      type="radio"
                      name="respuesta9"
                      id="res9_4"
                      value="respuesta_4"
                    />
                    <label className="form-check-label" htmlFor="res9_4">
                      {quiz.respuesta_9_4}
                    </label>
                  </div>
                  <ErrorMessage
                    name="respuesta9"
                    component="div"
                    className="errors"
                  />
                  {showresp && (
                    <p>
                      <mark className="respuestaCorr">
                        <b>Respuesta correcta:</b> {quiz.respuestaCorrectaP9}
                      </mark>
                    </p>
                  )}
                </div>
                {/*Pregunta 10*/}
                <label>
                  <b>
                    10.{quiz.pregunta_10} ({quiz?.valorResPregunta10} pts){" "}
                  </b>
                </label>
                <div role="group" aria-labelledby="my-radio-group">
                  <div className="form-check form-check">
                    <Field
                      className="form-check-input"
                      type="radio"
                      name="respuesta10"
                      id="res10_1"
                      value="respuesta_1"
                    />
                    <label className="form-check-label" htmlFor="res10_1">
                      {quiz.respuesta_10_1}
                    </label>
                  </div>
                  <div className="form-check form-check">
                    <Field
                      className="form-check-input"
                      type="radio"
                      name="respuesta10"
                      id="res10_2"
                      value="respuesta_2"
                    />
                    <label className="form-check-label" htmlFor="res10_2">
                      {quiz.respuesta_10_2}
                    </label>
                  </div>
                  <div className="form-check form-check">
                    <Field
                      className="form-check-input"
                      type="radio"
                      name="respuesta10"
                      id="res10_3"
                      value="respuesta_3"
                    />
                    <label className="form-check-label" htmlFor="res10_3">
                      {quiz.respuesta_10_3}
                    </label>
                  </div>
                  <div className="form-check form-check">
                    <Field
                      className="form-check-input"
                      type="radio"
                      name="respuesta10"
                      id="res10_4"
                      value="respuesta_4"
                    />
                    <label className="form-check-label" htmlFor="res10_4">
                      {quiz.respuesta_10_4}
                    </label>
                  </div>
                  <ErrorMessage
                    name="respuesta10"
                    component="div"
                    className="errors"
                  />
                  {showresp && (
                    <p>
                      <mark className="respuestaCorr">
                        <b>Respuesta correcta:</b> {quiz.respuestaCorrectaP10}
                      </mark>
                    </p>
                  )}
                </div>

                <br />
                <div className="btn-group">
                  <button
                    className="btn btn-success"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Guardar
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

export default CuestionarioModalContestarAsignado;