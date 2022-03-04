import React from "react";
import { submitHandler } from "./funcRegistroDocente";

function RegistroDocente() {
    return (
        <div className="container px-lg-2">
            <div class="row mx-lg-n2">
                <div className="col py-3 px-lg-5 border bg-light text-align:center">
                    <img
                        src="https://us.123rf.com/450wm/stylephotographs/stylephotographs1710/stylephotographs171000262/88557664-mujer-joven-como-estudiante-de-medicina-con-laptop-aprender-en-aprendizaje.jpg?ver=6"
                        width="550"
                        height="380"
                    ></img>
                    <img
                        src="https://us.123rf.com/450wm/stylephotographs/stylephotographs1710/stylephotographs171000262/88557664-mujer-joven-como-estudiante-de-medicina-con-laptop-aprender-en-aprendizaje.jpg?ver=6"
                        width="550"
                        height="380"
                    ></img>
                </div>
                <div class="col py-3 px-lg-2 border bg-light">
                    <form onSubmit={submitHandler}>
                        <fieldset>
                            <legend>Registro Docente</legend>
                            <small id="emailHelp" class="form-text text-muted">
                                No compartiremos tu información
                            </small>
                            <div class="form-group">
                                <label for="matriculaDoc">Matrícula</label>
                                <input
                                    type="txt"
                                    class="form-control"
                                    id="matriculaDoc"
                                    placeholder="202212345"
                                    required
                                />
                            </div>
                            <div class="form-group">
                                <label for="nombreDoc">Nombre completo</label>
                                <input
                                    type="txt"
                                    class="form-control"
                                    id="nombreDoc"
                                    placeholder="Juan Pérez Pérez"
                                    required
                                />
                            </div>
                            <div class="form-group">
                                <label for="sexoDoc">Sexo</label>
                                <br></br>
                                <select class="form-select" id="sexoDoc" required>
                                    <option>Elige una opción</option>
                                    <option>Mujer</option>
                                    <option>Hombre</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="edadDoc">Edad</label>
                                <input
                                    type="number"
                                    class="form-control"
                                    id="edadDoc"
                                    name="edadDoc"
                                    min="18"
                                    max="80"
                                    placeholder="18"
                                    required
                                />
                            </div>
                            <div class="form-group">
                                <label for="nrcDoc">NRC</label>
                                <input
                                    type="text"
                                    class="form-control"
                                    id="nrcDoc"
                                    name="nrcDoc"
                                    placeholder="456123"
                                    required
                                />
                            </div>
                            <div class="form-group">
                                <label for="emailDoc">Correo electrónico</label>
                                <input
                                    type="email"
                                    class="form-control"
                                    id="emailDoc"
                                    aria-describedby="emailHelp"
                                    placeholder="Correo"
                                    required
                                />
                            </div>
                            <div class="form-group">
                                <label for="passwordDoc">Contraseña</label>
                                <input
                                    type="password"
                                    class="form-control"
                                    id="passwordDoc"
                                    placeholder="Constraseña"
                                    required
                                />
                            </div>
                            <div class="form-group">
                                <label for="passwordDoc2">Confirmar Contraseña</label>
                                <input
                                    type="password"
                                    class="form-control"
                                    id="passwordDoc2"
                                    placeholder="Constraseña"
                                    required
                                />
                            </div>
                        </fieldset>
                        <br />
                        <label for="txt">
                            ¿Ya tienes una cuenta? <a href="/inicio-sesion">Iniciar Sesión</a>
                        </label>
                        <br />
                        <div>
                            <input
                                type="submit"
                                class="btn btn-success"
                                value="Registrarme"
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default RegistroDocente;
