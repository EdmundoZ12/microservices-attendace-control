const DatosUsuario = require('../datos/DatosUsuario');


class NegocioUsuarioBase {
    constructor(datosEspecifico) {
        this.datosUsuario = new DatosUsuario();
        this.datosEspecifico = datosEspecifico;
    }


    validarEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }


    async crear(nombre, apellido, email, password, datoEspecifico) {
        try {
            // PASO 1: Verificar si el email ya existe (COMÚN)
            const emailExiste = await this.datosUsuario.verificarEmail(email);
            if (emailExiste) {
                return {
                    success: false,
                    error: 'EMAIL_EXISTE',
                    message: 'El email ya está registrado'
                };
            }

            // PASO 2: Obtener el rol específico del tipo de usuario (ABSTRACTO)
            const rol = this.obtenerRol();

            // PASO 3: Crear usuario base en la tabla usuario (COMÚN)
            const usuario = await this.datosUsuario.crear(
                nombre,
                apellido,
                email,
                password,
                rol
            );

            // PASO 4: Crear el perfil específico (ABSTRACTO)
            await this.crearPerfil(usuario.id, datoEspecifico);

            // PASO 5: Retornar resultado exitoso (COMÚN)
            return { success: true, data: usuario };

        } catch (error) {
            console.error(`Error en ${this.constructor.name}.crear:`, error);
            return {
                success: false,
                error: 'ERROR_INTERNO',
                message: 'Error interno del sistema'
            };
        }
    }


    async actualizar(id, nombre, apellido, email, datoEspecifico) {
        try {
            if (!this.validarEmail(email)) {
                return {
                    success: false,
                    error: 'EMAIL_INVALIDO',
                    message: 'Formato de email inválido'
                };
            }

            const usuario = await this.datosUsuario.actualizar(id, nombre, apellido, email);
            if (!usuario) {
                return {
                    success: false,
                    error: `${this.obtenerRol().toUpperCase()}_NO_ENCONTRADO`,
                    message: `${this.obtenerRol()} no encontrado`
                };
            }

            await this.datosEspecifico.actualizar(id, datoEspecifico);

            return { success: true, data: usuario };

        } catch (error) {
            console.error(`Error en ${this.constructor.name}.actualizar:`, error);
            return {
                success: false,
                error: 'ERROR_INTERNO',
                message: 'Error interno del sistema'
            };
        }
    }

    async buscarPorEmail(email) {
        try {
            if (!this.validarEmail(email)) {
                return {
                    success: false,
                    error: 'EMAIL_INVALIDO',
                    message: 'Formato de email inválido'
                };
            }

            const resultado = await this.datosEspecifico.obtenerPorEmail(email);
            if (!resultado) {
                return {
                    success: false,
                    error: `${this.obtenerRol().toUpperCase()}_NO_ENCONTRADO`,
                    message: `${this.obtenerRol()} no encontrado`
                };
            }

            return { success: true, data: resultado };

        } catch (error) {
            console.error(`Error en ${this.constructor.name}.buscarPorEmail:`, error);
            return {
                success: false,
                error: 'ERROR_INTERNO',
                message: 'Error interno del sistema'
            };
        }
    }

    async buscarPorId(id) {
        try {
            const resultado = await this.datosEspecifico.obtenerPorId(id);
            if (!resultado) {
                return {
                    success: false,
                    error: `${this.obtenerRol().toUpperCase()}_NO_ENCONTRADO`,
                    message: `${this.obtenerRol()} no encontrado`
                };
            }

            return { success: true, data: resultado };

        } catch (error) {
            console.error(`Error en ${this.constructor.name}.buscarPorId:`, error);
            return {
                success: false,
                error: 'ERROR_INTERNO',
                message: 'Error interno del sistema'
            };
        }
    }

    async obtenerTodos() {
        try {
            const resultado = await this.datosEspecifico.obtenerTodos();
            return { success: true, data: resultado };

        } catch (error) {
            console.error(`Error en ${this.constructor.name}.obtenerTodos:`, error);
            return {
                success: false,
                error: 'ERROR_INTERNO',
                message: 'Error interno del sistema'
            };
        }
    }

    // ========================================
    // MÉTODOS ABSTRACTOS
    // ========================================


    crearPerfil(usuario_id, datoEspecifico) {
        throw new Error('crearPerfil() debe ser implementado por la subclase');
    }

    obtenerRol() {
        throw new Error('obtenerRol() debe ser implementado por la subclase');
    }
}

module.exports = NegocioUsuarioBase;