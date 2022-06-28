import firebaseApp,{ storage} from "../../Firebase/firebase-config";
import react,{useState} from "react";
import {
  addDoc, collection, getFirestore, doc, getDoc, updateDoc,
  deleteDoc, getDocs, runTransaction, query, where, arrayUnion, onSnapshot, setDoc, orderBy
} from "firebase/firestore";
  import Swal from "sweetalert2";
  import { ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";

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
export function registrarNuevoCuestionario(cuestionario, data, user,imageUpload) {
  //Para obtener información del docente que crea el custionario
  var imageRef;
  if(imageUpload !== null){
    imageRef= ref(storage, `images/${imageUpload.name + v4()}`);
  uploadBytes(imageRef, imageUpload).then(() => {
    //alert("uploaded");
  });
  registrarCuestionarioConImagen(cuestionario, data,user,imageRef)

  }else{
    registrarCuestionarioSinImagen(cuestionario, data, user)
  }
  
  
}

async function  registrarCuestionarioSinImagen(cuestionario, data, user){

 
  const refDocente = doc(db, "Docente", user.uid).withConverter(
    docenteConverter
  );

  let registrado = null;

  const docSnapDocente = await getDoc(refDocente);
  if (docSnapDocente.exists()) {
    const docente = docSnapDocente.data();
    console.log(docente.toString());
    const cuestionarioAgregado = await addDoc(collection(db, "Cuestionarios"), {
      Autor: docente.name + " " + docente.apellidoPaterno,
      AutorMatricula: docente.matricula,
      AutorId: user.uid,
      imageRef: "images/noMoreInformation.png",
      Tema: data.Tema,
      Subtema: data.Subtema,
      Titulo: cuestionario.Titulo,
      Enunciado : cuestionario.Enunciado,
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

    
//necesitamos hacer una nueva consulta  a la base de datos para poder obtener su id una doble consulta
    if (registrado) {
      console.log(registrado)
      const cuestionarioRef = doc(db, "Cuestionarios", registrado.id);
      await updateDoc(cuestionarioRef, {
        idCuestionario: registrado.id,
      }).then(() => {
        console.log("Cuestionario actualizado con el id");
      });
    }
  } else {
    console.log("No such document!");
  }
  console.log('Ahora vamos a actualizar el cuestionario con su id')
}
async function registrarCuestionarioConImagen(cuestionario, data, user,imageRef){
  const refDocente = doc(db, "Docente", user.uid).withConverter(
    docenteConverter
  );

  let registrado = null;
  const docSnapDocente = await getDoc(refDocente);
  if (docSnapDocente.exists()) {
    const docente = docSnapDocente.data();
    console.log(docente.toString());
    const cuestionarioAgregado = await addDoc(collection(db, "Cuestionarios"), {
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
      });
    }
  } else {
    console.log("No such document!");
  }
}
//Editar un cuestionario
export function actualizarCuestionario(cuestionario, data,imageUpload) {
  
  var imageRef;
  if(imageUpload !== null){
    imageRef= ref(storage, `images/${imageUpload.name + v4()}`);
  uploadBytes(imageRef, imageUpload).then(() => {
    //alert("uploaded");
  });
  actualizarCuestionarioConImagen(cuestionario, data,imageRef)

  }else{
    actualizarCuestionarioSinImagen(cuestionario, data)
  }
  
}

async function actualizarCuestionarioSinImagen(cuestionario, data){
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
    }).then(() => {
      console.log("Cuestionario actualizado...");
    });
  }
}
async function actualizarCuestionarioConImagen(cuestionario, data,imageRef){
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

//asignar cuestionario
export async function asignarCuestionario(id, nrc) {
  console.log("ingreso funcion de asignar cuestonario");

  if (nrc.length === 5) {

    console.log("nrc Admi", nrc);
    console.log("id cuestionario:", id);
    const cuestionarioRef = doc(db, "Cuestionarios", id);
    const docRef = doc(db, "Cuestionarios", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }

    const ref = collection(db, 'Cuestionarios');
    const q = query(ref, where("nrcClase", "!=", false));
    let bandera;
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {

      console.log(doc.id, " => ", doc.data().idCuestionario);
      let idCObte = doc.data().idCuestionario;
      console.log('Id cuest con arreglo::', idCObte);

      if (idCObte === id) {
        //En este cuestionario ya esta creado el array
        bandera = 1;
      };
      console.log("Bandera->", bandera);
    });
    console.log("Bandera->", bandera);
    if (bandera === 1) {
      console.log("Bandera igual a 1...");
      await updateDoc(cuestionarioRef, {
        nrcClase: arrayUnion(nrc)
      });
      new Swal({
        position: 'top',
        icon: 'success',
        title: 'Cuestionario Asignado',
        showConfirmButton: false,
        timer: 3000
    });
    
    document.getElementById('nrc').value="";
    } else {
      console.log("agregar el arreglo al cuestionario");
      await updateDoc(cuestionarioRef, {
        nrcClase: [nrc]
      })
      new Swal({
        position: 'top',
        icon: 'success',
        title: 'Cuestionario Asignado',
        showConfirmButton: false,
        timer: 3000
    });
    
    document.getElementById('nrc').value="";
    }


  } else if (nrc.length < 5) {
    new Swal({
      position: 'top',
      icon: 'error',
      title: 'Falta ingresar el NRC o no tiene la longitud requerida (5 caracteres).',
      showConfirmButton: false,
      timer: 3000
  });

  }
}

