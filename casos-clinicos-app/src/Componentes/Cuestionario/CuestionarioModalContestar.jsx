import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { registrarResultadoCuestionario } from '../../Modelo/AdministrarCuestionarios/administrarCuestionarios'
import Swal from "sweetalert2";
import './CuestionarioModal.css';

function CuestionarioModalContestar({ quiz }) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    function getImage(refImage) {
        if(refImage !== 'none'){

        const storage = getStorage();
        getDownloadURL(ref(storage, refImage))
          .then((url) => {
            const xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = (event) => {
              const blob = xhr.response;
            };
            xhr.open('GET', url);
            xhr.send();
      
            // Or inserted into an <img> element
            const img = document.getElementById('myimg');
            img.setAttribute('src', url);
          })
          .catch((error) => {
            console.log('Hubo un error al cargar la imagen',error)
          });
        }else{
            
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
                            respuesta1: '',
                            respuesta2: '',
                            respuesta3: '',
                            respuesta4: '',
                            respuesta5: '',
                            respuesta6: '',
                            respuesta7: '',
                            respuesta8: '',
                            respuesta9: '',
                            respuesta10: '',
                        }}
                        validate={values => {
                            const errors = {};
                            if (!document.querySelector('input[name="respuesta1"]:checked')) errors.respuesta1 = 'Respuesta requerida';
                            if (!document.querySelector('input[name="respuesta2"]:checked')) errors.respuesta2 = 'Respuesta requerida';
                            if (!document.querySelector('input[name="respuesta3"]:checked')) errors.respuesta3 = 'Respuesta requerida';
                            if (!document.querySelector('input[name="respuesta4"]:checked')) errors.respuesta4 = 'Respuesta requerida';
                            if (!document.querySelector('input[name="respuesta5"]:checked')) errors.respuesta5 = 'Respuesta requerida';
                            if (!document.querySelector('input[name="respuesta6"]:checked')) errors.respuesta6 = 'Respuesta requerida';
                            if (!document.querySelector('input[name="respuesta7"]:checked')) errors.respuesta7 = 'Respuesta requerida';
                            if (!document.querySelector('input[name="respuesta8"]:checked')) errors.respuesta8 = 'Respuesta requerida';
                            if (!document.querySelector('input[name="respuesta9"]:checked')) errors.respuesta9 = 'Respuesta requerida';
                            if (!document.querySelector('input[name="respuesta10"]:checked')) errors.respuesta10 = 'Respuesta requerida';


                            return errors;
                        }}
                        onSubmit={(values, { setSubmitting }) => {
                            Swal.fire({
                                title: 'Enviar respuestas?',
                                showDenyButton: true,
                                showCancelButton: true,
                                confirmButtonText: 'Enviar',
                                denyButtonText: `No enviar`,
                            }).then((result) => {

                                if (result.isConfirmed) {
                                    registrarResultadoCuestionario(values, quiz).then(calificacion => {
                                        console.log(calificacion);
                                        Swal.fire(`Respuestas enviadas! Su calificación es: ${calificacion}/10`, '', 'success')
                                    });
                                    
                                } else if (result.isDenied) {
                                    Swal.fire('Vuelva a verificar sus respuestas', '', 'info')
                                }
                            })
                        }}
                    >
                        {({ isSubmitting }) => (
                            <Form style={{ width: '100%' }}>
                                

                                <div className='enunciado' >
                                    <textarea rows='6' cols='80' value={quiz.Enunciado} readOnly></textarea>
                                </div>
                                <img id='myimg' alt='' style={{ width: '75%',height: '75%',align:'center'}}></img>
                                {/*Pregunta 1*/}
                                <div className='pregunta'>
                                    <div className='pregunta-respuesta'>
                                        <label htmlFor="pregunta_1">1.{quiz.pregunta_1}</label>
                                        <br />
                                        <div role="group" aria-labelledby="my-radio-group">
                                            <div className="form-check form-check">
                                                <Field className="form-check-input" type="radio" name="respuesta1" id="res1" value="respuesta_1" />
                                                <label className="form-check-label" htmlFor="res1_1">{quiz.respuesta_1}</label>
                                            </div>
                                            <div className="form-check form-check">
                                                <Field className="form-check-input" type="radio" name="respuesta1" id="res2" value="respuesta_2" />
                                                <label className="form-check-label" htmlFor="res1_2">{quiz.respuesta_2}</label>
                                            </div>
                                            <div className="form-check form-check">
                                                <Field className="form-check-input" type="radio" name="respuesta1" id="res3" value="respuesta_3" />
                                                <label className="form-check-label" htmlFor="res1_3">{quiz.respuesta_3}</label>
                                            </div>
                                            <div className="form-check form-check">
                                                <Field className="form-check-input" type="radio" name="respuesta1" id="res4" value="respuesta_4" />
                                                <label className="form-check-label" htmlFor="res1_4">{quiz.respuesta_4}</label>
                                            </div>
                                        </div>
                                        <ErrorMessage name="respuesta1" component="div" className='errors' />

                                    </div>
                                    <br />

                                </div>
                                <br />
                                <div className='pregunta'>
                                    <div className='pregunta-respuesta'>
                                        <label htmlFor="pregunta_2">2. {quiz.pregunta_2}</label>
                                        <br />
                                        <div className="form-check form-check">
                                            <Field className="form-check-input" type="radio" name="respuesta2" id="res1" value="respuesta_1" />
                                            <label className="form-check-label" htmlFor="res2_1">{quiz.respuesta_2_1}</label>
                                        </div>
                                        <div className="form-check form-check">
                                            <Field className="form-check-input" type="radio" name="respuesta2" id="res2" value="respuesta_2" />
                                            <label className="form-check-label" htmlFor="res2_2">{quiz.respuesta_2_2}</label>
                                        </div>
                                        <div className="form-check form-check">
                                            <Field className="form-check-input" type="radio" name="respuesta2" id="res3" value="respuesta_3" />
                                            <label className="form-check-label" htmlFor="res2_3">{quiz.respuesta_2_3}</label>
                                        </div>
                                        <div className="form-check form-check">
                                            <Field className="form-check-input" type="radio" name="respuesta2" id="res4" value="respuesta_4" />
                                            <label className="form-check-label" htmlFor="res2_4">{quiz.respuesta_2_4}</label>
                                        </div>
                                        <ErrorMessage name="respuesta2" component="div" className='errors' />

                                        <br />
                                    </div>

                                </div>
                                <div className='pregunta'>
                                    <div className='pregunta-respuesta'>
                                        <label htmlFor="pregunta_3">3. {quiz.pregunta_3}</label>
                                        <br />
                                        <div className="form-check form-check">
                                            <Field className="form-check-input" type="radio" name="respuesta3" id="res3_1" value="respuesta_1" />
                                            <label className="form-check-label" htmlFor="res3_1">{quiz.respuesta_3_1}</label>
                                        </div>
                                        <div className="form-check form-check">
                                            <Field className="form-check-input" type="radio" name="respuesta3" id="res3_2" value="respuesta_2" />
                                            <label className="form-check-label" htmlFor="res3_2">{quiz.respuesta_3_2}</label>
                                        </div>
                                        <div className="form-check form-check">
                                            <Field className="form-check-input" type="radio" name="respuesta3" id="res3_3" value="respuesta_3" />
                                            <label className="form-check-label" htmlFor="res3_3">{quiz.respuesta_3_3}</label>
                                        </div>
                                        <div className="form-check form-check">
                                            <Field className="form-check-input" type="radio" name="respuesta3" id="res3_4" value="respuesta_4" />
                                            <label className="form-check-label" htmlFor="res3_4">{quiz.respuesta_3_4}</label>
                                        </div>
                                        <ErrorMessage name="respuesta3" component="div" className='errors' />

                                        <br />
                                    </div>

                                </div>
                                <br />
                                <div className='pregunta'>
                                    <div className='pregunta-respuesta'>
                                        <label htmlFor="pregunta_4">4. {quiz.pregunta_4}</label>
                                        <br />
                                        <div className="form-check form-check">
                                            <Field className="form-check-input" type="radio" name="respuesta4" id="res4_1" value="respuesta_1" />
                                            <label className="form-check-label" htmlFor="res4_1">{quiz.respuesta_4_1}</label>
                                        </div>
                                        <div className="form-check form-check">
                                            <Field className="form-check-input" type="radio" name="respuesta4" id="res4_2" value="respuesta_2" />
                                            <label className="form-check-label" htmlFor="res4_2">{quiz.respuesta_4_2}</label>
                                        </div>
                                        <div className="form-check form-check">
                                            <Field className="form-check-input" type="radio" name="respuesta4" id="res4_3" value="respuesta_3" />
                                            <label className="form-check-label" htmlFor="res4_3">{quiz.respuesta_4_3}</label>
                                        </div>
                                        <div className="form-check form-check">
                                            <Field className="form-check-input" type="radio" name="respuesta4" id="res4_4" value="respuesta_4" />
                                            <label className="form-check-label" htmlFor="res4_4">{quiz.respuesta_4_4}</label>
                                        </div>
                                        <ErrorMessage name="respuesta4" component="div" className='errors' />

                                        <br />
                                    </div>

                                </div>

                                <br />
                                <div className='pregunta'>
                                    <div className='pregunta-respuesta'>
                                        <label htmlFor="pregunta_5">5. {quiz.pregunta_5}</label>
                                        <br />
                                        <div className="form-check form-check">
                                            <Field className="form-check-input" type="radio" name="respuesta5" id="res5_1" value="respuesta_1" />
                                            <label className="form-check-label" htmlFor="res5_1">{quiz.respuesta_5_1}</label>
                                        </div>
                                        <div className="form-check form-check">
                                            <Field className="form-check-input" type="radio" name="respuesta5" id="res5_2" value="respuesta_2" />
                                            <label className="form-check-label" htmlFor="res5_2">{quiz.respuesta_5_2}</label>
                                        </div>
                                        <div className="form-check form-check">
                                            <Field className="form-check-input" type="radio" name="respuesta5" id="res5_3" value="respuesta_3" />
                                            <label className="form-check-label" htmlFor="res5_3">{quiz.respuesta_5_3}</label>
                                        </div>
                                        <div className="form-check form-check">
                                            <Field className="form-check-input" type="radio" name="respuesta5" id="res5_4" value="respuesta_4" />
                                            <label className="form-check-label" htmlFor="res5_4">{quiz.respuesta_5_4}</label>
                                        </div>
                                        <ErrorMessage name="respuesta5" component="div" className='errors' />

                                        <br />
                                    </div>

                                </div>
                                <br />
                                <div className='pregunta'>
                                    <div className='pregunta-respuesta'>
                                        <label htmlFor="pregunta_6">6. {quiz.pregunta_6}</label>
                                        <br />
                                        <div className="form-check form-check">
                                            <Field className="form-check-input" type="radio" name="respuesta6" id="res6_1" value="respuesta_1" />
                                            <label className="form-check-label" htmlFor="res6_1">{quiz.respuesta_6_1}</label>
                                        </div>
                                        <div className="form-check form-check">
                                            <Field className="form-check-input" type="radio" name="respuesta6" id="res6_2" value="respuesta_2" />
                                            <label className="form-check-label" htmlFor="res6_2">{quiz.respuesta_6_2}</label>
                                        </div>
                                        <div className="form-check form-check">
                                            <Field className="form-check-input" type="radio" name="respuesta6" id="res6_3" value="respuesta_3" />
                                            <label className="form-check-label" htmlFor="res6_3">{quiz.respuesta_6_3}</label>
                                        </div>
                                        <div className="form-check form-check">
                                            <Field className="form-check-input" type="radio" name="respuesta6" id="res6_4" value="respuesta_4" />
                                            <label className="form-check-label" htmlFor="res6_4">{quiz.respuesta_6_4}</label>
                                        </div>
                                        <ErrorMessage name="respuesta6" component="div" className='errors' />

                                        <br />
                                    </div>

                                </div>
                                <br />
                                <div className='pregunta'>
                                    <div className='pregunta-respuesta'>
                                        <label htmlFor="pregunta_7">7. {quiz.pregunta_7}</label>
                                        <br />
                                        <div className="form-check form-check">
                                            <Field className="form-check-input" type="radio" name="respuesta7" id="res7_1" value="respuesta_1" />
                                            <label className="form-check-label" htmlFor="res7_1">{quiz.respuesta_7_1}</label>
                                        </div>
                                        <div className="form-check form-check">
                                            <Field className="form-check-input" type="radio" name="respuesta7" id="res7_2" value="respuesta_2" />
                                            <label className="form-check-label" htmlFor="res7_2">{quiz.respuesta_3_2}</label>
                                        </div>
                                        <div className="form-check form-check">
                                            <Field className="form-check-input" type="radio" name="respuesta7" id="res7_3" value="respuesta_3" />
                                            <label className="form-check-label" htmlFor="res7_3">{quiz.respuesta_7_3}</label>
                                        </div>
                                        <div className="form-check form-check">
                                            <Field className="form-check-input" type="radio" name="respuesta7" id="res7_4" value="respuesta_4" />
                                            <label className="form-check-label" htmlFor="res7_4">{quiz.respuesta_7_4}</label>
                                        </div>
                                        <ErrorMessage name="respuesta7" component="div" className='errors' />

                                        <br />
                                    </div>

                                </div>
                                <br />
                                <div className='pregunta'>
                                    <div className='pregunta-respuesta'>
                                        <label htmlFor="pregunta_8">8. {quiz.pregunta_8}</label>
                                        <br />
                                        <div className="form-check form-check">
                                            <Field className="form-check-input" type="radio" name="respuesta8" id="res8_1" value="respuesta_1" />
                                            <label className="form-check-label" htmlFor="res8_1">{quiz.respuesta_8_1}</label>
                                        </div>
                                        <div className="form-check form-check">
                                            <Field className="form-check-input" type="radio" name="respuesta8" id="res8_2" value="respuesta_2" />
                                            <label className="form-check-label" htmlFor="res8_2">{quiz.respuesta_8_2}</label>
                                        </div>
                                        <div className="form-check form-check">
                                            <Field className="form-check-input" type="radio" name="respuesta8" id="res8_3" value="respuesta_3" />
                                            <label className="form-check-label" htmlFor="res8_3">{quiz.respuesta_8_3}</label>
                                        </div>
                                        <div className="form-check form-check">
                                            <Field className="form-check-input" type="radio" name="respuesta8" id="res8_4" value="respuesta_4" />
                                            <label className="form-check-label" htmlFor="res8_4">{quiz.respuesta_8_4}</label>
                                        </div>
                                        <ErrorMessage name="respuesta8" component="div" className='errors' />

                                        <br />
                                    </div>

                                </div>
                                <br />
                                <div className='pregunta'>
                                    <div className='pregunta-respuesta'>
                                        <label htmlFor="pregunta_9">9. {quiz.pregunta_9}</label>
                                        <br />
                                        <div className="form-check form-check">
                                            <Field className="form-check-input" type="radio" name="respuesta9" id="res9_1" value="respuesta_1" />
                                            <label className="form-check-label" htmlFor="res9_1">{quiz.respuesta_9_1}</label>
                                        </div>
                                        <div className="form-check form-check">
                                            <Field className="form-check-input" type="radio" name="respuesta9" id="res9_2" value="respuesta_2" />
                                            <label className="form-check-label" htmlFor="res9_2">{quiz.respuesta_9_2}</label>
                                        </div>
                                        <div className="form-check form-check">
                                            <Field className="form-check-input" type="radio" name="respuesta9" id="res9_3" value="respuesta_3" />
                                            <label className="form-check-label" htmlFor="res9_3">{quiz.respuesta_9_3}</label>
                                        </div>
                                        <div className="form-check form-check">
                                            <Field className="form-check-input" type="radio" name="respuesta9" id="res9_4" value="respuesta_4" />
                                            <label className="form-check-label" htmlFor="res9_4">{quiz.respuesta_9_4}</label>
                                        </div>
                                        <ErrorMessage name="respuesta9" component="div" className='errors' />

                                        <br />
                                    </div>

                                </div>
                                <br />
                                <div className='pregunta'>
                                    <div className='pregunta-respuesta'>
                                        <label htmlFor="pregunta_10">10. {quiz.pregunta_10}</label>
                                        <br />
                                        <div className="form-check form-check">
                                            <Field className="form-check-input" type="radio" name="respuesta10" id="res10_1" value="respuesta_1" />
                                            <label className="form-check-label" htmlFor="res10_1">{quiz.respuesta_10_1}</label>
                                        </div>
                                        <div className="form-check form-check">
                                            <Field className="form-check-input" type="radio" name="respuesta10" id="res10_2" value="respuesta_2" />
                                            <label className="form-check-label" htmlFor="res10_2">{quiz.respuesta_10_2}</label>
                                        </div>
                                        <div className="form-check form-check">
                                            <Field className="form-check-input" type="radio" name="respuesta10" id="res10_3" value="respuesta_3" />
                                            <label className="form-check-label" htmlFor="res10_3">{quiz.respuesta_10_3}</label>
                                        </div>
                                        <div className="form-check form-check">
                                            <Field className="form-check-input" type="radio" name="respuesta10" id="res10_4" value="respuesta_4" />
                                            <label className="form-check-label" htmlFor="res10_4">{quiz.respuesta_10_4}</label>
                                        </div>
                                        <ErrorMessage name="respuesta10" component="div" className='errors' />

                                        <br />
                                    </div>
                                </div>
                                <br />
                                <div className="btn-group">
                                    <button className='btn btn-success' type="submit" >
                                        Enviar
                                    </button>
                                    <button className='btn btn-secondary' type="reset">
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
    )
}

export default CuestionarioModalContestar