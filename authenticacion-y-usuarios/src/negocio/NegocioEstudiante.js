const DatosUsuario = require('../datos/DatosUsuario');
const DatosEstudiante = require('../datos/DatosEstudiante');

class NegocioEstudiante {
    constructor() {
        this.datosUsuario = new DatosUsuario();
        this.datosEstudiante = new DatosEstudiante();
    }

    async crear(nombre, apellido, email, password, carrera) {
        try {
            // Verificar si email ya existe
            const emailExiste = await this.datosUsuario.verificarEmail(email);
            if (emailExiste) {
                return { success: false, error: 'EMAIL_EXISTE', message: 'El email ya está registrado' };
            }

            // PASO 1: Crear usuario primero
            const usuario = await this.datosUsuario.crear(nombre, apellido, email, password, 'estudiante');

            // PASO 2: Crear estudiante después
            await this.datosEstudiante.crear(usuario.id, carrera);

            return { success: true, data: usuario };

        } catch (error) {
            console.error('Error en NegocioEstudiante.crear:', error);
            return { success: false, error: 'ERROR_INTERNO', message: 'Error interno del sistema' };
        }
    }

    async actualizar(id, nombre, apellido, email, carrera) {
        try {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return { success: false, error: 'EMAIL_INVALIDO', message: 'Formato de email inválido' };
            }

            // PASO 1: Actualizar usuario
            const usuario = await this.datosUsuario.actualizar(id, nombre, apellido, email);
            if (!usuario) {
                return { success: false, error: 'ESTUDIANTE_NO_ENCONTRADO', message: 'Estudiante no encontrado' };
            }

            // PASO 2: Actualizar estudiante
            await this.datosEstudiante.actualizar(id, carrera);

            return { success: true, data: usuario };

        } catch (error) {
            console.error('Error en NegocioEstudiante.actualizar:', error);
            return { success: false, error: 'ERROR_INTERNO', message: 'Error interno del sistema' };
        }
    }

    async buscarPorEmail(email) {
        try {
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