//Verificar Resultados resultado cuestionario
export async function registrarResultadoCuestionario(values, quiz) {
 var calificacion=0;
  console.log("Entro a la funcion de guardar los resultados valor entrada", values.respuesta1);
  console.log("respuesta incorrecta quiz", quiz.respuestaCorrectaP1);
  if (values.respuesta1 == quiz.respuestaCorrectaP1) {
    console.log("Respuesta correcta", values.respuesta1);
    calificacion++;
  }

  if (values.respuesta2 == quiz.respuestaCorrectaP2) {
    console.log("Respuesta correcta2", values.respuesta2);
    calificacion++;
  }
  

  if (values.respuesta3 == quiz.respuestaCorrectaP3) {
    console.log("Respuesta correcta2", values.respuesta3);
    calificacion++;
  }

  if (values.respuesta4 == quiz.respuestaCorrectaP4) {
    console.log("Respuesta correcta", values.respuesta4);
    calificacion++;
  }
  if (values.respuesta5 == quiz.respuestaCorrectaP5) {
    console.log("Respuesta correcta2", values.respuesta5);
    calificacion++;
  }


  if (values.respuesta6 == quiz.respuestaCorrectaP6) {
    console.log("Respuesta correcta2", values.respuesta6);
    calificacion++;
  }

  if (values.respuesta7 == quiz.respuestaCorrectaP7) {
    console.log("Respuesta correcta", values.respuesta7);
    calificacion++;
  }

  if (values.respuesta8 == quiz.respuestaCorrectaP8) {
    console.log("Respuesta correcta2", values.respuesta8);
    calificacion++;
  } 


  if (values.respuesta9 == quiz.respuestaCorrectaP9) {
    console.log("Respuesta correcta2", values.respuesta9);
    calificacion++;
  }

  if (values.respuesta10 == quiz.respuestaCorrectaP10) {
    console.log("Respuesta correcta2", values.respuesta10);
    calificacion++;
  }

 return calificacion;
}

