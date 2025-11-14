const NegocioUsuarioBase = require('./NegocioUsuarioBase');
const DatosDocente = require('../datos/DatosDocente');

class NegocioDocente extends NegocioUsuarioBase {
    constructor() {
        const datosDocente = new DatosDocente();
        super(datosDocente);
    }


    crearPerfil(usuario_id, titulo) {
        return this.datosEspecifico.crear(usuario_id, titulo);
    }

    obtenerRol() {
        return 'docente';
    }

}

module.exports = NegocioDocente;