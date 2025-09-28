const Database = require("../config/database");

class DatosAsignacion {
    constructor() {
        this.db = new Database();
    }

    async asignar(estudiante_id, materia_id) {
        try {
            const query = await this.db.query(
                "INSERT INTO estudiante_materia (estudiante_id, materia_id) VALUES ($1, $2) RETURNING *",
                [estudiante_id, materia_id]
            );
            return query.rows[0];
        } catch (error) {
            console.error('Error en DatosAsignacion.asignar:', error);
            throw error;
        }
    }

    async verificarAsignacion(estudiante_id, materia_id) {
        try {
            const query = await this.db.query(
                "SELECT * FROM estudiante_materia WHERE estudiante_id = $1 AND materia_id = $2",
                [estudiante_id, materia_id]
            );
            return query.rows.length > 0;
        } catch (error) {
            console.error('Error en DatosAsignacion.verificarAsignacion:', error);
            throw error;
        }
    }

    async verificarEstudianteExiste(estudiante_id) {
        try {
            const query = await this.db.query('SELECT usuario_id FROM estudiante WHERE usuario_id = $1', [estudiante_id]);
            return query.rows.length > 0;
        } catch (error) {
            console.error('Error al verificar estudiante:', error);
            throw error;
        }
    }

    async obtenerEstudiantesPorMateria(materia_id) {
        try {
            const query = await this.db.query(
                `SELECT u.id, u.nombre, u.apellido, u.email, e.carrera 
                 FROM estudiante_materia em 
                 JOIN estudiante e ON em.estudiante_id = e.usuario_id 
                 JOIN usuario u ON e.usuario_id = u.id 
                 WHERE em.materia_id = $1 
                 ORDER BY u.apellido, u.nombre`,
                [materia_id]
            );
            return query.rows;
        } catch (error) {
            console.error('Error en DatosAsignacion.obtenerEstudiantesPorMateria:', error);
            throw error;
        }
    }

    async obtenerMateriasPorEstudiante(estudiante_id) {
        try {
            const query = await this.db.query(
                `SELECT m.id, m.nombre, m.codigo, m.descripcion, m.grupo, m.activo 
                 FROM estudiante_materia em 
                 JOIN materia m ON em.materia_id = m.id 
                 WHERE em.estudiante_id = $1 AND m.activo = true 
                 ORDER BY m.nombre`,
                [estudiante_id]
            );
            return query.rows;
        } catch (error) {
            console.error('Error en DatosAsignacion.obtenerMateriasPorEstudiante:', error);
            throw error;
        }
    }
}

module.exports = DatosAsignacion;