//Registrar resultado cuestionario
export async function registrarResultadoCuestionarioAsignado(values, quiz, user) {
  var cal = 0;
  var intento = 1;
  var contIgualAlum=0;
  var calSub=0;

  console.log("Entro a la funcion de guardar los resultados valor entrada", values.respuesta1);
  console.log("respuesta incorrecta quiz", quiz.respuestaCorrectaP1);
  if (values.respuesta1 === quiz.respuestaCorrectaP1) {
    console.log("Respuesta correcta", values.respuesta1);
    cal++;
  } 

  if (values.respuesta2 === quiz.respuestaCorrectaP2) {
    console.log("Respuesta correcta2", values.respuesta2);
    cal++;
  }


  if (values.respuesta3 === quiz.respuestaCorrectaP3) {
    console.log("Respuesta correcta2", values.respuesta3);
    cal++;
  }

  if (values.respuesta4 === quiz.respuestaCorrectaP4) {
    console.log("Respuesta correcta", values.respuesta4);
    cal++;
  }

  if (values.respuesta5 === quiz.respuestaCorrectaP5) {
    console.log("Respuesta correcta2", values.respuesta5);
    cal++;
  }


  if (values.respuesta6 === quiz.respuestaCorrectaP6) {
    console.log("Respuesta correcta2", values.respuesta6);
    cal++;
  }
  if (values.respuesta7 === quiz.respuestaCorrectaP7) {
    console.log("Respuesta correcta", values.respuesta7);
    cal++;
  }
  if (values.respuesta8 === quiz.respuestaCorrectaP8) {
    console.log("Respuesta correcta2", values.respuesta8);
    cal++;
  }


  if (values.respuesta9 === quiz.respuestaCorrectaP9) {
    console.log("Respuesta correcta2", values.respuesta9);
    cal++;
  }
  if (values.respuesta10 === quiz.respuestaCorrectaP10) {
    console.log("Respuesta correcta2", values.respuesta10);
    cal++;
  }

  console.log("Calificacion", cal);
  console.log("idCuestionario=>", quiz.idCuestionario);
  console.log("idAlumno", user.uid);

  const cuestionarioRef = collection(db, "Resultado");
  const museums = query(cuestionarioRef, where("idCuestionario", "==", quiz.idCuestionario), where("idAlumno", "==", user.uid));
  const querySnapshot = await getDocs(museums);
  querySnapshot.forEach((doc) => {
    console.log(doc.id, ' => ', doc.data());
  });
  
  if (querySnapshot.size > 0) {
    let idRes;
    console.log("Hay al menos un registro con esa informacion");
    querySnapshot.forEach((doc) => {
      console.log(doc.id, ' => ', doc.data());
      console.log("NumIntento::", doc.data().intento);
      intento = doc.data().intento + 1;
      idRes = doc.id;
    });
    console.log("Nuevo intento::>", intento);
    if (intento > 3) {
      console.log("Ya no puede volver a hacer el cuestionario porque ya tienen 3 intentos");
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
    console.log(doc.id, ' => ', doc.data());
    console.log(user.uid);
    console.log(doc.data().idAlumno);
    if(doc.data().idAlumno==user.uid){
      contIgualAlum++;
      calSub=calSub+doc.data().calificacion;
    }
  });
  var prom=calSub/contIgualAlum;
      console.log("Datos encontradoos",contIgualAlum);
      console.log("Promdio::",prom);
//Acceder al doc del alumno que esta contestando para actualizar su avance 
      const alumnoRef=doc(db,"Alumno",user.uid);
      await updateDoc(alumnoRef, {
        "Avance.CuestionariosCompletos": contIgualAlum,
        "Avance.PromedioGeneral": prom,
        "Avance.TemasCompletos": contIgualAlum,
      });

    }
  } else {
    console.log("Sin datos");
    // Add a new document with a generated id.

    const docRef = await addDoc(collection(db, "Resultado"), {
      calificacion: cal,
      idAlumno: user.uid,
      idCuestionario: quiz.idCuestionario,
      intento: intento,
    });
    console.log("Document written with ID: ", docRef.id);
    const resultadoRef = doc(db, "Resultado", docRef.id);

    await updateDoc(resultadoRef, {
      idResultado: docRef.id
    });
    //Checar porque aqui tambien se tiene que actualizar la tabla de Alumno para el promedio y cuestionarios resueltos
    
  }

  return cal;
}