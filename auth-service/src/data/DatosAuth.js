const DatosUsuario = require('./DatosUsuario');

class DatosAuth extends DatosUsuario {
    constructor() {
        super();
    }

    async login(email) {
        try {
            // Usar método heredado del padre
            return await this.obtenerUsuarioPorEmail(email);
        } catch (error) {
            console.error('Error en DatosAuth.login:', error);
            throw error;
        }
    }
}

module.exports = DatosAuth;