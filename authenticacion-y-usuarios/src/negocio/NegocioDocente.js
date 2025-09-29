const DatosUsuario = require('../datos/DatosUsuario');
const DatosDocente = require('../datos/DatosDocente');

class NegocioDocente {
    constructor() {
        this.datosUsuario = new DatosUsuario();
        this.datosDocente = new DatosDocente();
    }

    async crear(nombre, apellido, email, password, titulo) {
        try {
            // Verificar si email ya existe
            const emailExiste = await this.datosUsuario.verificarEmail(email);
            if (emailExiste) {
                return { success: false, error: 'EMAIL_EXISTE', message: 'El email ya está registrado' };
            }

            // PASO 1: Crear usuario primero
            const usuario = await this.datosUsuario.crear(nombre, apellido, email, password, 'docente');

            // PASO 2: Crear docente después
            await this.datosDocente.crear(usuario.id, titulo);

            return { success: true, data: usuario };

        } catch (error) {
            console.error('Error en NegocioDocente.crear:', error);
            return { success: false, error: 'ERROR_INTERNO', message: 'Error interno del sistema' };
        }
    }

    async actualizar(id, nombre, apellido, email, titulo) {
        try {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return { success: false, error: 'EMAIL_INVALIDO', message: 'Formato de email inválido' };
            }

            // PASO 1: Actualizar usuario
            const usuario = await this.datosUsuario.actualizar(id, nombre, apellido, email);
            if (!usuario) {
                return { success: false, error: 'DOCENTE_NO_ENCONTRADO', message: 'Docente no encontrado' };
            }

            // PASO 2: Actualizar docente
            await this.datosDocente.actualizar(id, titulo);

            return { success: true, data: usuario };

        } catch (error) {
            console.error('Error en NegocioDocente.actualizar:', error);
            return { success: false, error: 'ERROR_INTERNO', message: 'Error interno del sistema' };
        }
    }

    async buscarPorEmail(email) {
        try {
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