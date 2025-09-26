const DatosDocente = require('../data/DatosDocente');

class NegocioDocente {
    constructor() {
        this.datosDocente = new DatosDocente();
    }

    async crear(nombre, apellido, email, password, titulo) {
        try {

            // Verificar si email ya existe
            const emailExiste = await this.datosDocente.verificarEmail(email);
            if (emailExiste) {
                return { success: false, error: 'EMAIL_EXISTE', message: 'El email ya está registrado' };
            }

            // Crear docente
            const resultado = await this.datosDocente.crear(nombre, apellido, email, password, titulo);
            return { success: true, data: resultado };

        } catch (error) {
            console.error('Error en NegocioDocente.crear:', error);
            return { success: false, error: 'ERROR_INTERNO', message: 'Error interno del sistema' };
        }
    }

    async actualizar(id, nombre, apellido, email, titulo) {
        try {
            // Validar formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return { success: false, error: 'EMAIL_INVALIDO', message: 'Formato de email inválido' };
            }

            // Actualizar docente
            const resultado = await this.datosDocente.actualizar(id, nombre, apellido, email, titulo);
            if (!resultado) {
                return { success: false, error: 'DOCENTE_NO_ENCONTRADO', message: 'Docente no encontrado' };
            }

            return { success: true, data: resultado };

        } catch (error) {
            console.error('Error en NegocioDocente.actualizar:', error);
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

            const resultado = await this.datosDocente.obtenerPorEmail(email);
            if (!resultado) {
                return { success: false, error: 'DOCENTE_NO_ENCONTRADO', message: 'Docente no encontrado' };
            }

            return { success: true, data: resultado };

        } catch (error) {
            console.error('Error en NegocioDocente.buscarPorEmail:', error);
            return { success: false, error: 'ERROR_INTERNO', message: 'Error interno del sistema' };
        }
    }

    async buscarPorId(id) {
        try {
            const resultado = await this.datosDocente.obtenerPorId(id);
            if (!resultado) {
                return { success: false, error: 'DOCENTE_NO_ENCONTRADO', message: 'Docente no encontrado' };
            }

            return { success: true, data: resultado };

        } catch (error) {
            console.error('Error en NegocioDocente.buscarPorId:', error);
            return { success: false, error: 'ERROR_INTERNO', message: 'Error interno del sistema' };
        }
    }

    async obtenerTodos() {
        try {
            const resultado = await this.datosDocente.obtenerTodos();
            return { success: true, data: resultado };

        } catch (error) {
            console.error('Error en NegocioDocente.obtenerTodos:', error);
            return { success: false, error: 'ERROR_INTERNO', message: 'Error interno del sistema' };
        }
    }
}

module.exports = NegocioDocente;