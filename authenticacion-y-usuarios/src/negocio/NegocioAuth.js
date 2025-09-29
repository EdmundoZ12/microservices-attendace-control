const DatosAuth = require('../datos/DatosAuth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class NegocioAuth {
    constructor() {
        this.datosAuth = new DatosAuth();
    }

    async login(email, password) {
        try {
            // Obtener usuario de la base de datos
            const usuario = await this.datosAuth.obtenerUsuarioPorEmail(email);
            if (!usuario) {
                return { success: false, error: 'CREDENCIALES_INVALIDAS', message: 'Email o contraseña incorrectos' };
            }

            // Verificar contraseña
            const passwordValido = await bcrypt.compare(password, usuario.password);
            if (!passwordValido) {
                return { success: false, error: 'CREDENCIALES_INVALIDAS', message: 'Email o contraseña incorrectos' };
            }

            // Generar JWT token
            const tokenPayload = {
                id: usuario.id,
                email: usuario.email,
                rol: usuario.rol
            };

            const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN || '24h'
            });

            // Retornar datos sin contraseña
            return {
                success: true,
                data: {
                    token: token,
                    user: {
                        id: usuario.id,
                        nombre: usuario.nombre,
                        apellido: usuario.apellido,
                        email: usuario.email,
                        rol: usuario.rol
                    }
                }
            };

        } catch (error) {
            console.error('Error en NegocioAuth.login:', error);
            return { success: false, error: 'ERROR_INTERNO', message: 'Error interno del sistema' };
        }
    }
}

module.exports = NegocioAuth;