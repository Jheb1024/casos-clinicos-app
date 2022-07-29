import firebaseApp from "../../Firebase/firebase-config";
import {
    addDoc, collection, getFirestore, doc, updateDoc,
    deleteDoc,query,getDocs,where
} from "firebase/firestore";
import Swal from "sweetalert2";

const db = getFirestore(firebaseApp);

//Para registrar clase
export async function registrarClase(idDocente, NRC, NombreClase, FechaRegistro) {
    const collectionRefC=collection(db,"Clase");
    const qClase=query(collectionRefC,where("NRC","==",NRC));//Preguntas///////Si es necesario que se valide solo para ese idDocente¡¡?
    const querySnapshotC = await getDocs(qClase);

    if(querySnapshotC.size >0){
        new Swal({
            position: 'top',
            icon: 'error',
            title: 'NRC repetido.',
            text: 'El NRC ya esta registrado dentro de su clases dadas de alta.',
            showConfirmButton: false,
            timer: 3000
        });
    }else{
        //Se debe de dar de alta el registro de la clase
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
                new Swal({
                    position: 'top',
                    icon: 'success',
                    title: 'Clase registrada.',
                    showConfirmButton: false,
                    timer: 3000
                });
            }).catch((error) => {
                new Swal({
                    title: "Registro no exitoso",
                    text: "Favor de verificar sus datos.¡Vuelve a intentarlo!",
                    icon: "error",
                    showConfirmButton: false,
                    timer: 3000
                });
            });
        }else{
            new Swal({
                title: "Registro no exitoso",
                text: "Favor de verificar sus datos.¡Vuelve a intentarlo!",
                icon: "error",
                showConfirmButton: false,
                timer: 3000
            });
        }
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
            new Swal({
                position: 'top',
                icon: 'success',
                title: 'Clase actualizada.',
                showConfirmButton: false,
                timer: 3000
            });
        })
        .catch((error) => {
            new Swal({
                title: "Registro no exitoso",
                text: "Ha ocurrido un problema.¡Vuelve a intentarlo!",
                icon: "error",
                showConfirmButton: false,
                timer: 3000
            });
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