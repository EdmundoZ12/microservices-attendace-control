const Database = require("../config/database");
const bcrypt = require('bcrypt');

class DatosEstudiante {
    constructor() {
        this.db = new Database();
    }

    async crear(nombre, apellido, email, password, carrera) {
        try {
            const hashPassword = bcrypt.hashSync(password, 10);
            const query = await this.db.query("INSERT INTO usuario (nombre, apellido, email, password, rol) VALUES ($1, $2, $3, $4, $5) RETURNING *", [nombre, apellido, email, hashPassword, 'estudiante']);
            const idUsuario = query.rows[0].id;
            await this.db.query("INSERT INTO estudiante (usuario_id, carrera) VALUES ($1, $2) RETURNING *", [idUsuario, carrera]);
            return query.rows[0];
        } catch (error) {
            console.error('Error al crear usuario:', error);
            throw error;
        }
    }

    async actualizar(id, nombre, apellido, email, carrera) {
        try {
            const queryUsuario = await this.db.query(
                "UPDATE usuario SET nombre = $1, apellido = $2, email = $3 WHERE id = $4 RETURNING *",
                [nombre, apellido, email, id]
            );

            await this.db.query(
                "UPDATE estudiante SET carrera = $1 WHERE usuario_id = $2",
                [carrera, id]
            );

            return queryUsuario.rows[0];
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            throw error;
        }
    }

    async obtenerPorEmail(email) {
        try {
            const query = await this.db.query("SELECT u.id, u.nombre, u.apellido, u.email, e.carrera FROM usuario u JOIN estudiante e ON u.id = e.usuario_id WHERE u.email=$1", [email]);
            return query.rows[0] || null;
        } catch (error) {
            console.error('Error al obtener usuario por email:', error);
            throw error;
        }
    }

    async obtenerPorId(id) {
        try {
            const query = await this.db.query("SELECT u.id, u.nombre, u.apellido, u.email, e.carrera FROM usuario u JOIN estudiante e ON u.id = e.usuario_id WHERE u.id=$1", [id]);
            return query.rows[0] || null;
        } catch (error) {
            console.error('Error al obtener usuario por id:', error);
            throw error;
        }
    }

    async obtenerTodos() {
        try {
            const query = await this.db.query("SELECT u.id, u.nombre, u.apellido, u.email, e.carrera FROM usuario u JOIN estudiante e ON u.id = e.usuario_id WHERE u.rol = 'estudiante' ORDER BY u.apellido, u.nombre");
            return query.rows;
        } catch (error) {
            console.error('Error al obtener todos los estudiantes:', error);
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

module.exports = DatosEstudiante;