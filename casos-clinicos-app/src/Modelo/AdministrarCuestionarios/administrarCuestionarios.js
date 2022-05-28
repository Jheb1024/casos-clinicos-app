import firebaseApp from "../../Firebase/firebase-config";
import {addDoc,collection,getFirestore,doc,getDoc,updateDoc,  
  deleteDoc,getDocs,runTransaction,  query,where} from "firebase/firestore";

const db = getFirestore(firebaseApp);

//Para registrar tema
export async function registrarTema(tema) {
 const temaRegistrado = await addDoc(collection(db, "Temas"), {
    Tema: tema,
  }).then((tema) => {
    const temaDoc = doc(db, "Temas", tema.id);
   updateDoc(temaDoc,{
      idTema : tema.id
    }).then(()=>{
      console.log("idTema actualizado");
    })
    console.log("Tema registrado");
  });

    
  
}
//Para editar tema
//Al editar un tema, los cambios repercuten en el subtema
//cambios en el cuestionario
export async function editarTemaAdmin(temaNuevo, tema, idTema) {
  const temaTemp = tema;
  const cuestionarioRef = doc(db, "Temas", idTema);
  const temaEditado = await updateDoc(cuestionarioRef, {
    Tema: temaNuevo,
  })
    .then(() => {
      console.log("El tema ha sido actualizado");
    })
    .catch((error) => {
      console.error(error);
    });
  let temaSubtemaEditado;

  if (temaEditado !== null) {
    const querySnapshot = await getDocs(collection(db, "Subtemas"));
    if (querySnapshot.size > 0) {
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        if (doc.data().Tema === temaTemp) {
          actualizarTemaCadaSubtema(doc.id, temaNuevo, tema).then(
            () => (temaSubtemaEditado = true)
          );
        }
      });
    }
  } else {
    console.log("vemos porque no entra al if");
  }
}

//para actualizar cada subtema encontrado con el mismo tema
async function actualizarTemaCadaSubtema(id, nuevoTema, tema) {
  const sfDocRef = doc(db, "Subtemas", id);

  try {
    await runTransaction(db, async (transaction) => {
      const sfDoc = await transaction.get(sfDocRef);
      if (!sfDoc.exists()) {
        throw "Document does not exist!";
      } else {
        const subtembasActualizados = transaction.update(sfDocRef, {
          Tema: nuevoTema,
        });
        console.log("Subtemas actualizados con el tema");
        if (subtembasActualizados !== null) {
          const q = query(
            collection(db, "Cuestionarios"),
            where("Tema", "==", tema)
          );
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            actualizarTemaCuestionario(doc.id, nuevoTema);
          });
        }
      }
    });
  } catch (e) {
    console.error(e);
  }
}
//Para actualizar cada cuestionario con el mismo tema

async function actualizarTemaCuestionario(id, nuevoTema) {
  const sfDocRef = doc(db, "Cuestionarios", id);

  try {
    await runTransaction(db, async (transaction) => {
      const sfDoc = await transaction.get(sfDocRef);
      if (!sfDoc.exists()) {
        throw "Document does not exist!";
      } else {
        transaction.update(sfDocRef, { Tema: nuevoTema });
        console.log("Cuestionarios actualizados con el tema");
        
      }
    });
  } catch (e) {
    console.error(e);
  }
}

//Para borrar Tema ... existen advertencias al eliminar un tema
export async function borrarTemaAdmin(tema, id){
  let subtemaBorrado;
  //Borramos el tema
  const temaBorrado = await deleteDoc(doc(db, "Temas", id)).then(()=>{
    console.log("El tema ha sido eliminado");
  })
  
  //Borramos los subtemas del tema
  if(temaBorrado !== null){
    const q = query(collection(db, "Subtemas"),where("Tema", "==", tema));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      //console.log(doc.id, " => ", doc.data());
     borrarTemaSubtema(doc.id);
    });
    subtemaBorrado = true;
  }

  //Borramos los cuestionarios del tema
  if(subtemaBorrado === true){
    const q = query(collection(db, "Cuestionarios"),where("Tema", "==", tema));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    //console.log(doc.id, " => ", doc.data());
    eliminarCuestionarioTema(doc.id);
  });
  }
}
//Borramos cada subtema que contenga el tema
async function borrarTemaSubtema(id){
 await deleteDoc(doc(db, "Subtemas", id)).then(()=>{
    console.log("El subtema ha sido eliminado que era parte del tema");
  })
}

