import Alumno from "C:/Users/jhan_/Documents/casosc-app/casos-clinicos-app/casos-clinicos-app/src/Modelo/Usuarios/Alumno";
import AdministradorUsuarios from "C:/Users/jhan_/Documents/casosc-app/casos-clinicos-app/casos-clinicos-app/src/Modelo/AdministrarUsuarios/AdministradorUsuarios";
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

export default class AdministradorAlumno extends AdministradorUsuarios {
  listaAlumnos = [];
  alumno;
  auth;
  db;
  user;

  constructor() {
    this.auth = getAuth(firebaseApp);
    this.db = getFirestore();
   
    this.alumno = new Alumno();
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
                //const roldata = doc.data().rol;
            })
      /*
      const ref = doc(this.db, "Alumno", this.user.uid).withConverter(this.alumnoConverter);
      const docSnap = await getDoc(ref);
      if (docSnap.exists()) {
        
        // Convert to City object
        
        this.alumno = docSnap.data();
        // Use a City instance method
        console.log("datos"+docSnap.data().toString());
      } else {
        console.log("No such document!");
      }*/
    } catch (error) {
      console.error(error);
    }

    return this.alumno;
  }

  extraerListaAlumno() {}

  // Firestore data converter
  alumnoConverter = {
    toFirestore: (alumno) => {
      return {
        edad: alumno.Edad,
        estudiosPrevios: alumno.EstudiosPrevios,
        fechaRegistro: alumno.FechaRegistro,
        matricula: alumno.Matricula,
        nrc: alumno.NRC,
        nombre: alumno.Nombre,
        numVecesTomadoMateria: alumno.NumVecesTomadoMateria,
        sexo: alumno.Sexo,
        email: alumno.correo,
        password: alumno.password,
        rol: alumno.rol,
        apellidoPaterno: alumno.ApellidoPaterno,
        apellidoMaterno: alumno.ApellidoMaterno,
      };
    },
    fromFirestore: (snapshot, options) => {
      const data = snapshot.data(options);
      return new Alumno(
        data.email,
        data.password,
        data.rol,
        data.nombre,
        data.apellidoPaterno,
        data.apellidoMaterno,
        data.edad,
        data.estudiosPrevios,
        data.fechaRegistro,
        data.matricula,
        data.nrc,
        data.numVecesTomadoMateria,
        data.sexo
      );
    },
  };
}
