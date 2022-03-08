import React from 'react'
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const auth = getAuth();

async function recuperarContrasenia(email) {
    await sendPasswordResetEmail(auth, email, {url: "http://localhost:3000/inicio-sesion"})
        .then(() => {
            console.log("EL correo de reestablecimiento de la constraseña se ha enviado");
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(error.message);
            console.log(error.code);
        });
}

async function submitHandler(e){
    e.preventDefault();
    const email = e.target.elements.correoRecuperacion.value;
    recuperarContrasenia(email);
}


function ReiniciarPasswordUI() {
    return (
        <div>
            <h1>Restablecimeinto de contraseña</h1>
            <form onSubmit={submitHandler}>
                <div class="form-group">
                    <label for="correoRecuperacion">Correo electrónico</label>
                    <input type="email" class="form-control" id="correoRecuperacion" aria-describedby="emailHelp" placeholder="juan@gmail.com"/>
                </div>
                <button type="submit" class="btn btn-primary">Enviar correo de reestablecimiento</button>
            </form>
        </div>

    )
}

export default ReiniciarPasswordUI