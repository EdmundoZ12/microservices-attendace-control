const Database = require("../config/database");

class DatosHorario {
    constructor() {
        this.db = new Database();
    }

    async crear(materia_id, dia_semana, hora_inicio, hora_fin) {
        try {
            const query = await this.db.query(
                "INSERT INTO horario (materia_id, dia_semana, hora_inicio, hora_fin) VALUES ($1, $2, $3, $4) RETURNING *",
                [materia_id, dia_semana, hora_inicio, hora_fin]
            );
            return query.rows[0];
        } catch (error) {
            console.error('Error en DatosHorario.crear:', error);
            throw error;
        }
    }

    async actualizar(horario_id, dia_semana, hora_inicio, hora_fin) {
        try {
            const query = await this.db.query(
                "UPDATE horario SET dia_semana = $1, hora_inicio = $2, hora_fin = $3 WHERE id = $4 RETURNING *",
                [dia_semana, hora_inicio, hora_fin, horario_id]
            );
            return query.rows[0] || null;
        } catch (error) {
            console.error('Error en DatosHorario.actualizar:', error);
            throw error;
        }
    }

    async eliminar(horario_id) {
        try {
            const query = await this.db.query(
                "DELETE FROM horario WHERE id = $1 RETURNING *",
                [horario_id]
            );
            return query.rows[0] || null;
        } catch (error) {
            console.error('Error en DatosHorario.eliminar:', error);
            throw error;
        }
    }

    async eliminarTodos(materia_id) {
        try {
            await this.db.query("DELETE FROM horario WHERE materia_id = $1", [materia_id]);
            return true;
        } catch (error) {
            console.error('Error en DatosHorario.eliminarTodos:', error);
            throw error;
        }
    }

    async obtenerPorMateria(materia_id) {
        try {
            const query = await this.db.query("SELECT * FROM horario WHERE materia_id = $1 ORDER BY dia_semana, hora_inicio", [materia_id]);
            return query.rows;
        } catch (error) {
            console.error('Error en DatosHorario.obtenerPorMateria:', error);
            throw error;
        }
    }

    async obtenerPorId(horario_id) {
        try {
            const query = await this.db.query("SELECT * FROM horario WHERE id = $1", [horario_id]);
            return query.rows[0] || null;
        } catch (error) {
            console.error('Error en DatosHorario.obtenerPorId:', error);
            throw error;
        }
    }
}

module.exports = DatosHorario;