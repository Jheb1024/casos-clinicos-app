import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Modal, Button } from 'react-bootstrap'
import { actualizarCuestionario } from '../../Modelo/AdministrarCuestionarios/administrarCuestionarios'
import Swal from "sweetalert2";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import './CuestionarioModal.css';

function EditarCuestionarioModalDocente({ data, info }) {

    console.log(data)
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const [imageUpload, setImageUpload] = useState(null);

    function openModal() {
        setShow(true);
    }
    function getImage(refImage) {
        console.log('this is what it has', refImage)
        if (refImage === 'none') {
        } else {

            const storage = getStorage();
            getDownloadURL(ref(storage, refImage))
                .then((url) => {
                    const xhr = new XMLHttpRequest();
                    xhr.responseType = 'blob';
                    xhr.onload = (event) => {
                    };
                    xhr.open('GET', url);
                    xhr.send();

                    // Or inserted into an <img> element
                    const img = document.getElementById('myimg');
                    img.setAttribute('src', url);
                })
                .catch((error) => {
                    console.log('Hubo un error al cargar la imagen', error)
                });
        }

    }

    getImage(data.imageRef);

    return (
        <div>
            <Button variant="primary" onClick={() => openModal()}>
                Editar
            </Button>
            <Modal show={show} onHide={handleClose} size="lg" scrollable={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Cuestionario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Formik
                        initialValues={{
                            Titulo: data.Titulo,
                            Enunciado: data.Enunciado,
                            pregunta_1: data.pregunta_1,
                            respuesta_1: data.respuesta_1,
                            respuesta_2: data.respuesta_2,
                            respuesta_3: data.respuesta_3,
                            respuesta_4: data.respuesta_4,
                            respuestaCorrectaP1: data.respuestaCorrectaP1,
                            valorResPregunta1: data.valorResPregunta1,
                            pregunta_2: data.pregunta_2,
                            respuesta_2_1: data.respuesta_2_1,
                            respuesta_2_2: data.respuesta_2_2,
                            respuesta_2_3: data.respuesta_2_3,
                            respuesta_2_4: data.respuesta_2_4,
                            respuestaCorrectaP2: data.respuestaCorrectaP2,
                            valorResPregunta2: data.valorResPregunta2,
                            pregunta_3: data.pregunta_3,
                            respuesta_3_1: data.respuesta_3_1,
                            respuesta_3_2: data.respuesta_3_2,
                            respuesta_3_3: data.respuesta_3_3,
                            respuesta_3_4: data.respuesta_3_4,
                            respuestaCorrectaP3: data.respuestaCorrectaP3,
                            valorResPregunta3: data.valorResPregunta3,
                            pregunta_4: data.pregunta_4,
                            respuesta_4_1: data.respuesta_4_1,
                            respuesta_4_2: data.respuesta_4_2,
                            respuesta_4_3: data.respuesta_4_3,
                            respuesta_4_4: data.respuesta_4_4,
                            respuestaCorrectaP4: data.respuestaCorrectaP4,
                            valorResPregunta4: data.valorResPregunta4,
                        }}
                        validate={values => {
                            const errors = {};
                            if (!values.Titulo) errors.Titulo = 'Título requerido';
                            if (!values.Enunciado) errors.Enunciado = 'Enunciado requerido';
                            if (!values.pregunta_1) errors.pregunta_1 = 'Pregunta requerida';
                            if (!values.respuesta_1) errors.respuesta_1 = 'Respuesta requerida';
                            if (!values.respuesta_2) errors.respuesta_2 = 'Respuesta requerida';
                            if (!values.respuesta_3) errors.respuesta_3 = 'Respuesta requerida';
                            if (!values.respuesta_4) errors.respuesta_4 = 'Respuesta requerida';
                            if (!values.respuestaCorrectaP1 || values.respuestaCorrectaP1 === "elige") errors.respuestaCorrectaP1 = 'Respuesta correcta requerida';
                            if (values.valorResPregunta1 < 0 || values.valorResPregunta1 > 10 || values.valorResPregunta1.length === 0) errors.valorResPregunta1 = "Valor requerido";
                            if (!values.pregunta_2) errors.pregunta_2 = 'Pregunta requerida';
                            if (!values.respuesta_2_1) errors.respuesta_2_1 = 'Respuesta requerida';
                            if (!values.respuesta_2_2) errors.respuesta_2_2 = 'Respuesta requerida';
                            if (!values.respuesta_2_3) errors.respuesta_2_3 = 'Respuesta requerida';
                            if (!values.respuesta_2_4) errors.respuesta_2_4 = 'Respuesta requerida';
                            if (!values.respuestaCorrectaP2 || values.respuestaCorrectaP2 === "elige") errors.respuestaCorrectaP2 = 'Respuesta correcta requerida';
                            if (values.valorResPregunta2 < 0 || values.valorResPregunta2 > 10 || values.valorResPregunta2.length === 0) errors.valorResPregunta2 = "Valor requerido";
                            if (!values.pregunta_3) errors.pregunta_3 = 'Pregunta requerida';
                            if (!values.respuesta_3_1) errors.respuesta_3_1 = 'Respuesta requerida';
                            if (!values.respuesta_3_2) errors.respuesta_3_2 = 'Respuesta requerida';
                            if (!values.respuesta_3_3) errors.respuesta_3_3 = 'Respuesta requerida';
                            if (!values.respuesta_3_4) errors.respuesta_3_4 = 'Respuesta requerida';
                            if (!values.respuestaCorrectaP3 || values.respuestaCorrectaP3 === "elige") errors.respuestaCorrectaP3 = 'Respuesta correcta requerida';
                            if (values.valorResPregunta3 < 0 || values.valorResPregunta3 > 10 || values.valorResPregunta3.length === 0) errors.valorResPregunta3 = "Valor requerido";
                            if (!values.pregunta_4) errors.pregunta_4 = 'Pregunta requerida';
                            if (!values.respuesta_4_1) errors.respuesta_4_1 = 'Respuesta requerida';
                            if (!values.respuesta_4_2) errors.respuesta_4_2 = 'Respuesta requerida';
                            if (!values.respuesta_4_3) errors.respuesta_4_3 = 'Respuesta requerida';
                            if (!values.respuesta_4_4) errors.respuesta_4_4 = 'Respuesta requerida';
                            if (!values.respuestaCorrectaP4 || values.respuestaCorrectaP4 === "elige") errors.respuestaCorrectaP4 = 'Respuesta correcta requerida';
                            if (values.valorResPregunta4 < 0 || values.valorResPregunta4 > 10 || values.valorResPregunta4.length === 0) errors.valorResPregunta4 = "Valor requerido";

                            return errors;
                        }}
                        onSubmit={(values, { setSubmitting }) => {
                            if (actualizarCuestionario(values, data, imageUpload)) {


                                //
                                setShow(false)
                                new Swal({
                                    title: "Acción exitosa",
                                    text: "El cuestionario ha sido actualzado.",
                                    icon: "success",
                                    showConfirmButton: false,
                                    timer: 3000
                                });
                                info(true);

                                //window.location.reload();
                            }
                        }}
                    >
                        {({ isSubmitting }) => (
                            <Form style={{ width: '700px' }}>
                                <Field className="titulo" type="text" name="Titulo" style={{ width: '500px' }} placeholder="Título" />
                                <ErrorMessage name="Titulo" component="div" className='errors' />
                                <Field component='textarea' rows='5' className="Enunciado" type="text" name="Enunciado" style={{ width: '700px' }} placeholder="Enunciado" />
                                <ErrorMessage name="Enunciado" component="div" className='errors' />
                                {<img id='myimg' alt=''></img>}
                                <div className='image' >
                                    <input clasName='file' type='file' onChange={(event) => {
                                        setImageUpload(event.target.files[0])
                                    }}></input>
                                </div>
                                {/*Pregunta 1*/}
                                <div className='pregunta' style={{ textAlign: 'center', width: '500px', height: '130px' }}>
                                    <div className='pregunta-respuesta' style={{ float: 'left', width: '300px' }}>
                                        <label htmlFor="pregunta_1">Pregunta 1</label>
                                        <br />
                                        <Field className="pregunta_field" type="text" name="pregunta_1" style={{ width: '300px' }} />
                                        <ErrorMessage name="pregunta_1" component="div" className='errors' />
                                        <br />
                                        <Field className="respuesta_field" type="text" name="respuesta_1" placeholder="Respuesta 1" />
                                        <ErrorMessage name="respuesta_1" component="div" className='errors' />
                                        <br />
                                        <Field className="respuesta_field" type="text" name="respuesta_2" placeholder="Respuesta 2" />
                                        <ErrorMessage name="respuesta_2" component="div" className='errors' />
                                        <br />
                                        <Field className="respuesta_field" type="text" name="respuesta_3" placeholder="Respuesta 3" />
                                        <ErrorMessage name="respuesta_3" component="div" className='errors' />
                                        <br />
                                        <Field className="respuesta_field" type="text" name="respuesta_4" placeholder="Respuesta 4" />
                                        <ErrorMessage name="respuesta_4" component="div" className='errors' />
                                    </div>
                                    <br />
                                    <div className='select-respuesta' style={{ float: 'right', width: '200px' }}>
                                        <label htmlFor="location">Respuesta correcta</label>
                                        <Field
                                            component="select"
                                            id="respuestaCorrectaP1"
                                            name="respuestaCorrectaP1">
                                            <option value="elige">Elige respuesta correcta</option>
                                            <option value="respuesta_1">Respuesta 1</option>
                                            <option value="respuesta_2">Respuesta 2</option>
                                            <option value="respuesta_3">Respuesta 3</option>
                                            <option value="respuesta_4">Respuesta 4</option>
                                        </Field>
                                        <ErrorMessage name="respuestaCorrectaP1" component="div" className='errors' />
                                        <label htmlFor='valorResPregunta1'>Valor: </label>
                                        <Field className='valorRespuesta' type="number" name='valorResPregunta1' min="0" max="10" step="0.01" />
                                        <ErrorMessage name='valorResPregunta1' component="div" className='errors' />
                                    </div>
                                </div>
                                <br />
                                <div className='pregunta'>
                                    <div className='pregunta-respuesta'>
                                        <label htmlFor="pregunta_2">Pregunta 2</label>
                                        <br />
                                        <Field className="pregunta_field" type="text" name="pregunta_2" />
                                        <ErrorMessage name="pregunta_2" component="div" className='errors' />
                                        <br />
                                        <Field className="respuesta_field" type="text" name="respuesta_2_1" placeholder="Respuesta 1" />
                                        <ErrorMessage name="respuesta_2_1" component="div" className='errors' />
                                        <br />
                                        <Field className="respuesta_field" type="text" name="respuesta_2_2" placeholder="Respuesta 2" />
                                        <ErrorMessage name="respuesta_2_2" component="div" className='errors' />
                                        <br />
                                        <Field className="respuesta_field" type="text" name="respuesta_2_3" placeholder="Respuesta 3" />
                                        <ErrorMessage name="respuesta_2_3" component="div" className='errors' />
                                        <br />
                                        <Field className="respuesta_field" type="text" name="respuesta_2_4" placeholder="Respuesta 4" />
                                        <ErrorMessage name="respuesta_2_4" component="div" className='errors' />
                                        <br />
                                    </div>
                                    <div className='select-respuesta'>
                                        <label htmlFor="respuestaCorrectaP2">Respuesta correcta</label>
                                        <Field
                                            component="select"
                                            id="respuestaCorrectaP2"
                                            name="respuestaCorrectaP2">
                                            <option value="elige">Elige respuesta correcta</option>
                                            <option value="respuesta_1">Respuesta 1</option>
                                            <option value="respuesta_2">Respuesta 2</option>
                                            <option value="respuesta_3">Respuesta 3</option>
                                            <option value="respuesta_4">Respuesta 4</option>
                                        </Field>
                                        <ErrorMessage name="respuestaCorrectaP2" component="div" className='errors' />
                                        <label htmlFor='valorResPregunta2'>Valor: </label>
                                        <Field className='valorRespuesta' type="number" name='valorResPregunta2' min="0" max="10" step="0.01" />
                                        <ErrorMessage name='valorResPregunta2' component="div" className='errors' />
                                    </div>
                                </div>
                                <br></br>
                                <div className='pregunta'>
                                    <div className='pregunta-respuesta'>
                                        <label htmlFor="pregunta_3">Pregunta 3</label>
                                        <br />
                                        <Field className="pregunta_field" type="text" name="pregunta_3" />
                                        <ErrorMessage name="pregunta_3" component="div" className='errors' />
                                        <br />
                                        <Field className="respuesta_field" type="text" name="respuesta_3_1" placeholder="Respuesta 1" />
                                        <ErrorMessage name="respuesta_3_1" component="div" className='errors' />
                                        <br />
                                        <Field className="respuesta_field" type="text" name="respuesta_3_2" placeholder="Respuesta 2" />
                                        <ErrorMessage name="respuesta_3_2" component="div" className='errors' />
                                        <br />
                                        <Field className="respuesta_field" type="text" name="respuesta_3_3" placeholder="Respuesta 3" />
                                        <ErrorMessage name="respuesta_3_3" component="div" className='errors' />
                                        <br />
                                        <Field className="respuesta_field" type="text" name="respuesta_3_4" placeholder="Respuesta 4" />
                                        <ErrorMessage name="respuesta_3_4" component="div" className='errors' />
                                    </div>
                                    <div className='select-respuesta'>
                                        <label htmlFor="location">Respuesta correcta</label>
                                        <Field
                                            component="select"
                                            id="respuestaCorrectaP3"
                                            name="respuestaCorrectaP3">
                                            <option value="elige">Elige respuesta correcta</option>
                                            <option value="respuesta_1">Respuesta 1</option>
                                            <option value="respuesta_2">Respuesta 2</option>
                                            <option value="respuesta_3">Respuesta 3</option>
                                            <option value="respuesta_4">Respuesta 4</option>
                                        </Field>
                                        <ErrorMessage name="respuestaCorrectaP3" component="div" className='errors' />
                                        <label htmlFor='valorResPregunta3'>Valor: </label>
                                        <Field className='valorRespuesta' type="number" name='valorResPregunta3' min="0" max="10" step="0.01" />
                                        <ErrorMessage name='valorResPregunta3' component="div" className='errors' />
                                    </div>
                                </div>
                                <br />
                                <div className='pregunta'>
                                    <div className='pregunta-respuesta'>
                                        <label htmlFor="pregunta-4">Pregunta 4</label>
                                        <br />
                                        <Field className="pregunta_field" type="text" name="pregunta_4" />
                                        <ErrorMessage name="pregunta_4" component="div" className='errors' />
                                        <br />
                                        <Field className="respuesta_field" type="text" name="respuesta_4_1" placeholder="Respuesta 1" />
                                        <ErrorMessage name="respuesta_4_1" component="div" className='errors' />
                                        <br />
                                        <Field className="respuesta_field" type="text" name="respuesta_4_2" placeholder="Respuesta 2" />
                                        <ErrorMessage name="respuesta_4_2" component="div" className='errors' />
                                        <br />
                                        <Field className="respuesta_field" type="text" name="respuesta_4_3" placeholder="Respuesta 3" />
                                        <ErrorMessage name="respuesta_4_3" component="div" className='errors' />
                                        <br />
                                        <Field className="respuesta_field" type="text" name="respuesta_4_4" placeholder="Respuesta 4" />
                                        <ErrorMessage name="respuesta_4_4" component="div" className='errors' />
                                    </div>
                                    <div className='select-respuesta'>
                                        <label htmlFor="location">Respuesta correcta</label>
                                        <Field
                                            component="select"
                                            id="respuestaCorrectaP4"
                                            name="respuestaCorrectaP4">
                                            <option value="elige">Elige respuesta correcta</option>
                                            <option value="respuesta_1">Respuesta 1</option>
                                            <option value="respuesta_2">Respuesta 2</option>
                                            <option value="respuesta_3">Respuesta 3</option>
                                            <option value="respuesta_4">Respuesta 4</option>
                                        </Field>
                                        <ErrorMessage name="respuestaCorrectaP4" component="div" className='errors' />
                                        <label htmlFor='valorResPregunta4'>Valor: </label>
                                        <Field className='valorRespuesta' type="number" name='valorResPregunta4' min="0" max="10" step="0.01" />
                                        <ErrorMessage name='valorResPregunta4' component="div" className='errors' />
                                    </div>
                                </div>

                                <br />
                                <br />
                                <button className='btn_guardar' type="submit" disabled={isSubmitting}>
                                    Actualizar
                                </button>

                            </Form>
                        )}
                    </Formik>
                </Modal.Body>
            </Modal>
        </div>

    )
}

export default EditarCuestionarioModalDocente