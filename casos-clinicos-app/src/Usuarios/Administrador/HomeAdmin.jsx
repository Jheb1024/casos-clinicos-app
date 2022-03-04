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
      <div>

        <ul class="navbar1" >
          <li><p>Datos del administrador</p> </li>
          <li><a class="active" href="#home"> Lista de usuarios </a> </li>
          <li><a href="#"> Agregar nuevo usuario </a> </li>
          <li><a href="#"> Lista de temas </a> </li>
          <li><a href="#"> Administrar Cuestiopnarios </a> </li>
        </ul>
      </div>

      <div className="margin-left:25%">

        <div class="w3-container">
          <div class="container-fluid">
            <form class="d-flex">
              <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search"></input>
              <button class="btn btn-outline-success" type="submit">Buscar</button>
            </form>
          </div>
          <div>
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Nombre</th>
                  <th scope="col">Matrícula</th>
                  <th scope="col">Rol</th>
                  <th scope="col">Fecha registro</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">1</th>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
export default HomeAdmin