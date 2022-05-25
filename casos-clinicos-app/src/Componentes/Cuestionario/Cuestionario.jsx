import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Link, useLocation, } from 'react-router-dom';
function Cuestionario() {
  const location = useLocation();
  console.log(location, " useLocation Hook");

  return (
    <div>
    <h2>Nuevo Cuestionario</h2>
    <Formik
      initialValues={{ email: '', password: '' }}
      validate={values => {
        const errors = {};
        if (!values.email) {
          errors.email = 'Required';
        } else if (
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
        ) {
          errors.email = 'Invalid email address';
        }
        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        }, 400);
      }}
    >
      {({ isSubmitting }) => (
        <Form style={{textAlign:'center' , width:'100%'}}>
          {/*Pregunta 1*/}
          <label htmlFor="pregunta-1">Pregunta 1</label>
          <br/>
          <Field type="text" name="pregunta-1" />
          <ErrorMessage name="pregunta-1" component="div" />
          <br/>
          <Field type="text" name="respuesta-1" placeholder="Respuesta 1" />
          <ErrorMessage name="respuesta-1" component="div" />
          <br/>
          <Field type="text" name="respuesta-2" placeholder="Respuesta 2"/>
          <ErrorMessage name="respuesta-2" component="div" />
          <br/>
          <Field type="text" name="respuesta-3" placeholder="Respuesta 3"/>
          <ErrorMessage name="respuesta-3" component="div" />
          <br/>
          <label htmlFor="pregunta-2">Pregunta 2</label>
          <br/>
          <Field type="text" name="pregunta-2" />
          <ErrorMessage name="pregunta-2" component="div" />
          <br/>
          <Field type="text" name="respuesta-2-1" placeholder="Respuesta 1" />
          <ErrorMessage name="respuesta-2-1" component="div" />
          <br/>
          <Field type="text" name="respuesta-2-2" placeholder="Respuesta 2"/>
          <ErrorMessage name="respuesta-2-2" component="div" />
          <br/>
          <Field type="text" name="respuesta-2-3" placeholder="Respuesta 3"/>
          <ErrorMessage name="respuesta-2-3" component="div" />
          <br/>
          <label htmlFor="pregunta-3">Pregunta 3</label>
          <br/>
          <Field type="text" name="pregunta-3" />
          <ErrorMessage name="pregunta-3" component="div" />
          <br/>
          <Field type="text" name="respuesta-3-1" placeholder="Respuesta 1" />
          <ErrorMessage name="respuesta-3-1" component="div" />
          <br/>
          <Field type="text" name="respuesta-3-2" placeholder="Respuesta 2"/>
          <ErrorMessage name="respuesta-3-2" component="div" />
          <br/>
          <Field type="text" name="respuesta-3-3" placeholder="Respuesta 3"/>
          <ErrorMessage name="respuesta-3-3" component="div" />
          <br/>
          <label htmlFor="pregunta-4">Pregunta 4</label>
          <br/>
          <Field type="text" name="pregunta-4" />
          <ErrorMessage name="pregunta-4" component="div" />
          <br/>
          <Field type="text" name="respuesta-4-1" placeholder="Respuesta 1" />
          <ErrorMessage name="respuesta-4-1" component="div" />
          <br/>
          <Field type="text" name="respuesta-4-2" placeholder="Respuesta 2"/>
          <ErrorMessage name="respuesta-4-2" component="div" />
          <br/>
          <Field type="text" name="respuesta-4-3" placeholder="Respuesta 3"/>
          <ErrorMessage name="respuesta-4-3" component="div" />
          <br/>
          <label htmlFor="pregunta-1">Pregunta 5</label>
          <br/>
          <Field type="text" name="pregunta-5" />
          <ErrorMessage name="pregunta-5" component="div" />
          <br/>
          <Field type="text" name="respuesta-5-1" placeholder="Respuesta 1" />
          <ErrorMessage name="respuesta-5-1" component="div" />
          <br/>
          <Field type="text" name="respuesta-5-2" placeholder="Respuesta 2"/>
          <ErrorMessage name="respuesta-5-2" component="div" />
          <br/>
          <Field type="text" name="respuesta-5-3" placeholder="Respuesta 3"/>
          <ErrorMessage name="respuesta-5-3" component="div" />
          <br/>
          <label htmlFor="pregunta-6">Pregunta 6</label>
          <br/>
          <Field type="text" name="pregunta-6" />
          <ErrorMessage name="pregunta-6" component="div" />
          <br/>
          <Field type="text" name="respuesta-6-1" placeholder="Respuesta 1" />
          <ErrorMessage name="respuesta-6-1" component="div" />
          <br/>
          <Field type="text" name="respuesta-6-2" placeholder="Respuesta 2"/>
          <ErrorMessage name="respuesta-6-2" component="div" />
          <br/>
          <Field type="text" name="respuesta-6-3" placeholder="Respuesta 3"/>
          <ErrorMessage name="respuesta-6-3" component="div" />
          <br/>
          <label htmlFor="pregunta-7">Pregunta 7</label>
          <br/>
          <Field type="text" name="pregunta-7" />
          <ErrorMessage name="pregunta-7" component="div" />
          <br/>
          <Field type="text" name="respuesta-7-1" placeholder="Respuesta 1" />
          <ErrorMessage name="respuesta-7-1" component="div" />
          <br/>
          <Field type="text" name="respuesta-7-2" placeholder="Respuesta 2"/>
          <ErrorMessage name="respuesta-7-2" component="div" />
          <br/>
          <Field type="text" name="respuesta-7-3" placeholder="Respuesta 3"/>
          <ErrorMessage name="respuesta-7-3" component="div" />
          <br/>
          <label htmlFor="pregunta-8">Pregunta 8</label>
          <br/>
          <Field type="text" name="pregunta-8" />
          <ErrorMessage name="pregunta-8" component="div" />
          <br/>
          <Field type="text" name="respuesta-8-1" placeholder="Respuesta 1" />
          <ErrorMessage name="respuesta-8-1" component="div" />
          <br/>
          <Field type="text" name="respuesta-8-2" placeholder="Respuesta 2"/>
          <ErrorMessage name="respuesta-8-2" component="div" />
          <br/>
          <Field type="text" name="respuesta-8-3" placeholder="Respuesta 3"/>
          <ErrorMessage name="respuesta-8-3" component="div" />
          <br/>
          <label htmlFor="pregunta-9">Pregunta 9</label>
          <br/>
          <Field type="text" name="pregunta-9" />
          <ErrorMessage name="pregunta-9" component="div" />
          <br/>
          <Field type="text" name="respuesta-9-1" placeholder="Respuesta 1" />
          <ErrorMessage name="respuesta-9-1" component="div" />
          <br/>
          <Field type="text" name="respuesta-9-2" placeholder="Respuesta 2"/>
          <ErrorMessage name="respuesta-9-2" component="div" />
          <br/>
          <Field type="text" name="respuesta-9-3" placeholder="Respuesta 3"/>
          <ErrorMessage name="respuesta-9-3" component="div" />
          <br/>
          <label htmlFor="pregunta-102-">Pregunta 10</label>
          <br/>
          <Field type="text" name="pregunta-10" />
          <ErrorMessage name="pregunta-10" component="div" />
          <br/>
          <Field type="text" name="respuesta-10-1" placeholder="Respuesta 1" />
          <ErrorMessage name="respuesta-10-1" component="div" />
          <br/>
          <Field type="text" name="respuesta-10-2" placeholder="Respuesta 2"/>
          <ErrorMessage name="respuesta-10-2" component="div" />
          <br/>
          <Field type="text" name="respuesta-10-3" placeholder="Respuesta 3"/>
          <ErrorMessage name="respuesta-10-3" component="div" />
          <br/>
          <button type="submit" disabled={isSubmitting}>
            Guardar
          </button>
          <br/>
        </Form>
      )}
    </Formik>
  </div>
  )
}

export default Cuestionario