//Elimino todos los cuestionarios que tiene el mismo tema
async function eliminarCuestionarioTema(id){
  await deleteDoc(doc(db, "Cuestionarios", id)).then(()=>{
    console.log("El cuesitonario que contiene el tema han sido eliminados");
  })
  
}


//** Para registrar un nuevo subtema 
//*
// * 
// * @param {*} tema 
// * @param {*} subtema 
// */
export async function registrarSubtema(tema, subtema) {
 const subtemaRegistrado =  await addDoc(collection(db, "Subtemas"), {
    Tema: tema,
    Subtema: subtema,
  }).then((subtema) => {
   const subtemaDoc= doc(db, "Subtemas", subtema.id);
     updateDoc(subtemaDoc,{
      idSubtema : subtema.id
    }).then(()=>{
      console.log("idSubtema actualizado");
    })
    console.log("Subtema registrado");
  });
}

//Para editar un subtema
//Al editar un subtema existen cambios en un cuestionario
export async function editarSubtema(subtema, subtemaNuevo, idSubtema) {
  const subtemaTemp = subtema;

  const cuestionarioRef = doc(db, "Subtemas", idSubtema);
  await updateDoc(cuestionarioRef, {
    Subtema: subtemaNuevo,
  })
    .then(async() => {
      console.log("El subtema ha sido actualizado");
      const q = query(
        collection(db, "Cuestionarios"),
        where("Subtema", "==", subtema)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        actualizarSubtemaCuestionario(doc.id, subtemaNuevo);
      });

    })
    .catch((error) => {
      console.error(error);
    });
}
//para actualizar cada subtema en cada cuestionario
async function actualizarSubtemaCuestionario(id, nuevoSubtema){
  const sfDocRef = doc(db, "Cuestionarios", id);

  try {
    await runTransaction(db, async (transaction) => {
      const sfDoc = await transaction.get(sfDocRef);
      if (!sfDoc.exists()) {
        throw "Document does not exist!";
      } else {
        transaction.update(sfDocRef, { Subtema: nuevoSubtema });
        console.log("Cuestionarios actualizados con el subtema");
      }
    });
  } catch (e) {
    console.error(e);
  }
}

//Para borrar un subtema, advertencias si se borra
export async function borrarSubtemaAdmin(subtema, id){
  const temaBorrado = await deleteDoc(doc(db, "Subtemas", id)).then(()=>{
    console.log("El subtema ha sido eliminado");
  })
  if(temaBorrado !== null){
    const q = query(collection(db, "Cuestionarios"),where("Subtema", "==", subtema));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      borrarCuestionarioSubtema(doc.id)
    });
  }
}
//para borrar Cuestionario del subtema
async function borrarCuestionarioSubtema(id){
  await deleteDoc(doc(db, "Cuestionarios",id)).then(()=>{
    console.log("El cuestionario ha sido eliminado pertenenciente al tema");
  })
}

