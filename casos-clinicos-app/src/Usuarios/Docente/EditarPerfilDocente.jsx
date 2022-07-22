import { Modal, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { doc, updateDoc, getFirestore} from "firebase/firestore";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { verificarMatriculaDocente } from "../../Componentes/Registro/funcRegistroDocente"
import Swal from "sweetalert2";
import './EditarPerfilDocente.css'
import { actualizarPassword } from "../../Modelo/AdministrarUsuarios/AdministradorDocente";

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
    
    function mostrarContrasena() {
      var tipo = document.getElementById("password");
      console.log("tipo", tipo.type);
      if (tipo.type === "password") {
        tipo.type = "text";
      } else {
        tipo.type = "password";
      }
    }



  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const db = getFirestore();
  async function guardarPerfil(
    nombre,
    apellidoPaterno,
    apellidoMaterno,
    edad,
    matricula,
    SelectSexo,
    password
  ){
    console.log("uid from editarpefil : ")
    console.log(uid);
    if(matricula === perfil.Matricula){

      const docuRef = doc(db, "Docente", uid);
        await updateDoc(docuRef, {
            Nombre :nombre,
            ApellidoPaterno: apellidoPaterno,
            ApellidoMaterno: apellidoMaterno,
            Edad: edad,
            Matricula: matricula,
            Sexo:SelectSexo,
            password: password,
        }).then(()=>{

          actualizarPassword(password).then(()=>{
            new Swal({
            icon: 'success',
            title: 'Registro.',
            text: 'Se han actualizado los datos'
        }); setShow(false);
          })
          
        })
       

    }else{
      const matriculaRepetida = await verificarMatriculaDocente(matricula);
        console.log(matriculaRepetida)
        if(matriculaRepetida){
            console.log("La matricula está en uso por otro usuario, si eres el propietario por favor comunicate con el administrador");
            new Swal({
                icon: 'warning',
                title: 'Matricula en uso.',
                text: 'La matricula está en uso por otro usuario, si eres el propietario por favor comunícate con el administrador.'
            });
        }
    }
    
        
      
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
        nombre: perfil.Nombre,
        apellidoPaterno: perfil.ApellidoPaterno,
        apellidoMaterno: perfil.ApellidoMaterno,
        edad: perfil.Edad,
        matricula: perfil.Matricula,
        SelectSexo: perfil.Sexo,
        password: perfil.password
       }}
       validate={values => {
         const errors = {};
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
          if (!values.password) {
            errors.password = "Campo requerido";
          } else if (!/^[A-Za-z0-9]{7}$/.test(values.password)) {
            errors.password =
              "Su contraseña solo puede tener números y letras, sin espacios.";
          } else if (
            values.password.length < 7 ||
            values.password.length > 7
          ) {
            errors.password =
              "Su contraseña debe de tener 7 elementos.Sin espacios!";
          }
         return errors;
       }
      }
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
                values.SelectSexo,
                values.password,
                
                
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
        
        <Form
        className="row g-3"
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
            name="nombre"
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
            name="apellidoPaterno"
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
            name="apellidoMaterno"
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
            name="edad"
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
            name="matricula"
          />
          <ErrorMessage
            name="matricula"
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
                  <label className="form-label" htmlFor="password">
                    Contraseña
                  </label>
                  <Field
                    type="password"
                    className="form-control"
                    name="password"
                    id="password"
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
        <Modal.Footer>
          
        </Modal.Footer>
      </Modal>
    </>
  );
}
 export default EditarPerfil;