const Database = require("../config/database");
const bcrypt = require('bcrypt');

class DatosUsuario {
    constructor() {
        this.db = new Database();
    }

    async crear(nombre, apellido, email, password, rol) {
        try {
            const hashPassword = await bcrypt.hash(password, 10);
            const query = await this.db.query(
                "INSERT INTO usuario (nombre, apellido, email, password, rol) VALUES ($1, $2, $3, $4, $5) RETURNING *",
                [nombre, apellido, email, hashPassword, rol]
            );
            return query.rows[0];
        } catch (error) {
            console.error('Error al crear usuario:', error);
            throw error;
        }
    }

    async actualizar(id, nombre, apellido, email) {
        try {
            const query = await this.db.query(
                "UPDATE usuario SET nombre = $1, apellido = $2, email = $3 WHERE id = $4 RETURNING *",
                [nombre, apellido, email, id]
            );
            return query.rows[0] || null;
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            throw error;
        }
    }

    async verificarEmail(email) {
        try {
            const query = await this.db.query('SELECT * FROM usuario WHERE email=$1', [email]);
            return query.rows.length > 0;
        } catch (error) {
            console.error('Error al verificar email:', error);
            throw error;
        }
    }

    async obtenerPorEmail(email) {
        try {
            const query = await this.db.query('SELECT * FROM usuario WHERE email=$1', [email]);
            return query.rows[0] || null;
        } catch (error) {
            console.error('Error al obtener usuario:', error);
            throw error;
        }
    }
}

module.exports = DatosUsuario;