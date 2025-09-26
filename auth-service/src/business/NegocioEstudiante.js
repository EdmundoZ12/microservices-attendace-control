const DatosEstudiante = require('../data/DatosEstudiante');

class NegocioEstudiante {
    constructor() {
        this.datosEstudiante = new DatosEstudiante();
    }

    async crear(nombre, apellido, email, password, carrera) {
        try {

            // Verificar si email ya existe
            const emailExiste = await this.datosEstudiante.verificarEmail(email);
            if (emailExiste) {
                return { success: false, error: 'EMAIL_EXISTE', message: 'El email ya está registrado' };
            }

            // Crear estudiante
            const resultado = await this.datosEstudiante.crear(nombre, apellido, email, password, carrera);
            return { success: true, data: resultado };

        } catch (error) {
            console.error('Error en NegocioEstudiante.crear:', error);
            return { success: false, error: 'ERROR_INTERNO', message: 'Error interno del sistema' };
        }
    }

    async actualizar(id, nombre, apellido, email, carrera) {
        try {
            // Validar formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return { success: false, error: 'EMAIL_INVALIDO', message: 'Formato de email inválido' };
            }

            // Actualizar estudiante
            const resultado = await this.datosEstudiante.actualizar(id, nombre, apellido, email, carrera);
            if (!resultado) {
                return { success: false, error: 'ESTUDIANTE_NO_ENCONTRADO', message: 'Estudiante no encontrado' };
            }

            return { success: true, data: resultado };

        } catch (error) {
            console.error('Error en NegocioEstudiante.actualizar:', error);
            return { success: false, error: 'ERROR_INTERNO', message: 'Error interno del sistema' };
        }
    }

    async buscarPorEmail(email) {
        try {
            // Validar formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return { success: false, error: 'EMAIL_INVALIDO', message: 'Formato de email inválido' };
            }

            const resultado = await this.datosEstudiante.obtenerPorEmail(email);
            if (!resultado) {
                return { success: false, error: 'ESTUDIANTE_NO_ENCONTRADO', message: 'Estudiante no encontrado' };
            }

            return { success: true, data: resultado };

        } catch (error) {
            console.error('Error en NegocioEstudiante.buscarPorEmail:', error);
            return { success: false, error: 'ERROR_INTERNO', message: 'Error interno del sistema' };
        }
    }

    async buscarPorId(id) {
        try {
            const resultado = await this.datosEstudiante.obtenerPorId(id);
            if (!resultado) {
                return { success: false, error: 'ESTUDIANTE_NO_ENCONTRADO', message: 'Estudiante no encontrado' };
            }

            return { success: true, data: resultado };

        } catch (error) {
            console.error('Error en NegocioEstudiante.buscarPorId:', error);
            return { success: false, error: 'ERROR_INTERNO', message: 'Error interno del sistema' };
        }
    }

    async obtenerTodos() {
        try {
            const resultado = await this.datosEstudiante.obtenerTodos();
            return { success: true, data: resultado };

        } catch (error) {
            console.error('Error en NegocioEstudiante.obtenerTodos:', error);
            return { success: false, error: 'ERROR_INTERNO', message: 'Error interno del sistema' };
        }
    }

}

module.exports = NegocioEstudiante;