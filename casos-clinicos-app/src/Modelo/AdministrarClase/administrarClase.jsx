import firebaseApp from "../../Firebase/firebase-config";
import {
    addDoc, collection, getFirestore, doc, updateDoc,
    deleteDoc,
} from "firebase/firestore";
import Swal from "sweetalert2";

const db = getFirestore(firebaseApp);

//Para registrar clase
export async function registrarClase(idDocente, NRC, NombreClase, FechaRegistro) {
    console.log("idDocente", idDocente);

    const ClaseRegistrada = await addDoc(collection(db, "Clase"), {
        idDocente: idDocente,
        NRC: NRC,
        NombreClase: NombreClase,
        FechaRegistro: FechaRegistro
    });
    if (ClaseRegistrada) {
        const claseRef = doc(db, "Clase", ClaseRegistrada.id);
        await updateDoc(claseRef, {
            idClase: ClaseRegistrada.id,
        }).then(() => {
            console.log("Clase actualizado con el id", ClaseRegistrada.id);
        });
    }
}
//Para editar clase
export async function editarClase(NombreClaseN, NRCN, id) {
    const claseRef = doc(db, "Clase", id);
    await updateDoc(claseRef, {
        NombreClase: NombreClaseN,
        NRC: NRCN
    })
        .then(() => {
            console.log("La clase ha sido actualizado");
        })
        .catch((error) => {
            console.error(error);
        });
}

export async function borrarClaseAd(id) {
    console.log("id de la clase que se eliminara:", id);
    await deleteDoc(doc(db, "Clase", id)).then(() => {
        console.log("La clase ha sido eliminado");
        new Swal({
            position: 'top',
            icon: 'success',
            title: 'Clase eliminada.',
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
}