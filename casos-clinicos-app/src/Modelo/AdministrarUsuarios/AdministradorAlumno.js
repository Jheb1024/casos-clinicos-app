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
  deleteDoc,
  updateDoc
} from "firebase/firestore";
import firebaseApp from "C:/Users/jhan_/Documents/casosc-app/casos-clinicos-app/casos-clinicos-app/src/Firebase/firebase-config.js";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Swal from "sweetalert2";

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

  extraerListaAlumno() { }
  async filtrarDatos(stringBusqueda) {
    const docusFiltrado = [];

    const collecionRef = collection(this.db, "Alumno");
    const queryNombre = query(
      collecionRef,
      where("Nombre", "==", stringBusqueda)
    );
    const queryApellidoP = query(collecionRef, where("ApellidoPaterno", "==", stringBusqueda));

    const arraySnapshots = await Promise.all([
      getDocs(queryNombre),
      getDocs(queryApellidoP),
    ]);

    arraySnapshots.forEach((snapshot) => {
      snapshot.forEach((doc) => {
        docusFiltrado.push(doc.data());
      });
    });
    return docusFiltrado;
  }
  async filtrarDatosU(stringBusqueda) {
    const docusFiltrado = [];

    const collecionRef = collection(this.db, "Alumno");
    const queryNombre = query(collecionRef,where("Nombre", "==", stringBusqueda));
    const queryApellidoP = query(collecionRef, where("ApellidoPaterno", "==", stringBusqueda));
    const queryRol = query(collecionRef, where("rol", "==", stringBusqueda));

    const collecionRefD = collection(this.db, "Docente");
    const queryNombreD = query(collecionRefD,where("Nombre", "==", stringBusqueda));
    const queryApellidoPD = query(collecionRefD, where("ApellidoPaterno", "==", stringBusqueda));
    const queryRolD = query(collecionRefD, where("rol", "==", stringBusqueda));

    const arraySnapshots = await Promise.all([
      getDocs(queryNombre),
      getDocs(queryApellidoP),
      getDocs(queryRol),
      getDocs(queryNombreD),
      getDocs(queryApellidoPD),
      getDocs(queryRolD)
    ]);

    arraySnapshots.forEach((snapshot) => {
      snapshot.forEach((doc) => {
        docusFiltrado.push(doc.data());
      });
    });
    return docusFiltrado;
  }
  async getNRCDocenteLogeado() {
    const auth = getAuth();
    const user = auth.currentUser;
    const alumnoDataNRC = "";
    const docente = [];
    if (user !== null) {

      const nrcD = user.NRC;
      const uid = user.uid;

      console.log("ID del docente logeado" + uid);
      const docRef = doc(this.db, "Docente", uid);
      let nrc=""
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        nrc=docSnap.data().NRC
        return nrc;
        console.log("NRC docente:", nrc);


      } else {
        // doc.data() will be undefined in this case
        console.log("Sin docente con ese id!");
      }


     /* const docRefD = doc(this.db, `Docente/${uid}`).getDoc();
      const queryNRC = query(docRefD);

      onSnapshot(queryNRC, (doc) => {
        const docenteData = doc.data();
        docente.push(docenteData);
        console.log("NRC docente logeado=>" );
      });*/
    }
   // return nrc;
  }

  async getAlumnosFiltroNRC(alumnoDataNRC) {

    const alumnos = [];
    console.log("docente logeado en funcion getAlumnos..." + alumnoDataNRC);

    //const collectionRef = query(collection(this.db, "Alumno").withConverter(alumnoConverter));
    const docRef = collection(this.db, `Alumno`);

    const q = query(docRef, where("NRC", "==", alumnoDataNRC));
    const arraySnapshots = await Promise.all(
      [getDocs(q)]);

    arraySnapshots.forEach((snapshot) => {
      snapshot.forEach((doc) => {
        alumnos.push(doc.data());
      });
    });

    return alumnos;
  }
  //No se utiliza esta funcion
  async getAllAlumnos() {
    const alumnos = [];
    const nrcD = "11111";
    const collectionRef = query(collection(this.db, "Alumno").withConverter(alumnoConverter));

    const q = query(collectionRef);
    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => {
      alumnos.push(doc.data());
      console.log(doc.data());
    });


    return alumnos;
  }

  async borrarUsuarioAd(id) {
    const coleccionRef = collection(this.db, "Alumno");
    const docuRef = doc(coleccionRef, id);
    if (docuRef.exists) {
      console.log("Es alumno");
      await deleteDoc(doc(this.db, "Alumno", id)).then(() => {
        console.log("El alumno ha sido eliminado");
        new Swal({
          position: 'top',
          icon: 'success',
          title: 'Alumno eliminado.',
          showConfirmButton: false,
          timer: 3000
        });
      }).catch((error) => {
        console.error(error);
        new Swal({
          position: 'top',
          icon: 'error',
          title: 'A ocurrido un error.',
          showConfirmButton: false,
          timer: 3000
        });
      });
      //Tambien se tiene que eliminar en usuarios
      await deleteDoc(doc(this.db, "Usuarios", id)).then(() => {
        console.log("El alumno ha sido eliminado de Usuarios");
      });
    } else {
      console.log("Es docente");
      await deleteDoc(doc(this.db, "Docente", id)).then(() => {
        console.log("El docente ha sido eliminado");
        new Swal({
          position: 'top',
          icon: 'success',
          title: 'Docente eliminado.',
          showConfirmButton: false,
          timer: 3000
        });
      }).catch((error) => {
        console.error(error);
        new Swal({
          position: 'top',
          icon: 'error',
          title: 'A ocurrido un error.',
          showConfirmButton: false,
          timer: 3000
        });
      });
      //Tambien se tiene que eliminar en usuarios
      await deleteDoc(doc(this.db, "Usuarios", id)).then(() => {
        console.log("El docente ha sido eliminado de Usuarios");
      });
    }
  }
  async borrarAlumnoAd(id) {
    console.log("id del alumno que se eliminara:", id);
    await deleteDoc(doc(this.db, "Alumno", id)).then(() => {
      console.log("El alumno ha sido eliminado");
      new Swal({
        position: 'top',
        icon: 'success',
        title: 'Alumno eliminado.',
        showConfirmButton: false,
        timer: 3000
      });
    }).catch((error) => {
      console.error(error);
      new Swal({
        position: 'top',
        icon: 'error',
        title: 'A ocurrido un error.',
        showConfirmButton: false,
        timer: 3000
      });
    });
    //Tambien se tiene que eliminar en usuarios
    await deleteDoc(doc(this.db, "Usuarios", id)).then(() => {
      console.log("El alumno ha sido eliminado de Usuarios");
    });
  }
  //Para editar datos del alumno
  async editarAlumno(MatriculaN, NombreN, ApellidoPN, ApellidoMN, NRCN, idN) {
    const db =getFirestore(firebaseApp);
    console.log("id del alumno a editar editarAlumno()::", idN);
    console.log("matricula:", MatriculaN);
    console.log("nombre:", NombreN);
    console.log("ApellidoP:", ApellidoPN);
    console.log("ApellidoM:", ApellidoMN);
    console.log("NRC:", NRCN);
    //const claseRef = doc(this.db, "Alumno", "6MOYgoNCK4VvousvsZHFM97QqN7");

    const coleccionRef = collection(db, "Alumno");
    const docuRef = doc(coleccionRef, idN);
    console.log("esto es la referencia del alumno",coleccionRef)
    await updateDoc(docuRef, {
      Nombre: NombreN,
      ApellidoPaterno: ApellidoPN,
      ApellidoMaterno: ApellidoMN,
      Matricula: MatriculaN,
      NRC: NRCN
    })
      .then(() => {
        console.log("El alumno ha sido actualizado");
      })
      .catch((error) => {
        console.log("Error en catch");
        console.error(error);
      });
  }
  //Para editar datos del usuario
   async  editarUsuario(MatriculaN, NombreN, ApellidoPN, ApellidoMN, idN) {

    
    console.log("id del alumno a editar editarAlumno()::", idN);
    console.log("matricula:", MatriculaN);
    console.log("nombre:", NombreN);
    console.log("ApellidoP:", ApellidoPN);
    console.log("ApellidoM:", ApellidoMN);
    
    const docRef = doc(this.db, "Alumno", idN);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data Alumno:", docSnap.data());
      const claseRef = doc(this.db, "Alumno", idN);
      await updateDoc(claseRef, {
        Nombre: NombreN,
        ApellidoPaterno: ApellidoPN,
        ApellidoMaterno: ApellidoMN,
        Matricula: MatriculaN,
      })
        .then(() => {
          console.log("El alumno ha sido actualizado");
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      // doc.data() will be undefined in this case
      console.log("Es docente");
      const claseRef = doc(this.db, "Docente", idN);
      await updateDoc(claseRef, {
        Nombre: NombreN,
        ApellidoPaterno: ApellidoPN,
        ApellidoMaterno: ApellidoMN,
        Matricula: MatriculaN,
      })
        .then(() => {
          console.log("El docente ha sido actualizado");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  async getAllUsuarios() {
    const usuarios = [];

    const collecionRefA = collection(this.db, "Alumno");
    const collecionRefD = collection(this.db, "Docente");
    const queryAlumno = query( collecionRefA);
    const queryDocente = query(collecionRefD);

    const arraySnapshots = await Promise.all([
      getDocs(queryAlumno),
      getDocs(queryDocente),
    ]);

    arraySnapshots.forEach((snapshot) => {
      snapshot.forEach((doc) => {
        usuarios.push(doc.data());
      });
    });
    return usuarios;
  }
//Falta por checar bien 
  async eliminarUsuario(usuario) {
    if(usuario.rol=="Alumno")
    {
      const coleccionRef = collection(this.db, "Alumno");
      const docuRef = doc(coleccionRef, usuario.uid);
      const eliminado = await deleteDoc(docuRef);
      return eliminado;
    }else{
      const coleccionRef = collection(this.db, "Docente");
      const docuRef = doc(coleccionRef, usuario.uid);
      const eliminado = await deleteDoc(docuRef);
      return eliminado;
    }
    
  }

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
      avance: alumno.Avance
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

}
