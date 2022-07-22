import Alumno from "../Usuarios/Alumno";
import AdministradorUsuario from "../AdministrarUsuarios/AdministradorUsuario";
import {
  doc,
  getDoc,
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import firebaseApp from "../../Firebase/firebase-config";
import { getAuth,updatePassword } from "firebase/auth";

export default class AdministradorAlumno extends AdministradorUsuario {
  listaAlumnos = [];
  alumno;
  auth;
  db;
  user;

  constructor() {
    super();
    this.auth = getAuth(firebaseApp);
    this.db = getFirestore(firebaseApp);
  }

  registrar() {
    let registrado = false;
    //Aqui debemos poner el registro
    return registrado;
  }

  async extraer(uid) {
    this.user = this.auth.currentUser;
    try {
      const docRef = doc(this.db, "Alumno", this.user.uid);

      getDoc(docRef).then((doc) => {
        //this.alumno = doc.data();

        console.log(doc.data());
        this.alumno = new Alumno(
          doc.data().email,
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
          doc.data().Sexo
        );
        console.log(this.alumno);
        //const roldata = doc.data().rol;
      });
    } catch (error) {
      console.error(error);
    }

    return this.alumno;
  }

  async getAllAlumnos() {
    const alumnos = [];
    const collectionRef = query(
      collection(this.db, "Alumno").withConverter(alumnoConverter)
    );
    const q = query(collectionRef);
    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => {
      alumnos.push(doc.data());
      console.log(doc.data());
    });
    console.log("Array en getAllAlumnos");
    console.log(alumnos);
    return alumnos;
  }
  //Función principal de busqueda para la lista de alumnos en docente
  async busquedaDocente(id, criterioBusqueda, claveBusqueda,alumnos) {
    let docusFiltradoF = [];
    switch (criterioBusqueda) {
      case "1":
        console.log("En case 1");
        docusFiltradoF = alumnos.filter(alumno => alumno.ApellidoPaterno === claveBusqueda);
        break;
      case "2":
        console.log("En case 2");
        docusFiltradoF = alumnos.filter(alumno => alumno.Nombre === claveBusqueda);
        break;
      case "3":
        console.log("En case 3");
        docusFiltradoF = alumnos.filter(alumno => alumno.Matricula === claveBusqueda);
        break;
      default:
        break;
    }
    return docusFiltradoF;
  }
  //Función principal de busqueda para la lista de alumnos en admi
  async busquedaAdministrador(criterioBusqueda, claveBusqueda) {
    let docusFiltradoF = [];
    switch (criterioBusqueda) {
      case "1":
        docusFiltradoF = await buscarAlumnoPorApellidoP(this.db, claveBusqueda);
        break;
      case "2":
        docusFiltradoF = await buscarAlumnoPorNombre(this.db, claveBusqueda);
        break;
      case "3":
        docusFiltradoF = await buscarAlumnoPorMatricula(this.db, claveBusqueda);
        break;
      default:
        break;
    }
    return docusFiltradoF;
  }
  //Para borrar un alumno, desde el perfil del admi
  async borrarAlumnoAd(id) {
    console.log("id del alumno que se eliminara:", id);
    const collectionRef = collection(this.db, "Alumno");
    const docRef = doc(collectionRef, id);
    await deleteDoc(docRef)
      .then(() => {
        console.log("El alumno ha sido eliminado");
        return "1";
      })
      .catch((error) => {
        console.error(error);
        return error;
      });
    //Tambien se tiene que eliminar en usuarios
    const collectionRefU = collection(this.db, "Usuarios");
    const docRefU = doc(collectionRefU, id);
    await deleteDoc(docRefU).then(() => {
      console.log("El alumno ha sido eliminado de Usuarios");
    });
  }
  //Para editar datos del alumno
  async editarAlumno(MatriculaN, NombreN, ApellidoPN, ApellidoMN, NRCN, idA) {
    console.log("id del alumno a editar editarAlumno()::", idA);
    const collectionRef = collection(this.db, "Alumno");
    const docRef = doc(collectionRef, idA);

    await updateDoc(docRef, {
      Nombre: NombreN,
      ApellidoPaterno: ApellidoPN,
      ApellidoMaterno: ApellidoMN,
      Matricula: MatriculaN,
      NRC: NRCN,
    })
      .then(() => {
        console.log("El alumno ha sido actualizado");
        return "1";
      })
      .catch((error) => {
        console.log("Error en catch");
        console.error(error);
        return error;
      });
  }
  async  verificarMatriculaAlumno(matricula){
    console.log('entramos a la funcion para verificar la matricula')
    let repetido;
  
    const q = query(collection(this.db, "Usuarios"), where("matricula", "==", matricula));
    //we should change matricula field from alumno to usuarios
  
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        });
  
        if(querySnapshot.empty){
            repetido = false;
            console.log("Esta vacío")
        }else{
            console.log("Encontró algo")
            repetido = true;
        }
  
    return repetido;
  }
  async  actualizarPasswordAlumno(password){ 
    const auth = getAuth();
  
  const user = auth.currentUser;
  const newPassword = password;
  
  await updatePassword(user, newPassword).then(() => {
    console.log('COntraseña actualizada')
  }).catch((error) => {
    // An error ocurred
    // ...
  });
  
  }
}
//Buscar un alumno por el apellido paterno, desde el pefil del admi
async function buscarAlumnoPorApellidoP(base, claveBusqueda) {
  let docusFiltrado = [];
  const collecionRef = collection(base, "Alumno");
  const q = query(collecionRef, where("ApellidoPaterno", "==", claveBusqueda));
  const querySnapshot = await Promise.all([getDocs(q)]);
  querySnapshot.forEach((snapshot) => {
    snapshot.forEach((doc) => {
      docusFiltrado.push(doc.data());
      console.log(doc.data())
    });
  });
  return docusFiltrado;
}
//Buscar un alumno por el nombre, desde el pefil del admi
async function buscarAlumnoPorNombre(base, claveBusqueda) {
  let docusFiltrado = [];
  const collecionRef = collection(base, "Alumno");
  const q = query(collecionRef, where("Nombre", "==", claveBusqueda));
  const querySnapshot = await Promise.all([getDocs(q)]);
  querySnapshot.forEach((snapshot) => {
    snapshot.forEach((doc) => {
      docusFiltrado.push(doc.data());
    });
  });
  return docusFiltrado;
}
//Buscar un alumno por el apellido paterno, desde el pefil del admi
async function buscarAlumnoPorMatricula(base, claveBusqueda) {
  let docusFiltrado = [];
  const collecionRef = collection(base, "Alumno");
  const q = query(collecionRef, where("Matricula", "==", claveBusqueda));
  const querySnapshot = await Promise.all([getDocs(q)]);
  querySnapshot.forEach((snapshot) => {
    snapshot.forEach((doc) => {
      docusFiltrado.push(doc.data());
    });
  });
  return docusFiltrado;
}

// Firestore data converter
const alumnoConverter = {
  toFirestore: (alumno) => {
    return {
      email: alumno.correo,
      password: alumno.password,
      rol: alumno.rol,
      edad: alumno.Edad,
      estudiosPrevios: alumno.EstudiosPrevios,
      fechaRegistro: alumno.FechaRegistro,
      matricula: alumno.Matricula,
      nrc: alumno.NRC,
      nombre: alumno.Nombre,
      numVecesTomadoMateria: alumno.NumVecesTomadoMateria,
      sexo: alumno.Sexo,
      apellidoPaterno: alumno.ApellidoPaterno,
      apellidoMaterno: alumno.ApellidoMaterno,
      avance: alumno.Avance,
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new Alumno(
      data.correo,
      data.password,
      data.rol,
      data.Nombre,
      data.ApellidoPaterno,
      data.ApellidoMaterno,
      data.Edad,
      data.EstudiosPrevios,
      data.FechaRegistro,
      data.Matricula,
      data.NRC,
      data.NumVecesTomadoMateria,
      data.Sexo,
      data.Avance
    );
  },
};


