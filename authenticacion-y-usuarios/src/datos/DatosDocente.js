const Database = require("../config/database");

class DatosDocente {
    constructor() {
        this.db = new Database();
    }

    async crear(usuario_id, titulo) {
        try {
            await this.db.query(
                "INSERT INTO docente (usuario_id, titulo) VALUES ($1, $2)",
                [usuario_id, titulo]
            );
            return { usuario_id, titulo };
        } catch (error) {
            console.error('Error al crear docente:', error);
            throw error;
        }
    }

    async actualizar(usuario_id, titulo) {
        try {
            await this.db.query(
                "UPDATE docente SET titulo = $1 WHERE usuario_id = $2",
                [titulo, usuario_id]
            );
            return { usuario_id, titulo };
        } catch (error) {
            console.error('Error al actualizar docente:', error);
            throw error;
        }
    }

    async obtenerPorEmail(email) {
        try {
            const query = await this.db.query(
                "SELECT u.id, u.nombre, u.apellido, u.email, d.titulo FROM usuario u JOIN docente d ON u.id = d.usuario_id WHERE u.email=$1",
                [email]
            );
            return query.rows[0] || null;
        } catch (error) {
            console.error('Error al obtener docente por email:', error);
            throw error;
        }
    }

    async obtenerPorId(id) {
        try {
            const query = await this.db.query(
                "SELECT u.id, u.nombre, u.apellido, u.email, d.titulo FROM usuario u JOIN docente d ON u.id = d.usuario_id WHERE u.id=$1",
                [id]
            );
            return query.rows[0] || null;
        } catch (error) {
            console.error('Error al obtener docente por id:', error);
            throw error;
        }
    }

    async obtenerTodos() {
        try {
            const query = await this.db.query(
                "SELECT u.id, u.nombre, u.apellido, u.email, d.titulo FROM usuario u JOIN docente d ON u.id = d.usuario_id ORDER BY u.apellido, u.nombre"
            );
            return query.rows;
        } catch (error) {
            console.error('Error al obtener docentes:', error);
            throw error;
        }
    }
}

module.exports = DatosDocente;