import { Modal, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { doc, updateDoc, getFirestore} from "firebase/firestore";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Swal from "sweetalert2";
import './EditarPerfilDocente.css'

const EditarPerfil=({ Perfil , uid}) =>{
    console.log(Perfil);
  const [show, setShow] = useState(false);
  const [perfil, setPerfil] = useState(Perfil);
    useEffect(() => {
      
        setPerfil(Perfil);
    
      return () => {
        setPerfil(Perfil);
      }
    },  )
    



  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const db = getFirestore();
  async function guardarPerfil(
    nombre,
    apellidoPaterno,
    apellidoMaterno,
    edad,
    matricula,
    nrc,
    SelectSexo,
    email,
    password
  ){
    console.log("uid from editarpefil : ")
    console.log(uid);
    const docuRef = doc(db, "Docente", uid);

    await updateDoc(docuRef, {
        Nombre :nombre,
        ApellidoPaterno: apellidoPaterno,
        ApellidoMaterno: apellidoMaterno,
        Edad: edad,
        Matricula: matricula,
        NRC: nrc,
        Sexo:SelectSexo,
        corre:email,
        password:password
    });
     setShow(false);
  }

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Editar Perfil
      </Button>

      <Modal show={show} onHide={handleClose} animation={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar perfil</Modal.Title>
        </Modal.Header>
        <Modal.Body>

        <Formik

       initialValues={{
        email: perfil.correo,
        password: perfil.password,
        nombre: perfil.Nombre,
        apellidoPaterno: perfil.ApellidoPaterno,
        apellidoMaterno: perfil.ApellidoMaterno,
        edad: perfil.Edad,
        matricula: perfil.Matricula,
        nrc: perfil.NRC,
        SelectSexo: perfil.Sexo
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
       onSubmit={(values, { setSubmitting }) => {

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

              if (guardarPerfil(values.nombre,
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

                handleClose();

              }
            }else{
                handleClose();
            }
          })
         
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
           <br></br>
           <Button variant="primary"  type="submit" disabled={isSubmitting}>
             Actualizar
           </Button>
           <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
         </Form>
       )}
     </Formik>
        </Modal.Body>
        <Modal.Footer>
          
        </Modal.Footer>
      </Modal>
    </>
  );
}
 export default EditarPerfil;