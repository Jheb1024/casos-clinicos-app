import Alumno from "C:/Users/jhan_/Documents/casosc-app/casos-clinicos-app/casos-clinicos-app/src/Modelo/Usuarios/Alumno";
import AdministradorUsuario from "C:/Users/jhan_/Documents/casosc-app/casos-clinicos-app/casos-clinicos-app/src/Modelo/AdministrarUsuarios/AdministradorUsuario";
import {
  doc,
  getDoc,
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import firebaseApp from "C:/Users/jhan_/Documents/casosc-app/casos-clinicos-app/casos-clinicos-app/src/Firebase/firebase-config.js";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default class AdministradorAlumno extends AdministradorUsuario {
  listaAlumnos = [];
  alumno;
  auth;
  db;
  user;

  constructor() {
      super();
    this.auth = getAuth(firebaseApp);
    this.db = getFirestore();
   
    
  }

  registrar(){
    let registrado = false;
    //Aqui debemos poner el registro
    return registrado;
  }
  actualizar(){
    throw new Error("Method not implemented.");
  }
  remover(){
    throw new Error("Method not implemented.");
  }

  async extraer(uid) {
    this.user = this.auth.currentUser;
    try {
      const docRef = doc(this.db, "Alumno", this.user.uid);

            getDoc(docRef).then((doc) => {
              //this.alumno = doc.data();
              
                console.log(doc.data());
                this.alumno = new Alumno(doc.data().email,
                                            doc.data().password,
                                            doc.data().rol,
                                            doc.data().Nombre,
                                            doc.data().ApellidoPaterno,
                                            doc.data().ApellidoMaterno,
                                            doc.data().Edad,
                                            doc.data().EstudiosPrevios,
                                            doc.data().FechaRegistro,
                                            doc.data().Matricula,
                                            doc.data().NRC,
                                            doc.data().NumVecesTomadoMateria,
                                            doc.data().Sexo);
                console.log(this.alumno);
                //const roldata = doc.data().rol;

            })
    
    } catch (error) {
      console.error(error);
    }

    return this.alumno;
  }

  extraerListaAlumno() {}

}