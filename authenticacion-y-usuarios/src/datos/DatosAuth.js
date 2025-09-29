const Database = require("../config/database");

class DatosAuth {
    constructor() {
        this.db = new Database();
    }

    async obtenerUsuarioPorEmail(email) {
        try {
            const query = await this.db.query('SELECT * FROM usuario WHERE email=$1', [email]);
            return query.rows[0] || null;
        } catch (error) {
            console.error('Error al obtener usuario por email:', error);
            throw error;
        }
    }
}

module.exports = DatosAuth;