import Usuario from "c:/Users/jhan_/Documents/casosc-app/casos-clinicos-app/casos-clinicos-app/src/Modelo/Usuarios/Usuario";

export default class Alumno extends Usuario {
    email;
    password;
    rol;

    nombre;
    apellidoPaterno;
    apellidoMaterno;
    edad;
    estudiosPrevios;
    fechaRegistro;    
    matricula;
    nrc;
    numVecesTomadoMateria;
    sexo;

    constructor(email,
        password,
        rol,
        nombre,
        apellidoPaterno,
        apellidoMaterno,
        edad,
        estudiosPrevios,
        fechaRegistro,       
        matricula,
        nrc,
        numVecesTomadoMateria,
        sexo) 
    {
        super();
        this.email = email;
        this.password = password;
        this.rol = rol;

        this.nombre = nombre;
        this.apellidoPaterno = apellidoPaterno;
        this.apellidoMaterno = apellidoMaterno;
        this.edad = edad;
        this.estudiosPrevios = estudiosPrevios;
        this.fechaRegistro = fechaRegistro;
        this.matricula = matricula;
        this.nrc = nrc;
        this.numVecesTomadoMateria = numVecesTomadoMateria;
        this.sexo = sexo;

    }

    getNombre() {
        return this.nombre;
    }
    getApellidoPaterno() {
        return this.apellidoPaterno;
    }
    getApellidoMaterno() {
        return this.apellidoMaterno;
    }
    getEdad() {
        return this.edad;
    }
    getEstudiosPrevios() {
        return this.estudiosPrevios;
    }
    getFechaRegistro() {
        return this.fechaRegistro;
    }
    getMatricula() {
        return this.matricula;
    }
    getNRC() {
        return this.nrc;
    }
    getNumVecesTomadoMateria() {
        return this.numVecesTomadoMateria;
    }
    getSexo() {
        return this.sexo;
    }

    getEmail() {
        return this.email;
    }
    getPassword() {
        return this.password;
    }

    getRol() {
        return this.rol;
    }



}