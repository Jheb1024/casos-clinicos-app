import React from "react";

const HomeAlumno = () => {
    return (
        <div>
            <br></br>
            <div className='container px-lg-2'>
                <div class="row mx-lg-n2">

                    <div class="col py-3 px-lg-5 border bg-light">
                        <form name="formRegistroA" method="POST" action="">
                            <fieldset>
                                <br></br>
                                <legend>Información personal</legend>

                                <div class="form-group">
                                    <label for="InputMatricula">Matrícula</label>
                                    <input type="txt" class="form-control" id="InputMatricula" placeholder="202212345" />
                                </div>
                                <div class="form-group">
                                    <label for="InputNombre">Nombre completo</label>
                                    <input type="txt" class="form-control" id="InputNombre" placeholder="Juan Pérez Pérez" />
                                </div>
                                <div class="form-group">
                                    <label for="InputSexo">Sexo</label><br></br>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="checkbox" id="inlineCheckbox1" value="Mujer"></input>
                                        <label class="form-check-label" for="inlineCheckbox1">Mujer</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="checkbox" id="inlineCheckbox2" value="Hombre"></input>
                                        <label class="form-check-label" for="inlineCheckbox2">Hombre</label>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="SelectVeces">¿Cuántas veces a tomado la materia?</label>
                                    <select class="form-select" id="SelectVeces">
                                        <option>Elige una opción</option>
                                        <option>0</option>
                                        <option>1</option>
                                        <option>2</option>
                                        <option>Más de 2</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="SelectEstudios">¿Tiene estudios previos?</label>
                                    <select class="form-select" id="SelectEstudios">
                                        <option>Elige una opción</option>
                                        <option>Si</option>
                                        <option>No</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="InputEmail1">Rol</label>
                                    <input type="email" class="form-control" id="InputEmail" name="InputEmail" value="Alumno" />
                                </div>

                            </fieldset>
                        </form>
                    </div>

                    <div class="col py-3 px-lg-5 border bg-light">
                        <form name="formInfo" method="POST" action="">
                            <fieldset>
                                <br></br>

                                <legend>Resultados de uso</legend>

                                <div class="form-group">
                                    <label for="InputMatricula">Temas completados</label>
                                    <input type="txt" class="form-control" id="InputMatricula" value="" />
                                </div>
                                <div class="form-group">
                                    <label for="InputMatricula">Cuestionarios completados</label>
                                    <input type="txt" class="form-control" id="InputMatricula" value="" />
                                </div>
                                <div class="form-group">
                                    <label for="InputMatricula">Promedio general</label>
                                    <input type="txt" class="form-control" id="InputMatricula" value="" />
                                </div>
                            </fieldset>
                            <br/>
                            <br/>
                            <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                                <button type="submit" class="btn btn-outline-info" name="btnMenuCues" >Contestar nuevo cuestionario</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default HomeAlumno