const Database = require("../config/database");
const bcrypt = require('bcrypt');

class DatosDocente {
    constructor() {
        this.db = new Database();
    }

    async crear(nombre, apellido, email, password, titulo) {
        try {
            const hashPassword = bcrypt.hashSync(password, 10);
            const query = await this.db.query("INSERT INTO usuario (nombre, apellido, email, password, rol) VALUES ($1, $2, $3, $4, $5) RETURNING *", [nombre, apellido, email, hashPassword, 'docente']);
            const idUsuario = query.rows[0].id;
            await this.db.query("INSERT INTO docente (usuario_id, titulo) VALUES ($1, $2) RETURNING *", [idUsuario, titulo]);
            return query.rows[0];
        } catch (error) {
            console.error('Error al crear usuario:', error);
            throw error;
        }
    }

    async actualizar(id, nombre, apellido, email, titulo) {
        try {
            const queryUsuario = await this.db.query(
                "UPDATE usuario SET nombre = $1, apellido = $2, email = $3 WHERE id = $4 RETURNING *",
                [nombre, apellido, email, id]
            );

            await this.db.query(
                "UPDATE docente SET titulo = $1 WHERE usuario_id = $2",
                [titulo, id]
            );

            return queryUsuario.rows[0];
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            throw error;
        }
    }

    async obtenerPorEmail(email) {
        try {
            const query = await this.db.query("SELECT u.id, u.nombre, u.apellido, u.email, d.titulo FROM usuario u JOIN docente d ON u.id = d.usuario_id WHERE u.email=$1", [email]);
            return query.rows[0] || null;
        } catch (error) {
            console.error('Error al obtener usuario por email:', error);
            throw error;
        }
    }

    async obtenerPorId(id) {
        try {
            const query = await this.db.query("SELECT u.id, u.nombre, u.apellido, u.email, d.titulo FROM usuario u JOIN docente d ON u.id = d.usuario_id WHERE u.id=$1", [id]);
            return query.rows[0] || null;
        } catch (error) {
            console.error('Error al obtener usuario por id:', error);
            throw error;
        }
    }

    async obtenerTodos() {
        try {
            const query = await this.db.query("SELECT u.id, u.nombre, u.apellido, u.email, d.titulo FROM usuario u JOIN docente d ON u.id = d.usuario_id WHERE u.rol = 'docente' ORDER BY u.apellido, u.nombre");
            return query.rows;
        } catch (error) {
            console.error('Error al obtener todos los docentes:', error);
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
}

module.exports = DatosDocente;