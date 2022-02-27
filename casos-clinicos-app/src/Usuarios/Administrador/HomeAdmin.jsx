import React from "react";
import { getAuth } from "firebase/auth";
const HomeAdmin = () => {
    

const auth = getAuth();
const user = auth.currentUser;
if (user !== null) {
  // The user object has basic properties such as display name, email, etc.
  const displayName = user.displayName;
  const email = user.email;
  const photoURL = user.photoURL;
  const emailVerified = user.emailVerified;
  console.log("Datos del usuario desed el apartado del admin")
    console.log(user);
    console.log(email);
 //Aqui podemos tomar el user UID para poder realizar una búsqueda del rol
 //Para ello debemos crear tabla de usuarios con correo y el rol para realizar solo una lectura
 //es decir ejecutamos la consulta para saber el rol de la persona que se está loguaendo
 
  const uid = user.uid;
}
    return (
        <div>
         <p>Sesion de administrador</p>
         
        </div>
    );
}
export default HomeAdmin