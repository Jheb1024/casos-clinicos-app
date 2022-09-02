import firebaseApp, { storage } from "../../Firebase/firebase-config";
import {
  addDoc, collection, getFirestore, doc, getDoc, updateDoc,
  deleteDoc, getDocs, runTransaction, query, where, arrayUnion, onSnapshot, increment, arrayRemove
} from "firebase/firestore";
import Swal from "sweetalert2";
import { ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";

const db = getFirestore(firebaseApp);

//Para registrar tema
export async function registrarTema(tema) {
  await addDoc(collection(db, "Temas"), {
    Tema: tema,
    TotalSubtemas: 0,
  }).then((tema) => {
    const temaDoc = doc(db, "Temas", tema.id);
    updateDoc(temaDoc, {
      idTema: tema.id
    }).then(() => {
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
export async function borrarTemaAdmin(tema, id) {
  let subtemaBorrado;
  //Borramos el tema
  const temaBorrado = await deleteDoc(doc(db, "Temas", id)).then(() => {
    console.log("El tema ha sido eliminado");
    new Swal({
      title: "Acción exitosa",
      text: "El tema ha sido borrado",
      icon: "success",
      showConfirmButton: false,
      timer: 3000
    });
  })

  //Borramos los subtemas del tema
  if (temaBorrado !== null) {
    const q = query(collection(db, "Subtemas"), where("Tema", "==", tema));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      //console.log(doc.id, " => ", doc.data());
      borrarTemaSubtema(doc.id);
    });
    subtemaBorrado = true;
  }

  //Borramos los cuestionarios del tema
  if (subtemaBorrado === true) {
    const q = query(collection(db, "Cuestionarios"), where("Tema", "==", tema));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      //console.log(doc.id, " => ", doc.data());
      eliminarCuestionarioTema(doc.id);
    });
  }
}
//Borramos cada subtema que contenga el tema
async function borrarTemaSubtema(id) {
  await deleteDoc(doc(db, "Subtemas", id)).then(() => {
    console.log("El subtema ha sido eliminado que era parte del tema");
  }).then(()=>{
    new Swal({
      title: "Acción exitosa",
      text: "Los subtemas han sido borrados",
      icon: "success",
      showConfirmButton: false,
      timer: 3000
    });
  })
}

//Elimino todos los cuestionarios que tiene el mismo tema
async function eliminarCuestionarioTema(id) {
  await deleteDoc(doc(db, "Cuestionarios", id)).then(() => {
    console.log("El cuesitonario que contiene el tema han sido eliminados");
  }).then(()=>{
      new Swal({
        title: "Acción exitosa",
        text: "Los cuestionarios han sido borrados",
        icon: "success",
        showConfirmButton: false,
        timer: 3000
      });
  })

}


//** Para registrar un nuevo subtema 
//*
// * 
// * @param {*} tema 
// * @param {*} subtema 
// */
export async function registrarSubtema(tema, subtema) {
   await addDoc(collection(db, "Subtemas"), {
    Tema: tema,
    Subtema: subtema,
  }).then((subtema) => {
    const subtemaDoc = doc(db, "Subtemas", subtema.id);
    updateDoc(subtemaDoc, {
      idSubtema: subtema.id
    }).then(() => {
      console.log("idSubtema actualizado");
    })
    console.log("Subtema registrado");
  });

  const ref = collection(db, "Temas");
  const q = query(ref, where("Tema", "==", tema));
  const querySnapshot = await getDocs(q);
  let idT = "";
  querySnapshot.forEach((doc) => {
    console.log("idTema::", doc.id);
    idT = doc.id;
  });
  const temaDoc = doc(db, "Temas", idT);
  updateDoc(temaDoc, {
    TotalSubtemas: increment(1),
  });

}

//Para editar un subtema
//Al editar un subtema existen cambios en un cuestionario
export async function editarSubtema(subtema, subtemaNuevo, idSubtema) {
  

  const cuestionarioRef = doc(db, "Subtemas", idSubtema);
  await updateDoc(cuestionarioRef, {
    Subtema: subtemaNuevo,
  })
    .then(async () => {
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
async function actualizarSubtemaCuestionario(id, nuevoSubtema) {
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
export async function borrarSubtemaAdmin(subtema, id, tema) {
  const temaBorrado = await deleteDoc(doc(db, "Subtemas", id)).then(() => {
    console.log("El subtema ha sido eliminado");
    
  })
  if (temaBorrado !== null) {
    const q = query(collection(db, "Cuestionarios"), where("Subtema", "==", subtema));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      borrarCuestionarioSubtema(doc.id)
    });
  }
  const ref = collection(db, "Temas");
  const q = query(ref, where("Tema", "==", tema));
  const querySnapshot = await getDocs(q);
  let idT = "";
  querySnapshot.forEach((doc) => {
    console.log("idTema::", doc.id);
    idT = doc.id;
  });
  const temaDoc = doc(db, "Temas", idT);
  updateDoc(temaDoc, {
    TotalSubtemas: increment(-1),
  }).then(()=>{
    new Swal({
      title: "Acción exitosa",
      text: "El subtema ha sido borrado. Seleccione el tema para ver los cambios",
      icon: "success",
      showConfirmButton: false,
      timer: 3000
    });
  })
}
//para borrar Cuestionario del subtema
async function borrarCuestionarioSubtema(id) {
  await deleteDoc(doc(db, "Cuestionarios", id)).then(() => {
    console.log("El cuestionario ha sido eliminado pertenenciente al tema");
  }).then(()=>{
    new Swal({
      title: "Acción exitosa",
      text: "Los cuestionarios han sido borrados. Seleccione el tema para ver los cambios",
      icon: "success",
      showConfirmButton: false,
      timer: 3000
    });
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
export function registrarNuevoCuestionario(cuestionario, data, user, imageUpload) {
  //Para obtener información del docente que crea el custionario
  let registrado;
  var imageRef;
  if (imageUpload !== null) {
    imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    uploadBytes(imageRef, imageUpload).then(() => {
      //alert("uploaded");
    });
    registrado = registrarCuestionarioConImagen(cuestionario, data, user, imageRef)

  } else {
    registrado = registrarCuestionarioSinImagen(cuestionario, data, user)
  }

  return registrado;
}

async function registrarCuestionarioSinImagen(cuestionario, data, user) {


  const refDocente = doc(db, "Docente", user.uid).withConverter(
    docenteConverter
  );
  let estaRegistrado = false;
  let registrado = null;

  const docSnapDocente = await getDoc(refDocente);
  if (docSnapDocente.exists()) {
    const docente = docSnapDocente.data();
    console.log(docente.toString());
     await addDoc(collection(db, "Cuestionarios"), {
      Autor: docente.name + " " + docente.apellidoPaterno,
      AutorMatricula: docente.matricula,
      AutorId: user.uid,
      imageRef: "images/noMoreInformation.png",
      Tema: data.Tema,
      Subtema: data.Subtema,
      Titulo: cuestionario.Titulo,
      Enunciado: cuestionario.Enunciado,
      pregunta_1: cuestionario.pregunta_1,
      respuesta_1: cuestionario.respuesta_1,
      respuesta_2: cuestionario.respuesta_2,
      respuesta_3: cuestionario.respuesta_3,
      respuesta_4: cuestionario.respuesta_4,
      respuestaCorrectaP1: cuestionario.respuestaCorrectaP1,
      valorResPregunta1:cuestionario.valorResPregunta1,
      pregunta_2: cuestionario.pregunta_2,
      respuesta_2_1: cuestionario.respuesta_2_1,
      respuesta_2_2: cuestionario.respuesta_2_2,
      respuesta_2_3: cuestionario.respuesta_2_3,
      respuesta_2_4: cuestionario.respuesta_2_4,
      respuestaCorrectaP2: cuestionario.respuestaCorrectaP2,
      valorResPregunta2:cuestionario.valorResPregunta2,
      pregunta_3: cuestionario.pregunta_3,
      respuesta_3_1: cuestionario.respuesta_3_1,
      respuesta_3_2: cuestionario.respuesta_3_2,
      respuesta_3_3: cuestionario.respuesta_3_3,
      respuesta_3_4: cuestionario.respuesta_3_4,
      respuestaCorrectaP3: cuestionario.respuestaCorrectaP3,
      valorResPregunta3:cuestionario.valorResPregunta3,
      pregunta_4: cuestionario.pregunta_4,
      respuesta_4_1: cuestionario.respuesta_4_1,
      respuesta_4_2: cuestionario.respuesta_4_2,
      respuesta_4_3: cuestionario.respuesta_4_3,
      respuesta_4_4: cuestionario.respuesta_4_4,
      respuestaCorrectaP4: cuestionario.respuestaCorrectaP4,
      valorResPregunta4:cuestionario.valorResPregunta4,
      pregunta_5: cuestionario.pregunta_5,
      respuesta_5_1: cuestionario.respuesta_5_1,
      respuesta_5_2: cuestionario.respuesta_5_2,
      respuesta_5_3: cuestionario.respuesta_5_3,
      respuesta_5_4: cuestionario.respuesta_5_4,
      respuestaCorrectaP5: cuestionario.respuestaCorrectaP5,
      valorResPregunta5:cuestionario.valorResPregunta5,
      pregunta_6: cuestionario.pregunta_6,
      respuesta_6_1: cuestionario.respuesta_6_1,
      respuesta_6_2: cuestionario.respuesta_6_2,
      respuesta_6_3: cuestionario.respuesta_6_3,
      respuesta_6_4: cuestionario.respuesta_6_4,
      respuestaCorrectaP6: cuestionario.respuestaCorrectaP6,
      valorResPregunta6:cuestionario.valorResPregunta6,
      pregunta_7: cuestionario.pregunta_7,
      respuesta_7_1: cuestionario.respuesta_7_1,
      respuesta_7_2: cuestionario.respuesta_7_2,
      respuesta_7_3: cuestionario.respuesta_7_3,
      respuesta_7_4: cuestionario.respuesta_7_4,
      respuestaCorrectaP7: cuestionario.respuestaCorrectaP7,
      valorResPregunta7:cuestionario.valorResPregunta7,
      pregunta_8: cuestionario.pregunta_8,
      respuesta_8_1: cuestionario.respuesta_8_1,
      respuesta_8_2: cuestionario.respuesta_8_2,
      respuesta_8_3: cuestionario.respuesta_8_3,
      respuesta_8_4: cuestionario.respuesta_8_4,
      respuestaCorrectaP8: cuestionario.respuestaCorrectaP8,
      valorResPregunta8:cuestionario.valorResPregunta8,
      pregunta_9: cuestionario.pregunta_9,
      respuesta_9_1: cuestionario.respuesta_9_1,
      respuesta_9_2: cuestionario.respuesta_9_2,
      respuesta_9_3: cuestionario.respuesta_9_3,
      respuesta_9_4: cuestionario.respuesta_9_4,
      respuestaCorrectaP9: cuestionario.respuestaCorrectaP9,
      valorResPregunta9:cuestionario.valorResPregunta9,
      pregunta_10: cuestionario.pregunta_10,
      respuesta_10_1: cuestionario.respuesta_10_1,
      respuesta_10_2: cuestionario.respuesta_10_2,
      respuesta_10_3: cuestionario.respuesta_10_3,
      respuesta_10_4: cuestionario.respuesta_10_4,
      respuestaCorrectaP10: cuestionario.respuestaCorrectaP10,
      valorResPregunta10:cuestionario.valorResPregunta10,
    }).then((cuestionario) => {
      console.log("Cuestionario registrado");
      registrado = cuestionario;

    });


    //necesitamos hacer una nueva consulta  a la base de datos para poder obtener su id una doble consulta
    if (registrado) {
      console.log(registrado)
      const cuestionarioRef = doc(db, "Cuestionarios", registrado.id);
      await updateDoc(cuestionarioRef, {
        idCuestionario: registrado.id,
      }).then(() => {
        console.log("Cuestionario actualizado con el id");
        estaRegistrado = true;
        new Swal({
          title: "Acción exitosa",
          text: "El cuestionario ha sido registrado.",
          icon: "success",
          showConfirmButton: false,
          timer: 3000
      })
      });
    }
  } else {
    console.log("No such document!");
  }
  return estaRegistrado;
}
async function registrarCuestionarioConImagen(cuestionario, data, user, imageRef) {
  const refDocente = doc(db, "Docente", user.uid).withConverter(
    docenteConverter
  );
  let estaRegistrado = false;
  let registrado = null;
  const docSnapDocente = await getDoc(refDocente);
  if (docSnapDocente.exists()) {
    const docente = docSnapDocente.data();
    console.log(docente.toString());
     await addDoc(collection(db, "Cuestionarios"), {
      Autor: docente.name + " " + docente.apellidoPaterno,
      AutorMatricula: docente.matricula,
      AutorId: user.uid,
      imageRef: imageRef.fullPath,
      Tema: data.Tema,
      Subtema: data.Subtema,
      Titulo: cuestionario.Titulo,
      Enunciado: cuestionario.Enunciado,
      pregunta_1: cuestionario.pregunta_1,
      respuesta_1: cuestionario.respuesta_1,
      respuesta_2: cuestionario.respuesta_2,
      respuesta_3: cuestionario.respuesta_3,
      respuesta_4: cuestionario.respuesta_4,
      respuestaCorrectaP1: cuestionario.respuestaCorrectaP1,
      pregunta_2: cuestionario.pregunta_2,
      respuesta_2_1: cuestionario.respuesta_2_1,
      respuesta_2_2: cuestionario.respuesta_2_2,
      respuesta_2_3: cuestionario.respuesta_2_3,
      respuesta_2_4: cuestionario.respuesta_2_4,
      respuestaCorrectaP2: cuestionario.respuestaCorrectaP2,
      pregunta_3: cuestionario.pregunta_3,
      respuesta_3_1: cuestionario.respuesta_3_1,
      respuesta_3_2: cuestionario.respuesta_3_2,
      respuesta_3_3: cuestionario.respuesta_3_3,
      respuesta_3_4: cuestionario.respuesta_3_4,
      respuestaCorrectaP3: cuestionario.respuestaCorrectaP3,
      pregunta_4: cuestionario.pregunta_4,
      respuesta_4_1: cuestionario.respuesta_4_1,
      respuesta_4_2: cuestionario.respuesta_4_2,
      respuesta_4_3: cuestionario.respuesta_4_3,
      respuesta_4_4: cuestionario.respuesta_4_4,
      respuestaCorrectaP4: cuestionario.respuestaCorrectaP4,
      pregunta_5: cuestionario.pregunta_5,
      respuesta_5_1: cuestionario.respuesta_5_1,
      respuesta_5_2: cuestionario.respuesta_5_2,
      respuesta_5_3: cuestionario.respuesta_5_3,
      respuesta_5_4: cuestionario.respuesta_5_4,
      respuestaCorrectaP5: cuestionario.respuestaCorrectaP5,
      pregunta_6: cuestionario.pregunta_6,
      respuesta_6_1: cuestionario.respuesta_6_1,
      respuesta_6_2: cuestionario.respuesta_6_2,
      respuesta_6_3: cuestionario.respuesta_6_3,
      respuesta_6_4: cuestionario.respuesta_6_4,
      respuestaCorrectaP6: cuestionario.respuestaCorrectaP6,
      pregunta_7: cuestionario.pregunta_7,
      respuesta_7_1: cuestionario.respuesta_7_1,
      respuesta_7_2: cuestionario.respuesta_7_2,
      respuesta_7_3: cuestionario.respuesta_7_3,
      respuesta_7_4: cuestionario.respuesta_7_4,
      respuestaCorrectaP7: cuestionario.respuestaCorrectaP7,
      pregunta_8: cuestionario.pregunta_8,
      respuesta_8_1: cuestionario.respuesta_8_1,
      respuesta_8_2: cuestionario.respuesta_8_2,
      respuesta_8_3: cuestionario.respuesta_8_3,
      respuesta_8_4: cuestionario.respuesta_8_4,
      respuestaCorrectaP8: cuestionario.respuestaCorrectaP8,
      pregunta_9: cuestionario.pregunta_9,
      respuesta_9_1: cuestionario.respuesta_9_1,
      respuesta_9_2: cuestionario.respuesta_9_2,
      respuesta_9_3: cuestionario.respuesta_9_3,
      respuesta_9_4: cuestionario.respuesta_9_4,
      respuestaCorrectaP9: cuestionario.respuestaCorrectaP9,
      pregunta_10: cuestionario.pregunta_10,
      respuesta_10_1: cuestionario.respuesta_10_1,
      respuesta_10_2: cuestionario.respuesta_10_2,
      respuesta_10_3: cuestionario.respuesta_10_3,
      respuesta_10_4: cuestionario.respuesta_10_4,
      respuestaCorrectaP10: cuestionario.respuestaCorrectaP10,
    }).then((cuestionario) => {
      console.log("Cuestionario registrado");
      registrado = cuestionario;
    });

    if (registrado) {
      console.log(registrado)
      const cuestionarioRef = doc(db, "Cuestionarios", registrado.id);
      await updateDoc(cuestionarioRef, {
        idCuestionario: registrado.id,
      }).then(() => {
        console.log("Cuestionario actualizado con el id");
        estaRegistrado = true;
        new Swal({
          title: "Acción exitosa",
          text: "El cuestionario ha sido registrado.",
          icon: "success",
          showConfirmButton: false,
          timer: 3000
      })
      });
    }
  } else {
    console.log("No such document!");
  }
  return estaRegistrado;
}
//Editar un cuestionario
export function actualizarCuestionario(cuestionario, data, imageUpload) {

  let editado ;
  var imageRef;
  if (imageUpload !== null) {
    imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    uploadBytes(imageRef, imageUpload).then(() => {
      //alert("uploaded");
    });
    editado = actualizarCuestionarioConImagen(cuestionario, data, imageRef)

  } else {
    editado = actualizarCuestionarioSinImagen(cuestionario, data)
  }
  return editado;

}

async function actualizarCuestionarioSinImagen(cuestionario, data) {
  let editado = false;
  if (cuestionario !== null) {
    const cuestionarioRef = doc(db, "Cuestionarios", data.idCuestionario);
    await updateDoc(cuestionarioRef, {
      Titulo: cuestionario.Titulo,
      Enunciado: cuestionario.Enunciado,
      pregunta_1: cuestionario.pregunta_1,
      respuesta_1: cuestionario.respuesta_1,
      respuesta_2: cuestionario.respuesta_2,
      respuesta_3: cuestionario.respuesta_3,
      respuesta_4: cuestionario.respuesta_4,
      respuestaCorrectaP1: cuestionario.respuestaCorrectaP1,
      valorResPregunta1:cuestionario.valorResPregunta1,
      pregunta_2: cuestionario.pregunta_2,
      respuesta_2_1: cuestionario.respuesta_2_1,
      respuesta_2_2: cuestionario.respuesta_2_2,
      respuesta_2_3: cuestionario.respuesta_2_3,
      respuesta_2_4: cuestionario.respuesta_2_4,
      respuestaCorrectaP2: cuestionario.respuestaCorrectaP2,
      valorResPregunta2:cuestionario.valorResPregunta2,
      pregunta_3: cuestionario.pregunta_3,
      respuesta_3_1: cuestionario.respuesta_3_1,
      respuesta_3_2: cuestionario.respuesta_3_2,
      respuesta_3_3: cuestionario.respuesta_3_3,
      respuesta_3_4: cuestionario.respuesta_3_4,
      respuestaCorrectaP3: cuestionario.respuestaCorrectaP3,
      valorResPregunta3:cuestionario.valorResPregunta3,
      pregunta_4: cuestionario.pregunta_4,
      respuesta_4_1: cuestionario.respuesta_4_1,
      respuesta_4_2: cuestionario.respuesta_4_2,
      respuesta_4_3: cuestionario.respuesta_4_3,
      respuesta_4_4: cuestionario.respuesta_4_4,
      respuestaCorrectaP4: cuestionario.respuestaCorrectaP4,
      valorResPregunta4:cuestionario.valorResPregunta4,
      pregunta_5: cuestionario.pregunta_5,
      respuesta_5_1: cuestionario.respuesta_5_1,
      respuesta_5_2: cuestionario.respuesta_5_2,
      respuesta_5_3: cuestionario.respuesta_5_3,
      respuesta_5_4: cuestionario.respuesta_5_4,
      respuestaCorrectaP5: cuestionario.respuestaCorrectaP5,
      valorResPregunta5:cuestionario.valorResPregunta5,
      pregunta_6: cuestionario.pregunta_6,
      respuesta_6_1: cuestionario.respuesta_6_1,
      respuesta_6_2: cuestionario.respuesta_6_2,
      respuesta_6_3: cuestionario.respuesta_6_3,
      respuesta_6_4: cuestionario.respuesta_6_4,
      respuestaCorrectaP6: cuestionario.respuestaCorrectaP6,
      valorResPregunta6:cuestionario.valorResPregunta6,
      pregunta_7: cuestionario.pregunta_7,
      respuesta_7_1: cuestionario.respuesta_7_1,
      respuesta_7_2: cuestionario.respuesta_7_2,
      respuesta_7_3: cuestionario.respuesta_7_3,
      respuesta_7_4: cuestionario.respuesta_7_4,
      respuestaCorrectaP7: cuestionario.respuestaCorrectaP7,
      valorResPregunta7:cuestionario.valorResPregunta7,
      pregunta_8: cuestionario.pregunta_8,
      respuesta_8_1: cuestionario.respuesta_8_1,
      respuesta_8_2: cuestionario.respuesta_8_2,
      respuesta_8_3: cuestionario.respuesta_8_3,
      respuesta_8_4: cuestionario.respuesta_8_4,
      respuestaCorrectaP8: cuestionario.respuestaCorrectaP8,
      valorResPregunta8:cuestionario.valorResPregunta8,
      pregunta_9: cuestionario.pregunta_9,
      respuesta_9_1: cuestionario.respuesta_9_1,
      respuesta_9_2: cuestionario.respuesta_9_2,
      respuesta_9_3: cuestionario.respuesta_9_3,
      respuesta_9_4: cuestionario.respuesta_9_4,
      respuestaCorrectaP9: cuestionario.respuestaCorrectaP9,
      valorResPregunta9:cuestionario.valorResPregunta9,
      pregunta_10: cuestionario.pregunta_10,
      respuesta_10_1: cuestionario.respuesta_10_1,
      respuesta_10_2: cuestionario.respuesta_10_2,
      respuesta_10_3: cuestionario.respuesta_10_3,
      respuesta_10_4: cuestionario.respuesta_10_4,
      respuestaCorrectaP10: cuestionario.respuestaCorrectaP10,
      valorResPregunta10:cuestionario.valorResPregunta10,
    }).then(() => {
      console.log("Cuestionario actualizado...");
      editado = true;
    });
  }
  return editado;
}
async function actualizarCuestionarioConImagen(cuestionario, data, imageRef) {
  let editado = false;
  if (cuestionario !== null) {
    const cuestionarioRef = doc(db, "Cuestionarios", data.idCuestionario);
    await updateDoc(cuestionarioRef, {
      Titulo: cuestionario.Titulo,
      Enunciado: cuestionario.Enunciado,
      imageRef: imageRef.fullPath,
      pregunta_1: cuestionario.pregunta_1,
      respuesta_1: cuestionario.respuesta_1,
      respuesta_2: cuestionario.respuesta_2,
      respuesta_3: cuestionario.respuesta_3,
      respuesta_4: cuestionario.respuesta_4,
      respuestaCorrectaP1: cuestionario.respuestaCorrectaP1,
      valorResPregunta1:cuestionario.valorResPregunta1,
      pregunta_2: cuestionario.pregunta_2,
      respuesta_2_1: cuestionario.respuesta_2_1,
      respuesta_2_2: cuestionario.respuesta_2_2,
      respuesta_2_3: cuestionario.respuesta_2_3,
      respuesta_2_4: cuestionario.respuesta_2_4,
      respuestaCorrectaP2: cuestionario.respuestaCorrectaP2,
      valorResPregunta2:cuestionario.valorResPregunta2,
      pregunta_3: cuestionario.pregunta_3,
      respuesta_3_1: cuestionario.respuesta_3_1,
      respuesta_3_2: cuestionario.respuesta_3_2,
      respuesta_3_3: cuestionario.respuesta_3_3,
      respuesta_3_4: cuestionario.respuesta_3_4,
      respuestaCorrectaP3: cuestionario.respuestaCorrectaP3,
      valorResPregunta3:cuestionario.valorResPregunta3,
      pregunta_4: cuestionario.pregunta_4,
      respuesta_4_1: cuestionario.respuesta_4_1,
      respuesta_4_2: cuestionario.respuesta_4_2,
      respuesta_4_3: cuestionario.respuesta_4_3,
      respuesta_4_4: cuestionario.respuesta_4_4,
      respuestaCorrectaP4: cuestionario.respuestaCorrectaP4,
      valorResPregunta4:cuestionario.valorResPregunta4,
      pregunta_5: cuestionario.pregunta_5,
      respuesta_5_1: cuestionario.respuesta_5_1,
      respuesta_5_2: cuestionario.respuesta_5_2,
      respuesta_5_3: cuestionario.respuesta_5_3,
      respuesta_5_4: cuestionario.respuesta_5_4,
      respuestaCorrectaP5: cuestionario.respuestaCorrectaP5,
      valorResPregunta5:cuestionario.valorResPregunta5,
      pregunta_6: cuestionario.pregunta_6,
      respuesta_6_1: cuestionario.respuesta_6_1,
      respuesta_6_2: cuestionario.respuesta_6_2,
      respuesta_6_3: cuestionario.respuesta_6_3,
      respuesta_6_4: cuestionario.respuesta_6_4,
      respuestaCorrectaP6: cuestionario.respuestaCorrectaP6,
      valorResPregunta6:cuestionario.valorResPregunta6,
      pregunta_7: cuestionario.pregunta_7,
      respuesta_7_1: cuestionario.respuesta_7_1,
      respuesta_7_2: cuestionario.respuesta_7_2,
      respuesta_7_3: cuestionario.respuesta_7_3,
      respuesta_7_4: cuestionario.respuesta_7_4,
      respuestaCorrectaP7: cuestionario.respuestaCorrectaP7,
      valorResPregunta7:cuestionario.valorResPregunta7,
      pregunta_8: cuestionario.pregunta_8,
      respuesta_8_1: cuestionario.respuesta_8_1,
      respuesta_8_2: cuestionario.respuesta_8_2,
      respuesta_8_3: cuestionario.respuesta_8_3,
      respuesta_8_4: cuestionario.respuesta_8_4,
      respuestaCorrectaP8: cuestionario.respuestaCorrectaP8,
      valorResPregunta8:cuestionario.valorResPregunta8,
      pregunta_9: cuestionario.pregunta_9,
      respuesta_9_1: cuestionario.respuesta_9_1,
      respuesta_9_2: cuestionario.respuesta_9_2,
      respuesta_9_3: cuestionario.respuesta_9_3,
      respuesta_9_4: cuestionario.respuesta_9_4,
      respuestaCorrectaP9: cuestionario.respuestaCorrectaP9,
      valorResPregunta9:cuestionario.valorResPregunta9,
      pregunta_10: cuestionario.pregunta_10,
      respuesta_10_1: cuestionario.respuesta_10_1,
      respuesta_10_2: cuestionario.respuesta_10_2,
      respuesta_10_3: cuestionario.respuesta_10_3,
      respuesta_10_4: cuestionario.respuesta_10_4,
      respuestaCorrectaP10: cuestionario.respuestaCorrectaP10,
      valorResPregunta10:cuestionario.valorResPregunta10,
    }).then(() => {
      console.log("Cuestionario actualizado...");
      editado = true;
    });
  }
  return editado;
}


//para borrar el cuestionario especifico
export async function borrarCuestionarioDocente(id) {
  await deleteDoc(doc(db, "Cuestionarios", id)).then(() => {
    console.log("Cuestionario eliminado");
        new Swal({
          title: "Acción exitosa",
          text: "El cuestionario ha sido borrado.",
          icon: "success",
          showConfirmButton: false,
          timer: 3000
      })
  });
}

//asignar cuestionario
export async function asignarCuestionario(id, nrc,idD) {

  if (nrc.length >4 && nrc.length<8) {
    const classRef = collection(db, "Clase");
    const qC = query(classRef, where("NRC", "==", nrc),where("idDocente","==",idD));
    const querySnapshotC = await getDocs(qC);
    if (querySnapshotC.size > 0) {
      const cuestionarioRef = doc(db, "Cuestionarios", id);
      const ref = collection(db, "Cuestionarios");
      const q = query(ref, where("nrcClase", "!=", false));
      let bandera;
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        let idCObte = doc.data().idCuestionario;

        if (idCObte === id) {
          //En este cuestionario ya esta creado el array
          bandera = 1;
        }
      });
      if (bandera === 1) {
        await updateDoc(cuestionarioRef, {
          nrcClase: arrayUnion(nrc),
        });
        new Swal({
          position: "top",
          icon: "success",
          title: "Cuestionario Asignado",
          showConfirmButton: false,
          timer: 3000,
        });

        document.getElementById("nrc").value = "";
      } else {
        await updateDoc(cuestionarioRef, {
          nrcClase: [nrc],
        });
        new Swal({
          position: "top",
          icon: "success",
          title: "Cuestionario Asignado",
          showConfirmButton: false,
          timer: 3000,
        });
        document.getElementById("nrc").value = "";
      }
    } else {
      new Swal({
        position: "top",
        icon: "error",
        title: "NRC no existe.",
        text: "El NRC de la clase no existe, puede ir a su perfil para visualizar sus clases.",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  } else if (nrc.length < 5 || nrc.length>7) {
    new Swal({
      position: "top",
      icon: "error",
      title:
        "Falta ingresar el NRC o no tiene la longitud requerida (5-7 caracteres).",
      showConfirmButton: false,
      timer: 3000,
    });
  }
}

//Verificar Resultados resultado cuestionario
export async function registrarResultadoCuestionario(values, quiz) {
  var calificacion = 0;
  console.log("Entro a la funcion de guardar los resultados valor entrada", values.respuesta1);
  console.log("respuesta incorrecta quiz", quiz.respuestaCorrectaP1);
  if (values.respuesta1 === quiz.respuestaCorrectaP1) {
    console.log("Respuesta correcta", values.respuesta1);
    calificacion++;
  }

  if (values.respuesta2 === quiz.respuestaCorrectaP2) {
    console.log("Respuesta correcta2", values.respuesta2);
    calificacion++;
  }


  if (values.respuesta3 === quiz.respuestaCorrectaP3) {
    console.log("Respuesta correcta2", values.respuesta3);
    calificacion++;
  }

  if (values.respuesta4 === quiz.respuestaCorrectaP4) {
    console.log("Respuesta correcta", values.respuesta4);
    calificacion++;
  }
  if (values.respuesta5 === quiz.respuestaCorrectaP5) {
    console.log("Respuesta correcta2", values.respuesta5);
    calificacion++;
  }


  if (values.respuesta6 === quiz.respuestaCorrectaP6) {
    console.log("Respuesta correcta2", values.respuesta6);
    calificacion++;
  }

  if (values.respuesta7 === quiz.respuestaCorrectaP7) {
    console.log("Respuesta correcta", values.respuesta7);
    calificacion++;
  }

  if (values.respuesta8 === quiz.respuestaCorrectaP8) {
    console.log("Respuesta correcta2", values.respuesta8);
    calificacion++;
  }


  if (values.respuesta9 === quiz.respuestaCorrectaP9) {
    console.log("Respuesta correcta2", values.respuesta9);
    calificacion++;
  }

  if (values.respuesta10 === quiz.respuestaCorrectaP10) {
    console.log("Respuesta correcta2", values.respuesta10);
    calificacion++;
  }

  return calificacion;
}

//Registrar resultado cuestionario
//Actualizar en alumno el avance de un tema
export async function actualizarAvanceTemaAlumno(user){
  //Actualizar temascompletos
    //Actualizar el avance.TemasCompletos
    //1.Saber el total de temas existentes
    const alumnoRef = doc(db, "Alumno", user.uid);
    const qTemas = query(collection(db, "Temas"));
    var countTemas = 0;
    onSnapshot(qTemas, (querySnapshotT) => {
      querySnapshotT.forEach(() => {
        countTemas = countTemas + 1;
      });
      console.log("Total de temas ", countTemas);
    });
    //2.Conocer lo cuestionarios que tiene resuelto el usuario por tema PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
    var countS = 0;//contador de subtemas con al menos un cuetionario resuelto
    var countT = 0;//contador de temas completos
    let avanceT = 0; // temas terminanos del alumno
    //Obtenemos los temas existentes 
    const querySnapshotTemas = await getDocs(qTemas);
    //Dentro del forEach se visita cada uno de los temas disponibles
    querySnapshotTemas.forEach(async (doc) => {
      console.log(doc.id, " => ", doc.data());
      //Se declara una varible tipo let para que gurdemos el nombre del tema en cuestión
      let tema = "";
      tema = doc.data().Tema;
      console.log("Tema:::::-------", tema);
      //Query que nos dara los subtemas cuando el atributo  Tema sea igual al tema dependiendiendo del forEach
      const qSub = query(collection(db, "Subtemas"), where("Tema", "==", tema));
      const querySnapshotSub = await getDocs(qSub);
      //Se recorre cada uno de los valores con un forEach
      querySnapshotSub.forEach(async (docSub) => {
        console.log(docSub.id, " => ", docSub.data());
        //Se declara una varible tipo let para ir guardando el valor del subtema
        let Subtema = "";
        Subtema = docSub.data().Subtema;
        console.log("Tema----------------------------------------------",tema);
        console.log("SubTema:::::--------", Subtema);
        // refenrencia a la colección de Resultado en la bd
        const refR = collection(db, "Resultado");
        //query que permite obtener los regitros de Rsultados cuando el idAlumno, subtema y tema coincida con los asignados.
        const qRes = query(
          refR,
          where("idAlumno", "==", user.uid),
          where("subTemaCuestionario", "==", Subtema),
          where("temaCuestionario", "==", tema)
        );
        //Se obtienen los resultados del query
        const querySnapshotRes = await getDocs(qRes);
        //Se manda a imprimir cada uno de los valores de los documentos obtennidos
        querySnapshotRes.forEach(async (docRes) => {
          console.log("Resultado");
          console.log(docSub.id, " => ", docRes.data());
        });
        console.log("Tamaño de resultados con idAlumno, subtme y tema::",querySnapshotRes.size);
        //Si el tamaño de los resultados es mayor que 0 entra dentro del if para poder aumentar el contador de countS, 
          //que permitira cuantos subtemas han sido completos del tema en cuestgion, dependiendo del forEach.
        if (querySnapshotRes.size > 0) {
          countS = countS + 1;
          console.log("countS en if::::", countS);
        } else {
          countS=0;
          console.log(":::en else countS en if::::", countS);
        }
        console.log("Numero de subtemas",doc.data().TotalSubtemas)
        //Si el valor del contado de subtemas completos coincide con el total de subtemas de un tema se podra tomar como tema completo.
          // Y se podra aumentar el contador de temas completos y calcular el avance para poderlo actualizar en el doc de Alumno
        if (countS === doc.data().TotalSubtemas) {
          console.log(":::Entro if de countS==doc.data().TotalSubtemas::");
          countT = countT + 1;
          console.log("countT en if:::::", countT);
          avanceT = (countT * 100) / countTemas;
          console.log("Avance Tema", avanceT);
          await updateDoc(alumnoRef, {
            "Avance.TemasCompletos": countT,
          });
        } else {
          countT=0;//Aun no se si sea tan necesario
          console.log("countT en if:::::", countT);
        }
      });
    });
  }
  //Registrar resultado cuestionario
  export async function registrarResultadoCuestionarioAsignado(
    values,
    quiz,
    user
  ) {
    var cal = 0;
    var intento = 1;
    var contIgualAlum = 0;
    var calSub = 0;
    if (values.respuesta1 === quiz.respuestaCorrectaP1) {
      cal++;
    }
  
    if (values.respuesta2 === quiz.respuestaCorrectaP2) {
      cal++;
    }
  
    if (values.respuesta3 === quiz.respuestaCorrectaP3) {
      cal++;
    }
  
    if (values.respuesta4 === quiz.respuestaCorrectaP4) {
      cal++;
    }
  
    if (values.respuesta5 === quiz.respuestaCorrectaP5) {
      cal++;
    }
  
    if (values.respuesta6 === quiz.respuestaCorrectaP6) {
      cal++;
    }
    if (values.respuesta7 === quiz.respuestaCorrectaP7) {
      cal++;
    }
    if (values.respuesta8 === quiz.respuestaCorrectaP8) {
      cal++;
    }
  
    if (values.respuesta9 === quiz.respuestaCorrectaP9) {
      cal++;
    }
    if (values.respuesta10 === quiz.respuestaCorrectaP10) {
      cal++;
    }
  
    console.log("Calificacion", cal);
    console.log("idCuestionario=>", quiz.idCuestionario);
    console.log("idAlumno", user.uid);
  
    const cuestionarioRef = collection(db, "Resultado");
    const resu = query(
      cuestionarioRef,
      where("idCuestionario", "==", quiz.idCuestionario),
      where("idAlumno", "==", user.uid)
    );
    const querySnapshot = await getDocs(resu);
  
    if (querySnapshot.size > 0) {
      let idRes;
      console.log("Hay al menos un registro con esa informacion");
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        console.log("NumIntento::", doc.data().intento);
        intento = doc.data().intento + 1;
        idRes = doc.id;
      });
      console.log("Nuevo intento::>", intento);
      if (intento > 3) {
        console.log(
          "Ya no puede volver a hacer el cuestionario porque ya tienen 3 intentos"
        );
        //Aqui puedo retornar  bandera 0
      } else {
        const resultadoRef = doc(db, "Resultado", idRes);
        await updateDoc(resultadoRef, {
          intento: intento,
          calificacion: cal,
        });
        //Obtener el total de cuestionarios con al menos un intento
        const cuestionarioRef = collection(db, "Resultado");
        const museums2 = query(cuestionarioRef, where("intento", "<=", 3));
        const querySnapshot2 = await getDocs(museums2);
  
        querySnapshot2.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
          console.log(user.uid);
          console.log(doc.data().idAlumno);
          if (doc.data().idAlumno === user.uid) {
            contIgualAlum++;
            calSub = calSub + doc.data().calificacion;}
        });
        var prom = calSub / contIgualAlum;
        console.log("Datos encontradoos", contIgualAlum);
        console.log("Promdio::", prom);
        //Acceder al doc del alumno que esta contestando para actualizar su avance
        const alumnoRef = doc(db, "Alumno", user.uid);
        await updateDoc(alumnoRef, {
          "Avance.CuestionariosCompletos": contIgualAlum,
          "Avance.PromedioGeneral": prom,
        });
        //retornar 1
      }
    } else {
      console.log("Sin datos");
      // Add a new document with a generated id.
      const docRef = await addDoc(collection(db, "Resultado"), {
        calificacion: cal,
        idAlumno: user.uid,
        idCuestionario: quiz.idCuestionario,
        intento: intento,
        temaCuestionario: quiz.Tema,
        subTemaCuestionario: quiz.Subtema,
      });
      console.log("Document written with ID: ", docRef.id);
      const resultadoRef = doc(db, "Resultado", docRef.id);
  
      await updateDoc(resultadoRef, {
        idResultado: docRef.id,
      });
      //Actualzar datos en alumno
      //Obtener el total de cuestionarios con al menos un intento
      const cuestionarioRef = collection(db, "Resultado");
      const museums2 = query(cuestionarioRef);
      const querySnapshot2 = await getDocs(museums2);
  
      querySnapshot2.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        console.log(user.uid);
        console.log(doc.data().idAlumno);
        if (doc.data().idAlumno === user.uid) {
          contIgualAlum++;
        }
      });
      //Acceder al doc del alumno que esta contestando para actualizar su avance
      const alumnoRef = doc(db, "Alumno", user.uid);
      await updateDoc(alumnoRef, {
        "Avance.CuestionariosCompletos": contIgualAlum,
        "Avance.PromedioGeneral": cal,
      });
      //Actualiar el avance respecto al tema
      actualizarAvanceTemaAlumno(user);
    }
    
    return cal;
  }

export async function buscarCuestionario(criterioBusqueda, claveBusqueda) {
  let docusFiltradoF = [];
  switch (criterioBusqueda) {
    case "1":
      docusFiltradoF = await buscarCuestionarioPorTitulo(claveBusqueda);
      break;
    case "2":
      docusFiltradoF = await buscarCuestionarioPorTema(claveBusqueda);
      break;
    case "3":
      docusFiltradoF = await buscarCuestionarioPorSubtema(claveBusqueda);
      break;
    case "4":
      docusFiltradoF = await buscarCuestionarioPorAutor(claveBusqueda);
      break;
    default:
      break;
  }
  return docusFiltradoF;
}

async function buscarCuestionarioPorTitulo(claveBusqueda) {
  let docusFiltrado = [];
  const q = query(
    collection(db, "Cuestionarios"),
    where("Titulo", "==", claveBusqueda)
  );
  const querySnapshot = await Promise.all([getDocs(q)]);
  querySnapshot.forEach((snapshot) => {
    snapshot.forEach((doc) => {
      docusFiltrado.push(doc.data());
    });
  });
  return docusFiltrado;
}
async function buscarCuestionarioPorTema(claveBusqueda) {
  const q = query(
    collection(db, "Cuestionarios"),
    where("Tema", "==", claveBusqueda)
  );
  let docusFiltrado = [];
  const querySnapshot = await Promise.all([getDocs(q)]);
  querySnapshot.forEach((snapshot) => {
    snapshot.forEach((doc) => {
      docusFiltrado.push(doc.data());
    });
  });
  return docusFiltrado;
}
async function buscarCuestionarioPorSubtema(claveBusqueda) {
  let q = query(
    collection(db, "Cuestionarios"),
    where("Subtema", "==", claveBusqueda)
  );
  const docusFiltrado = [];
  const querySnapshot = await Promise.all([getDocs(q)]);
  querySnapshot.forEach((snapshot) => {
    snapshot.forEach((doc) => {
      docusFiltrado.push(doc.data());
    });
  });
  return docusFiltrado;
}
async function buscarCuestionarioPorAutor(claveBusqueda) {
  const q = query(
    collection(db, "Cuestionarios"),
    where("Autor", "==", claveBusqueda)
  );
  let docusFiltrado = [];
  const querySnapshot = await Promise.all([getDocs(q)]);
  querySnapshot.forEach((snapshot) => {
    snapshot.forEach((doc) => {
      docusFiltrado.push(doc.data());
    });
  });
  return docusFiltrado;
}

//Eliminar NRc asignado en arreglo NRCasignado
export async function eliminarAsignarCuestionario(id, nrc, idD, nrcAsig) {
  if (nrc.length > 4 && nrc.length < 8) {
    const classRef = collection(db, "Clase");
    const qC = query(
      classRef,
      where("NRC", "==", nrc),
      where("idDocente", "==", idD)
    );
    const querySnapshotC = await getDocs(qC);
    if (querySnapshotC.size > 0) {
      const cuestionarioRef = doc(db, "Cuestionarios", id);
      const ref = collection(db, "Cuestionarios");
      const q = query(ref, where("nrcClase", "!=", false));
      let bandera;
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        let idCObte = doc.data().idCuestionario;
        if (idCObte === id) {
          //En este cuestionario ya esta creado el array
          bandera = 1;
        }
      });
      if (bandera === 1) {
        //
        console.log("entro if");
        const qHaynrc = query(ref, where("nrcClase", "array-contains", nrc),where("idCuestionario","==",id));
        const querySnapshotNRC = await getDocs(qHaynrc);
        if (querySnapshotNRC.size > 0) {
          //eliminar
          console.log("Las canciones después: ", nrcAsig);
          await updateDoc(cuestionarioRef, {
            nrcClase: arrayRemove(nrc),
          })
            .then(() => {
              new Swal({
                position: "top",
                icon: "success",
                title: "NRC eliminado.",
                text: "El cuestionario ya no esta asignado a esa clase.",
                showConfirmButton: false,
                timer: 3000,
              });
              document.getElementById("nrc").value = "";
            })
            .catch((error) => {
              new Swal({
                title: "Actualización no exitosa",
                text: "Favor de verificar sus datos.¡Vuelve a intentarlo!",
                icon: "error",
                showConfirmButton: false,
                timer: 3000,
              });
            });
        } else {
          //
          new Swal({
            position: "top",
            icon: "warning",
            title: "Nrc no asignado.",
            text: "Tienes una clase con ese NRC pero no ha sido asignada por lo cual no puede ser eliminada.",
            showConfirmButton: false,
            timer: 3000,
          });
          document.getElementById("nrc").value = "";
          //
        }
      } else {
        new Swal({
          position: "top",
          icon: "warning",
          title: "Sin clase asignada.",
          text: "El cuestionario aún no tiene clases asignadas.",
          showConfirmButton: false,
          timer: 3000,
        });
        document.getElementById("nrc").value = "";
      }
    } else {
      new Swal({
        position: "top",
        icon: "error",
        title: "NRC no existe.",
        text: "El NRC de la clase no existe, puede ir a su perfil para visualizar sus clases.",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  } else if (nrc.length < 5 || nrc.length > 7) {
    new Swal({
      position: "top",
      icon: "error",
      title:
        "Falta ingresar el NRC o no tiene la longitud requerida (5-7 caracteres).",
      showConfirmButton: false,
      timer: 3000,
    });
  }
}