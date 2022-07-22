import {
    doc,
    getFirestore,
    collection,
    query,
    where,
    getDocs,
    deleteDoc,
    updateDoc
  } from "firebase/firestore";
  import Docente from "../Usuarios/Docente";
  import firebaseApp from "../../Firebase/firebase-config";
  import { getAuth, updatePassword } from "firebase/auth";
  import AdministradorUsuario from "../AdministrarUsuarios/AdministradorUsuario";
  
  export default class AdministradorDocente extends AdministradorUsuario {
    auth;
    db;
    user;
  
    constructor() {
      super();
      this.auth = getAuth(firebaseApp);
      this.db = getFirestore(firebaseApp);
    }
    async getAllDocentes() {
      const docentes = [];
      const collectionRef = query(
        collection(this.db, "Docentes").withConverter(docenteConverter)
      );
  
      const q = query(collectionRef);
      const snapshot = await getDocs(q);
      snapshot.forEach((doc) => {
        docentes.push(doc.data());
        console.log(doc.data());
      });
  
      return docentes;
    }
    //Función principal de busqueda para la lista de alumnos en admi
    async busquedaAdministradorDocente(criterioBusqueda, claveBusqueda) {
      let docusFiltradoF = [];
      switch (criterioBusqueda) {
        case "1":
          docusFiltradoF = await buscarDocentePorApellidoP(this.db, claveBusqueda);
          break;
        case "2":
          docusFiltradoF = await buscarDocentePorNombre(this.db, claveBusqueda);
          break;
        case "3":
          docusFiltradoF = await buscarDocentePorID(this.db, claveBusqueda);
          break;
        default:
          break;
      }
      return docusFiltradoF;
    }
    //Para borrar un docente, desde el perfil del admi
    async borrarDocenteAd(id) {
        console.log("Es docente");
        const collectionRefD = collection(this.db, "Docente");
        const docRefD = doc(collectionRefD, id);
        await deleteDoc(docRefD)
          .then(() => {
            console.log("El docente ha sido eliminado");
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
    //Para editar datos del docente
    async editarDocente(MatriculaN, NombreN, ApellidoPN, ApellidoMN, idN) {
        const collectionRefD = collection(this.db, "Docente");
        const docRefD = doc(collectionRefD, idN);
        await updateDoc(docRefD, {
          Nombre: NombreN,
          ApellidoPaterno: ApellidoPN,
          ApellidoMaterno: ApellidoMN,
          Matricula: MatriculaN,
        })
          .then(() => {
            return "1";
          })
          .catch((error) => {
            console.error(error);
            return error;
          });
    }
  
  }//Fin clase
  //Buscar un alumno por el apellido paterno, desde el pefil del admi
  async function buscarDocentePorApellidoP(base, claveBusqueda) {
    let docusFiltrado = [];
    const collecionRef = collection(base, "Docente");
    const q = query(collecionRef, where("ApellidoPaterno", "==", claveBusqueda));
    const querySnapshot = await Promise.all([getDocs(q)]);
    querySnapshot.forEach((snapshot) => {
      snapshot.forEach((doc) => {
        docusFiltrado.push(doc.data());
      });
    });
    return docusFiltrado;
  }
  //Buscar un docente por el nombre, desde el pefil del admi
  async function buscarDocentePorNombre(base, claveBusqueda) {
    let docusFiltrado = [];
    const collecionRef = collection(base, "Docente");
    const q = query(collecionRef, where("Nombre", "==", claveBusqueda));
    const querySnapshot = await Promise.all([getDocs(q)]);
    querySnapshot.forEach((snapshot) => {
      snapshot.forEach((doc) => {
        docusFiltrado.push(doc.data());
      });
    });
    return docusFiltrado;
  }
  //Buscar un docente por el apellido paterno, desde el pefil del admi
  async function buscarDocentePorID(base, claveBusqueda) {
    let docusFiltrado = [];
    const collecionRef = collection(base, "Docente");
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
  const docenteConverter = {
    toFirestore: (docente) => {
      return {
        email: docente.correo,
        password: docente.password,
        rol: docente.rol,
        edad: docente.Edad,
        fechaRegistro: docente.FechaRegistro,
        matricula: docente.Matricula,
        id: docente.id,
        nombre: docente.Nombre,
        sexo: docente.Sexo,
        apellidoPaterno: docente.ApellidoPaterno,
        apellidoMaterno: docente.ApellidoMaterno
      };
    },
    fromFirestore: (snapshot, options) => {
      const data = snapshot.data(options);
      return new Docente(
        data.correo,
        data.password,
        data.rol,
        data.Nombre,
        data.ApellidoPaterno,
        data.ApellidoMaterno,
        data.Edad,
        data.id,
        data.FechaRegistro,
        data.Matricula,
        data.Sexo
      );
    },
  };

  export async function verificarMatriculaDocente(matricula){
    let repetido;

    const q = query(collection(this.db, "Docente"), where("Matricula", "==", matricula));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        
        });

        if(querySnapshot.empty){
            repetido = false;
            console.log("Esta vacío")
        }else{
            repetido = true;
        }

    return repetido;
}

export async function actualizarPassword(password){ 
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