//Clase de un docente
class Docente {
  constructor(name, matricula, apellidoPaterno, apellidoMaterno) {
    this.name = name;
    this.apellidoPaterno = apellidoPaterno;
    this.apellidoMaterno = apellidoMaterno;
    this.matricula = matricula;
  }
  toString() {
    return this.name + ", " + this.apellidoPaterno + ", " + this.matricula;
  }
}
// Firestore data converter
const docenteConverter = {
  toFirestore: (docente) => {
    return {
      name: docente.name,
      apellidoPaterno: docente.apellidoPaterno,
      apellidoMaterno: docente.apellidoMaterno,
      matricula: docente.matricula,
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new Docente(
      data.Nombre,
      data.Matricula,
      data.ApellidoPaterno,
      data.ApellidoMaterno
    );
  },
};

//Para registrar un nuevo cuestionario. Datos: preguntas, respuestas, tema, subtmea, usuario
export async function registrarNuevoCuestionario(cuestionario, data, user) {
  //Para obtener información del docente que crea el custionario
  const refDocente = doc(db, "Docente", user.uid).withConverter(
    docenteConverter
  );

  const docSnapDocente = await getDoc(refDocente);
  if (docSnapDocente.exists()) {
    const docente = docSnapDocente.data();
    console.log(docente.toString());
    const cuestionarioAgregado = await addDoc(collection(db, "Cuestionarios"), {
      Autor: docente.name + " " + docente.apellidoPaterno,
      AutorMatricula: docente.matricula,
      AutorId: user.uid,
      Tema: data.Tema,
      Subtema: data.Subtema,
      Titulo: cuestionario.Titulo,
      pregunta_1: cuestionario.pregunta_1,
      respuesta_1: cuestionario.respuesta_1,
      respuesta_2: cuestionario.respuesta_2,
      respuesta_3: cuestionario.respuesta_3,
      respuestaCorrectaP1: cuestionario.respuestaCorrectaP1,
      pregunta_2: cuestionario.pregunta_2,
      respuesta_2_1: cuestionario.respuesta_2_1,
      respuesta_2_2: cuestionario.respuesta_2_2,
      respuesta_2_3: cuestionario.respuesta_2_3,
      respuestaCorrectaP2: cuestionario.respuestaCorrectaP2,
      pregunta_3: cuestionario.pregunta_3,
      respuesta_3_1: cuestionario.respuesta_3_1,
      respuesta_3_2: cuestionario.respuesta_3_2,
      respuesta_3_3: cuestionario.respuesta_3_3,
      respuestaCorrectaP3: cuestionario.respuestaCorrectaP3,
      pregunta_4: cuestionario.pregunta_4,
      respuesta_4_1: cuestionario.respuesta_4_1,
      respuesta_4_2: cuestionario.respuesta_4_2,
      respuesta_4_3: cuestionario.respuesta_4_3,
      respuestaCorrectaP4: cuestionario.respuestaCorrectaP4,
      pregunta_5: cuestionario.pregunta_5,
      respuesta_5_1: cuestionario.respuesta_5_1,
      respuesta_5_2: cuestionario.respuesta_5_2,
      respuesta_5_3: cuestionario.respuesta_5_3,
      respuestaCorrectaP5: cuestionario.respuestaCorrectaP5,
      pregunta_6: cuestionario.pregunta_6,
      respuesta_6_1: cuestionario.respuesta_6_1,
      respuesta_6_2: cuestionario.respuesta_6_2,
      respuesta_6_3: cuestionario.respuesta_6_3,
      respuestaCorrectaP6: cuestionario.respuestaCorrectaP6,
      pregunta_7: cuestionario.pregunta_7,
      respuesta_7_1: cuestionario.respuesta_7_1,
      respuesta_7_2: cuestionario.respuesta_7_2,
      respuesta_7_3: cuestionario.respuesta_7_3,
      respuestaCorrectaP7: cuestionario.respuestaCorrectaP7,
      pregunta_8: cuestionario.pregunta_8,
      respuesta_8_1: cuestionario.respuesta_8_1,
      respuesta_8_2: cuestionario.respuesta_8_2,
      respuesta_8_3: cuestionario.respuesta_8_3,
      respuestaCorrectaP8: cuestionario.respuestaCorrectaP8,
      pregunta_9: cuestionario.pregunta_9,
      respuesta_9_1: cuestionario.respuesta_9_1,
      respuesta_9_2: cuestionario.respuesta_9_2,
      respuesta_9_3: cuestionario.respuesta_9_3,
      respuestaCorrectaP9: cuestionario.respuestaCorrectaP9,
      pregunta_10: cuestionario.pregunta_10,
      respuesta_10_1: cuestionario.respuesta_10_1,
      respuesta_10_2: cuestionario.respuesta_10_2,
      respuesta_10_3: cuestionario.respuesta_10_3,
      respuestaCorrectaP10: cuestionario.respuestaCorrectaP10,
    }).then(() => {
      console.log("Cuestionario registrado");
    });

    if (cuestionarioAgregado) {
      const cuestionarioRef = doc(db, "Cuestionarios", cuestionarioAgregado.id);
      await updateDoc(cuestionarioRef, {
        idCuestionario: cuestionarioAgregado.id,
      }).then(() => {
        console.log("Cuestionario actualizado con el id");
      });
    }
  } else {
    console.log("No such document!");
  }
}

//Editar un cuestionario
export async function actualizarCuestionario(cuestionario, data) {
  if (cuestionario !== null) {
    const cuestionarioRef = doc(db, "Cuestionarios", data.idCuestionario);
    await updateDoc(cuestionarioRef, {
      Titulo: cuestionario.Titulo,
      pregunta_1: cuestionario.pregunta_1,
      respuesta_1: cuestionario.respuesta_1,
      respuesta_2: cuestionario.respuesta_2,
      respuesta_3: cuestionario.respuesta_3,
      respuestaCorrectaP1: cuestionario.respuestaCorrectaP1,
      pregunta_2: cuestionario.pregunta_2,
      respuesta_2_1: cuestionario.respuesta_2_1,
      respuesta_2_2: cuestionario.respuesta_2_2,
      respuesta_2_3: cuestionario.respuesta_2_3,
      respuestaCorrectaP2: cuestionario.respuestaCorrectaP2,
      pregunta_3: cuestionario.pregunta_3,
      respuesta_3_1: cuestionario.respuesta_3_1,
      respuesta_3_2: cuestionario.respuesta_3_2,
      respuesta_3_3: cuestionario.respuesta_3_3,
      respuestaCorrectaP3: cuestionario.respuestaCorrectaP3,
      pregunta_4: cuestionario.pregunta_4,
      respuesta_4_1: cuestionario.respuesta_4_1,
      respuesta_4_2: cuestionario.respuesta_4_2,
      respuesta_4_3: cuestionario.respuesta_4_3,
      respuestaCorrectaP4: cuestionario.respuestaCorrectaP4,
      pregunta_5: cuestionario.pregunta_5,
      respuesta_5_1: cuestionario.respuesta_5_1,
      respuesta_5_2: cuestionario.respuesta_5_2,
      respuesta_5_3: cuestionario.respuesta_5_3,
      respuestaCorrectaP5: cuestionario.respuestaCorrectaP5,
      pregunta_6: cuestionario.pregunta_6,
      respuesta_6_1: cuestionario.respuesta_6_1,
      respuesta_6_2: cuestionario.respuesta_6_2,
      respuesta_6_3: cuestionario.respuesta_6_3,
      respuestaCorrectaP6: cuestionario.respuestaCorrectaP6,
      pregunta_7: cuestionario.pregunta_7,
      respuesta_7_1: cuestionario.respuesta_7_1,
      respuesta_7_2: cuestionario.respuesta_7_2,
      respuesta_7_3: cuestionario.respuesta_7_3,
      respuestaCorrectaP7: cuestionario.respuestaCorrectaP7,
      pregunta_8: cuestionario.pregunta_8,
      respuesta_8_1: cuestionario.respuesta_8_1,
      respuesta_8_2: cuestionario.respuesta_8_2,
      respuesta_8_3: cuestionario.respuesta_8_3,
      respuestaCorrectaP8: cuestionario.respuestaCorrectaP8,
      pregunta_9: cuestionario.pregunta_9,
      respuesta_9_1: cuestionario.respuesta_9_1,
      respuesta_9_2: cuestionario.respuesta_9_2,
      respuesta_9_3: cuestionario.respuesta_9_3,
      respuestaCorrectaP9: cuestionario.respuestaCorrectaP9,
      pregunta_10: cuestionario.pregunta_10,
      respuesta_10_1: cuestionario.respuesta_10_1,
      respuesta_10_2: cuestionario.respuesta_10_2,
      respuesta_10_3: cuestionario.respuesta_10_3,
      respuestaCorrectaP10: cuestionario.respuestaCorrectaP10,
    }).then(() => {
      console.log("Cuestionario actualizado...");
    });
  }
}

//para borrar el cuestionario especifico
export async function borrarCuestionarioDocente(id) {
  await deleteDoc(doc(db, "Cuestionarios", id)).then(() => {
    console.log("Cuestionario eliminado");
  });
}
