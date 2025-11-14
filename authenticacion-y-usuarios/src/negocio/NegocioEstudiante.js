const NegocioUsuarioBase = require('./NegocioUsuarioBase');
const DatosEstudiante = require('../datos/DatosEstudiante');


class NegocioEstudiante extends NegocioUsuarioBase {
    constructor() {
        const datosEstudiante = new DatosEstudiante();
        super(datosEstudiante);
    }

    /**
     * Implementación del método abstracto
     * Crea el registro específico en la tabla estudiante
     */
    crearPerfil(usuario_id, carrera) {
        return this.datosEspecifico.crear(usuario_id, carrera);
    }

    obtenerRol() {
        return 'estudiante';
    }

}

module.exports = NegocioEstudiante;