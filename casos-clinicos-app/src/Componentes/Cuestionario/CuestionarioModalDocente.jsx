import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Modal, Button } from 'react-bootstrap'
import { registrarNuevoCuestionario } from '../../Modelo/AdministrarCuestionarios/administrarCuestionarios'
import Swal from "sweetalert2";
import './CuestionarioModal.css';
import { FaRegPlusSquare} from "react-icons/fa";
function CuestionarioModalDocente({ data, user}) {

    console.log(data)
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [imageUpload, setImageUpload] = useState(null);
    

    function openModal(){
        if(data === null){
            new Swal({
                position: 'top-end',
                icon: 'error',
                title: 'Seleccione un subtema primero',
                showConfirmButton: false,
                timer: 3000
            });
        }else{
             setShow(true);
        }
    }

    return (
        <div>
            <Button variant="outline-success" onClick={()=>openModal()}>
                <FaRegPlusSquare/>cuestionario
            </Button>
            <Modal show={show} onHide={handleClose} size="lg" scrollable={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Nuevo Cuestionario</Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    <Formik
                        initialValues={{
                            Titulo:'',
                            Enunciado:'',
                            pregunta_1: '',
                            respuesta_1: '',
                            respuesta_2: '',
                            respuesta_3: '',
                            respuesta_4: '',
                            respuestaCorrectaP1:'',
                            pregunta_2: '',
                            respuesta_2_1: '',
                            respuesta_2_2: '',
                            respuesta_2_3: '',
                            respuesta_2_4: '',
                            respuestaCorrectaP2:'',
                            pregunta_3: '',
                            respuesta_3_1: '',
                            respuesta_3_2: '',
                            respuesta_3_3: '',
                            respuesta_3_4: '',
                            respuestaCorrectaP3:'',
                            pregunta_4: '',
                            respuesta_4_1: '',
                            respuesta_4_2: '',
                            respuesta_4_3: '',
                            respuesta_4_4: '',
                            respuestaCorrectaP4:'',
                            pregunta_5: '',
                            respuesta_5_1: '',
                            respuesta_5_2: '',
                            respuesta_5_3: '',
                            respuesta_5_4: '',
                            respuestaCorrectaP5:'',
                            pregunta_6: '',
                            respuesta_6_1: '',
                            respuesta_6_2: '',
                            respuesta_6_3: '',
                            respuesta_6_4: '',
                            respuestaCorrectaP6:'',
                            pregunta_7: '',
                            respuesta_7_1: '',
                            respuesta_7_2: '',
                            respuesta_7_3: '',
                            respuesta_7_4: '',
                            respuestaCorrectaP7:'',
                            pregunta_8: '',
                            respuesta_8_1: '',
                            respuesta_8_2: '',
                            respuesta_8_3: '',
                            respuesta_8_4: '',
                            respuestaCorrectaP8:'',
                            pregunta_9: '',
                            respuesta_9_1: '',
                            respuesta_9_2: '',
                            respuesta_9_3: '',
                            respuesta_9_4: '',
                            respuestaCorrectaP9:'',
                            pregunta_10: '',
                            respuesta_10_1: '',
                            respuesta_10_2: '',
                            respuesta_10_3: '',
                            respuesta_10_4: '',
                            respuestaCorrectaP10:'',
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
                            if (!values.pregunta_2) errors.pregunta_2 = 'Pregunta requerida';
                            if (!values.respuesta_2_1) errors.respuesta_2_1 = 'Respuesta requerida';
                            if (!values.respuesta_2_2) errors.respuesta_2_2 = 'Respuesta requerida';
                            if (!values.respuesta_2_3) errors.respuesta_2_3 = 'Respuesta requerida';
                              if (!values.respuesta_2_3) errors.respuesta_2_4 = 'Respuesta requerida';
                            if (!values.respuestaCorrectaP2 ||values.respuestaCorrectaP2 === "elige") errors.respuestaCorrectaP2 = 'Respuesta correcta requerida';
                            if (!values.pregunta_3) errors.pregunta_3 = 'Pregunta requerida';
                            if (!values.respuesta_3_1) errors.respuesta_3_1 = 'Respuesta requerida';
                            if (!values.respuesta_3_2) errors.respuesta_3_2 = 'Respuesta requerida';
                            if (!values.respuesta_3_3) errors.respuesta_3_3 = 'Respuesta requerida';
                              if (!values.respuesta_3_3) errors.respuesta_3_4 = 'Respuesta requerida';
                            if (!values.respuestaCorrectaP3||values.respuestaCorrectaP3 === "elige") errors.respuestaCorrectaP3 = 'Respuesta correcta requerida';
                            if (!values.pregunta_4) errors.pregunta_4 = 'Pregunta requerida';
                            if (!values.respuesta_4_1) errors.respuesta_4_1 = 'Respuesta requerida';
                            if (!values.respuesta_4_2) errors.respuesta_4_2 = 'Respuesta requerida';
                            if (!values.respuesta_4_3) errors.respuesta_4_3 = 'Respuesta requerida';
                              if (!values.respuesta_4_3) errors.respuesta_4_4 = 'Respuesta requerida';
                            if (!values.respuestaCorrectaP4||values.respuestaCorrectaP4 === "elige") errors.respuestaCorrectaP4 = 'Respuesta correcta requerida';
                            if (!values.pregunta_5) errors.pregunta_5 = 'Pregunta requerida';
                            if (!values.respuesta_5_1) errors.respuesta_5_1 = 'Respuesta requerida';
                            if (!values.respuesta_5_2) errors.respuesta_5_2 = 'Respuesta requerida';
                            if (!values.respuesta_5_3) errors.respuesta_5_3 = 'Respuesta requerida';
                              if (!values.respuesta_5_3) errors.respuesta_5_4 = 'Respuesta requerida';
                            if (!values.respuestaCorrectaP5||values.respuestaCorrectaP5 === "elige") errors.respuestaCorrectaP5 = 'Respuesta correcta requerida';
                            if (!values.pregunta_6) errors.pregunta_6 = 'Pregunta requerida';
                            if (!values.respuesta_6_1) errors.respuesta_6_1 = 'Respuesta requerida';
                            if (!values.respuesta_6_2) errors.respuesta_6_2 = 'Respuesta requerida';
                            if (!values.respuesta_6_3) errors.respuesta_6_3 = 'Respuesta requerida';
                              if (!values.respuesta_6_3) errors.respuesta_6_4 = 'Respuesta requerida';
                            if (!values.respuestaCorrectaP6||values.respuestaCorrectaP6 === "elige") errors.respuestaCorrectaP6 = 'Respuesta correcta requerida';
                            if (!values.pregunta_7) errors.pregunta_7 = 'Pregunta requerida';
                            if (!values.respuesta_7_1) errors.respuesta_7_1 = 'Respuesta requerida';
                            if (!values.respuesta_7_2) errors.respuesta_7_2 = 'Respuesta requerida';
                            if (!values.respuesta_7_3) errors.respuesta_7_3 = 'Respuesta requerida';
                              if (!values.respuesta_7_3) errors.respuesta_7_4 = 'Respuesta requerida';
                            if (!values.respuestaCorrectaP7||values.respuestaCorrectaP7 === "elige") errors.respuestaCorrectaP7 = 'Respuesta correcta requerida';
                            if (!values.pregunta_8) errors.pregunta_8 = 'Pregunta requerida';
                            if (!values.respuesta_8_1) errors.respuesta_8_1 = 'Respuesta requerida';
                            if (!values.respuesta_8_2) errors.respuesta_8_2 = 'Respuesta requerida';
                            if (!values.respuesta_8_3) errors.respuesta_8_3 = 'Respuesta requerida';
                              if (!values.respuesta_8_3) errors.respuesta_8_4 = 'Respuesta requerida';
                            if (!values.respuestaCorrectaP8||values.respuestaCorrectaP8 === "elige") errors.respuestaCorrectaP8 = 'Respuesta correcta requerida';
                            if (!values.pregunta_9) errors.pregunta_9 = 'Pregunta requerida';
                            if (!values.respuesta_9_1) errors.respuesta_9_1 = 'Respuesta requerida';
                            if (!values.respuesta_9_2) errors.respuesta_9_2 = 'Respuesta requerida';
                            if (!values.respuesta_9_3) errors.respuesta_9_3 = 'Respuesta requerida';
                              if (!values.respuesta_9_3) errors.respuesta_9_4 = 'Respuesta requerida';
                            if (!values.respuestaCorrectaP9||values.respuestaCorrectaP9 === "elige") errors.respuestaCorrectaP9 = 'Respuesta correcta requerida';
                            if (!values.pregunta_10) errors.pregunta_10 = 'Pregunta requerida';
                            if (!values.respuesta_10_1) errors.respuesta_10_1 = 'Respuesta requerida';
                            if (!values.respuesta_10_2) errors.respuesta_10_2 = 'Respuesta requerida';
                            if (!values.respuesta_10_3) errors.respuesta_10_3 = 'Respuesta requerida';
                            if (!values.respuesta_10_3) errors.respuesta_10_4 = 'Respuesta requerida';
                            if (!values.respuestaCorrectaP10||values.respuestaCorrectaP10 === "elige") errors.respuestaCorrectaP10 = 'Respuesta correcta requerida';

                            return errors;
                        }}
                        onSubmit={(values, { setSubmitting }) => {
                            registrarNuevoCuestionario(values,data, user, imageUpload);
                        }} 
                    >
                        {({ isSubmitting }) => (
                            <Form style={{  width: '800px' }}>
                                <Field className="titulo" type="text" name="Titulo" style={{width:'500px'}}  placeholder="Título"/>
                                <ErrorMessage name="Titulo" component="div" className='errors'/>
                                <Field component='textarea' className="Enunciado" name="Enunciado" style={{width:'500px'}}  placeholder="Enunciado"/>
                                <ErrorMessage name="Enunciado" component="div" className='errors'/>
                                <label htmlFor="image" style={{widt:'500px'}}>Insertar más información como imagen</label>
                                <div className='image' name='image' >
                                    <input className='file' type='file' onChange={(event) => {
                                        setImageUpload(event.target.files[0])
                                    }}></input>
                                </div>
                                {/*Pregunta 1*/}
                                <div className='pregunta' style={{textAlign:'center', width:'500px', height:'130px'}}>
                                <div className='pregunta-respuesta' style={{float:'left', width:'300px'}}>
                                <label htmlFor="pregunta_1">Pregunta 1</label>
                                <br />
                                <Field className="pregunta_field" type="text" name="pregunta_1" style={{width:'300px'}}/>
                                <ErrorMessage name="pregunta_1" component="div" className='errors'/>
                                <br />
                                <Field className="respuesta_field" type="text" name="respuesta_1" placeholder="Respuesta 1" />
                                <ErrorMessage name="respuesta_1" component="div" className='errors'/>
                                <br />
                                <Field className="respuesta_field" type="text" name="respuesta_2" placeholder="Respuesta 2" />
                                <ErrorMessage name="respuesta_2" component="div" className='errors'/>
                                <br />
                                <Field className="respuesta_field" type="text" name="respuesta_3" placeholder="Respuesta 3" />
                                <ErrorMessage name="respuesta_3" component="div" className='errors'/>
                                <br />
                                <Field className="respuesta_field" type="text" name="respuesta_4" placeholder="Respuesta 4" />
                                <ErrorMessage name="respuesta_4" component="div" className='errors'/>
                                </div> 
                                <br />
                                
                                <div className='select-respuesta' style={{float:'right', width:'200px'}}>
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
                                <ErrorMessage name="respuestaCorrectaP1" component="div" className='errors'/>
                                </div>
                                </div>
                                <br/>
                                <div className='pregunta'>
                                <div className='pregunta-respuesta'>
                                <label htmlFor="pregunta_2">Pregunta 2</label>
                                <br />
                                <Field className="pregunta_field" type="text" name="pregunta_2" />
                                <ErrorMessage name="pregunta_2" component="div" className='errors'/>
                                <br />
                                <Field className="respuesta_field" type="text" name="respuesta_2_1" placeholder="Respuesta 1" />
                                <ErrorMessage name="respuesta_2_1" component="div" className='errors'/>
                                <br />
                                <Field className="respuesta_field" type="text" name="respuesta_2_2" placeholder="Respuesta 2" />
                                <ErrorMessage name="respuesta_2_2" component="div" className='errors'/>
                                <br />
                                <Field className="respuesta_field" type="text" name="respuesta_2_3" placeholder="Respuesta 3" />
                                <ErrorMessage name="respuesta_2_3" component="div" className='errors'/>
                                <br />
                                <Field className="respuesta_field" type="text" name="respuesta_2_4" placeholder="Respuesta 4" />
                                <ErrorMessage name="respuesta_2_4" component="div" className='errors'/>
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
                                <ErrorMessage name="respuestaCorrectaP2" component="div" className='errors'/>
                                </div>
                                </div>
                                <div className='pregunta'>
                                <div className='pregunta-respuesta'>
                                <label htmlFor="pregunta_3">Pregunta 3</label>
                                <br />
                                <Field className="pregunta_field" type="text" name="pregunta_3" />
                                <ErrorMessage name="pregunta_3" component="div" className='errors'/>
                                <br />
                                <Field className="respuesta_field" type="text" name="respuesta_3_1" placeholder="Respuesta 1" />
                                <ErrorMessage name="respuesta_3_1" component="div" className='errors'/>
                                <br />
                                <Field className="respuesta_field" type="text" name="respuesta_3_2" placeholder="Respuesta 2" />
                                <ErrorMessage name="respuesta_3_2" component="div" className='errors'/>
                                <br />
                                <Field className="respuesta_field" type="text" name="respuesta_3_3" placeholder="Respuesta 3" />
                                <ErrorMessage name="respuesta_3_3" component="div" className='errors'/>
                                <br />
                                <Field className="respuesta_field" type="text" name="respuesta_3_4" placeholder="Respuesta 4" />
                                <ErrorMessage name="respuesta_3_4" component="div" className='errors'/>
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
                                <ErrorMessage name="respuestaCorrectaP3" component="div" className='errors'/>
                                </div>
                                </div>
                                <br />
                                <div className='pregunta'>
                                <div className='pregunta-respuesta'>
                                <label htmlFor="pregunta-4">Pregunta 4</label>
                                <br />
                                <Field className="pregunta_field" type="text" name="pregunta_4" />
                                <ErrorMessage name="pregunta_4" component="div" className='errors'/>
                                <br />
                                <Field className="respuesta_field" type="text" name="respuesta_4_1" placeholder="Respuesta 1" />
                                <ErrorMessage name="respuesta_4_1" component="div" className='errors'/>
                                <br />
                                <Field className="respuesta_field" type="text" name="respuesta_4_2" placeholder="Respuesta 2" />
                                <ErrorMessage name="respuesta_4_2" component="div" className='errors'/>
                                <br />
                                <Field className="respuesta_field" type="text" name="respuesta_4_3" placeholder="Respuesta 3" />
                                <ErrorMessage name="respuesta_4_3" component="div" className='errors'/>
                                <br />
                                <Field className="respuesta_field" type="text" name="respuesta_4_4" placeholder="Respuesta 4" />
                                <ErrorMessage name="respuesta_4_4" component="div" className='errors'/>
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
                                <ErrorMessage name="respuestaCorrectaP4" component="div" className='errors'/>
                                </div>
                                </div>

                                <br />
                                <div className='pregunta'>
                                <div className='pregunta-respuesta'>
                                <label htmlFor="pregunta_1">Pregunta 5</label>
                                <br />
                                <Field className="pregunta_field" type="text" name="pregunta_5" />
                                <ErrorMessage name="pregunta_5" component="div" className='errors'/>
                                <br />
                                <Field className="respuesta_field" type="text" name="respuesta_5_1" placeholder="Respuesta 1" />
                                <ErrorMessage name="respuesta_5_1" component="div" className='errors'/>
                                <br />
                                <Field className="respuesta_field" type="text" name="respuesta_5_2" placeholder="Respuesta 2" />
                                <ErrorMessage name="respuesta_5_2" component="div" className='errors'/>
                                <br />
                                <Field className="respuesta_field" type="text" name="respuesta_5_3" placeholder="Respuesta 3" />
                                <ErrorMessage name="respuesta_5_3" component="div" className='errors'/>
                                <br />
                                <Field className="respuesta_field" type="text" name="respuesta_5_4" placeholder="Respuesta 4" />
                                <ErrorMessage name="respuesta_5_4" component="div" className='errors'/>
                                </div>
                                <div className='select-respuesta'>
                                <label htmlFor="location">Respuesta correcta</label>
                                <Field
                                    component="select"
                                    id="respuestaCorrectaP5"
                                    name="respuestaCorrectaP5">
                                    <option value="elige">Elige respuesta correcta</option>
                                    <option value="respuesta_1">Respuesta 1</option>
                                    <option value="respuesta_2">Respuesta 2</option>
                                    <option value="respuesta_3">Respuesta 3</option>
                                    <option value="respuesta_4">Respuesta 4</option>
                                </Field>
                                <ErrorMessage name="respuestaCorrectaP5" component="div" className='errors'/>
                                </div>
                                </div>
                                <br />
                                <div className='pregunta'>
                                <div className='pregunta-respuesta'>
                                <label htmlFor="pregunta-_">Pregunta 6</label>
                                <br />
                                <Field className="pregunta_field" type="text" name="pregunta_6" />
                                <ErrorMessage name="pregunta_6" component="div" className='errors'/>
                                <br />
                                <Field className="respuesta_field" type="text" name="respuesta_6_1" placeholder="Respuesta 1" />
                                <ErrorMessage name="respuesta_6_1" component="div" className='errors'/>
                                <br />
                                <Field className="respuesta_field" type="text" name="respuesta_6_2" placeholder="Respuesta 2" />
                                <ErrorMessage name="respuesta_6_2" component="div" className='errors'/>
                                <br />
                                <Field className="respuesta_field" type="text" name="respuesta_6_3" placeholder="Respuesta 3" />
                                <ErrorMessage name="respuesta_6_3" component="div" className='errors'/>
                                <br />
                                <Field className="respuesta_field" type="text" name="respuesta_6_4" placeholder="Respuesta 4" />
                                <ErrorMessage name="respuesta_6_4" component="div" className='errors'/>
                                </div>
                                <div className='select-respuesta'>
                                <label htmlFor="location">Respuesta correcta</label>
                                <Field
                                    component="select"
                                    id="respuestaCorrectaP6"
                                    name="respuestaCorrectaP6">
                                    <option value="elige">Elige respuesta correcta</option>
                                    <option value="respuesta_1">Respuesta 1</option>
                                    <option value="respuesta_2">Respuesta 2</option>
                                    <option value="respuesta_3">Respuesta 3</option>
                                    <option value="respuesta_4">Respuesta 4</option>
                                </Field>
                                <ErrorMessage name="respuestaCorrectaP6" component="div" className='errors'/>
                                </div>
                                </div>
                                <br />
                                <div className='pregunta'>
                                <div className='pregunta-respuesta'>
                                <label htmlFor="pregunta_7">Pregunta 7</label>
                                <br />
                                <Field className="pregunta_field" type="text" name="pregunta_7" />
                                <ErrorMessage name="pregunta_7" component="div" className='errors'/>
                                <br />
                                <Field className="respuesta_field" type="text" name="respuesta_7_1" placeholder="Respuesta 1" />
                                <ErrorMessage name="respuesta_7_1" component="div" className='errors'/>
                                <br />
                                <Field className="respuesta_field" type="text" name="respuesta_7_2" placeholder="Respuesta 2" />
                                <ErrorMessage name="respuesta_7_2" component="div" className='errors'/>
                                <br />
                                <Field className="respuesta_field" type="text" name="respuesta_7_3" placeholder="Respuesta 3" />
                                <ErrorMessage name="respuesta_7_3" component="div" className='errors'/>
                                <br />
                                <Field className="respuesta_field" type="text" name="respuesta_7_4" placeholder="Respuesta 4" />
                                <ErrorMessage name="respuesta_7_4" component="div" className='errors'/>
                                </div>
                                <div className='select-respuesta'>
                                <label htmlFor="location">Respuesta correcta</label>
                                <Field
                                    component="select"
                                    id="respuestaCorrectaP7"
                                    name="respuestaCorrectaP7">
                                    <option value="elige">Elige respuesta correcta</option>
                                    <option value="respuesta_1">Respuesta 1</option>
                                    <option value="respuesta_2">Respuesta 2</option>
                                    <option value="respuesta_3">Respuesta 3</option>
                                    <option value="respuesta_4">Respuesta 4</option>
                                </Field>
                                <ErrorMessage name="respuestaCorrectaP7" component="div" className='errors'/>
                                </div>
                                </div>
                                <br />
                                <div className='pregunta'>
                                <div className='pregunta-respuesta'>
                                <label htmlFor="pregunta_8">Pregunta 8</label>
                                <br />
                                <Field className="pregunta_field" type="text" name="pregunta_8" />
                                <ErrorMessage name="pregunta_8" component="div" className='errors'/>
                                <br />
                                <Field className="respuesta_field" type="text" name="respuesta_8_1" placeholder="Respuesta 1" />
                                <ErrorMessage name="respuesta_8_1" component="div" className='errors'/>
                                <br />
                                <Field className="respuesta_field" type="text" name="respuesta_8_2" placeholder="Respuesta 2" />
                                <ErrorMessage name="respuesta_8_2" component="div" className='errors'/>
                                <br />
                                <Field className="respuesta_field" type="text" name="respuesta_8_3" placeholder="Respuesta 3" />
                                <ErrorMessage name="respuesta_8_3" component="div" className='errors'/>
                                <br />
                                <Field className="respuesta_field" type="text" name="respuesta_8_4" placeholder="Respuesta 4" />
                                <ErrorMessage name="respuesta_8_4" component="div" className='errors'/>
                                </div>
                                <div className='select-respuesta'>
                                <label htmlFor="location">Respuesta correcta</label>
                                <Field
                                    component="select"
                                    id="respuestaCorrectaP8"
                                    name="respuestaCorrectaP8">
                                    <option value="elige">Elige respuesta correcta</option>
                                    <option value="respuesta_1">Respuesta 1</option>
                                    <option value="respuesta_2">Respuesta 2</option>
                                    <option value="respuesta_3">Respuesta 3</option>
                                    <option value="respuesta_4">Respuesta 4</option>
                                </Field>
                                <ErrorMessage name="respuestaCorrectaP8" component="div" className='errors'/>
                                </div>
                                </div>
                                <br />
                                <div className='pregunta'>
                                <div className='pregunta-respuesta'>
                                <label htmlFor="pregunta-9">Pregunta 9</label>
                                <br />
                                <Field className="pregunta_field" type="text" name="pregunta_9" />
                                <ErrorMessage name="pregunta_9" component="div" className='errors'/>
                                <br />
                                <Field className="respuesta_field" type="text" name="respuesta_9_1" placeholder="Respuesta 1" />
                                <ErrorMessage name="respuesta_9_1" component="div" className='errors'/>
                                <br />
                                <Field className="respuesta_field" type="text" name="respuesta_9_2" placeholder="Respuesta 2" />
                                <ErrorMessage name="respuesta_9_2" component="div" className='errors'/>
                                <br />
                                <Field className="respuesta_field" type="text" name="respuesta_9_3" placeholder="Respuesta 3" />
                                <ErrorMessage name="respuesta_9_3" component="div" className='errors'/>
                                <br />
                                <Field className="respuesta_field" type="text" name="respuesta_9_4" placeholder="Respuesta 4" />
                                <ErrorMessage name="respuesta_9_4" component="div" className='errors'/>
                                </div>
                                <div className='select-respuesta'>
                                <label htmlFor="location">Respuesta correcta</label>
                                <Field
                                    component="select"
                                    id="respuestaCorrectaP9"
                                    name="respuestaCorrectaP9">
                                    <option value="elige">Elige respuesta correcta</option>
                                    <option value="respuesta_1">Respuesta 1</option>
                                    <option value="respuesta_2">Respuesta 2</option>
                                    <option value="respuesta_3">Respuesta 3</option>
                                    <option value="respuesta_4">Respuesta 4</option>
                                </Field>
                                <ErrorMessage name="respuestaCorrectaP9" component="div" className='errors'/>
                                </div>
                                </div>
                                <br />
                                <div className='pregunta'>
                                <div className='pregunta-respuesta'>
                                <label htmlFor="pregunta_10">Pregunta 10</label>
                                <br />
                                <Field className="pregunta_field" type="text" name="pregunta_10" />
                                <ErrorMessage name="pregunta_10" component="div" className='errors'/>
                                <br />
                                <Field className="respuesta_field" type="text" name="respuesta_10_1" placeholder="Respuesta 1" />
                                <ErrorMessage name="respuesta_10_1" component="div" className='errors'/>
                                <br />
                                <Field className="respuesta_field" type="text" name="respuesta_10_2" placeholder="Respuesta 2" />
                                <ErrorMessage name="respuesta_10_2" component="div" className='errors'/>
                                <br />
                                <Field className="respuesta_field" type="text" name="respuesta_10_3" placeholder="Respuesta 3" />
                                <ErrorMessage name="respuesta_10_3" component="div" className='errors'/>
                                <br />
                                <Field className="respuesta_field" type="text" name="respuesta_10_4" placeholder="Respuesta 4" />
                                <ErrorMessage name="respuesta_10_4" component="div" className='errors'/>
                                </div>
                                <div className='select-respuesta'>
                                <label htmlFor="location">Respuesta correcta</label>
                                <Field
                                    component="select"
                                    id="respuestaCorrectaP10"
                                    name="respuestaCorrectaP10">
                                    <option value="elige">Elige respuesta correcta</option>
                                    <option value="respuesta_1">Respuesta 1</option>
                                    <option value="respuesta_2">Respuesta 2</option>
                                    <option value="respuesta_3">Respuesta 3</option>
                                    <option value="respuesta_4">Respuesta 4</option>
                                </Field>
                                <ErrorMessage name="respuestaCorrectaP10" component="div" className='errors'/>
                                </div>
                                </div>
                                <br />
                                <button className='btn_guardar' type="submit" disabled={isSubmitting}>
                                    Guardar
                                </button>
                                <br />
                            </Form>
                        )}
                    </Formik>
                </Modal.Body>
            </Modal>
        </div>

    )
}

export default CuestionarioModalDocente