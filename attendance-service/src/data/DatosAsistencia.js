const Database = require("../config/database");

class DatosAsistencia {
    constructor() {
        this.db = new Database();
    }

    async registrar(estudiante_id, materia_id, fecha, ubicacion_lat, ubicacion_lng) {
        try {
            const query = await this.db.query(
                `INSERT INTO asistencia (estudiante_id, materia_id, fecha, hora_registro, ubicacion_lat, ubicacion_lng) 
                 VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4, $5) RETURNING *`,
                [estudiante_id, materia_id, fecha, ubicacion_lat, ubicacion_lng]
            );
            return query.rows[0];
        } catch (error) {
            console.error('Error en DatosAsistencia.registrar:', error);
            throw error;
        }
    }

    async verificarAsistenciaExiste(estudiante_id, materia_id, fecha) {
        try {
            const query = await this.db.query(
                `SELECT * FROM asistencia WHERE estudiante_id = $1 AND materia_id = $2 AND fecha = $3`,
                [estudiante_id, materia_id, fecha]
            );
            return query.rows.length > 0;
        } catch (error) {
            console.error('Error en DatosAsistencia.verificarAsistenciaExiste:', error);
            throw error;
        }
    }

    async obtenerAsistenciasPorEstudiante(estudiante_id) {
        try {
            let query;
            let params;


            query = `SELECT a.*, m.nombre as materia_nombre, m.codigo as materia_codigo 
                        FROM asistencia a 
                        JOIN materia m ON a.materia_id = m.id 
                        WHERE a.estudiante_id = $1 
                        ORDER BY a.fecha DESC, a.hora_registro DESC`;
            params = [estudiante_id];


            const result = await this.db.query(query, params);
            return result.rows;
        } catch (error) {
            console.error('Error en DatosAsistencia.obtenerAsistenciasPorEstudiante:', error);
            throw error;
        }
    }

    async obtenerAsistenciasPorMateria(materia_id) {
        try {
            let query;
            let params;

            query = `SELECT a.*, u.nombre, u.apellido, u.email, e.carrera 
                        FROM asistencia a 
                        JOIN estudiante e ON a.estudiante_id = e.usuario_id 
                        JOIN usuario u ON e.usuario_id = u.id 
                        WHERE a.materia_id = $1 
                        ORDER BY a.fecha DESC, a.hora_registro ASC`;
            params = [materia_id];

            const result = await this.db.query(query, params);
            return result.rows;
        } catch (error) {
            console.error('Error en DatosAsistencia.obtenerAsistenciasPorMateria:', error);
            throw error;
        }
    }

    async verificarEstudianteInscrito(estudiante_id, materia_id) {
        try {
            const query = await this.db.query(
                'SELECT * FROM estudiante_materia WHERE estudiante_id = $1 AND materia_id = $2',
                [estudiante_id, materia_id]
            );
            return query.rows.length > 0;
        } catch (error) {
            console.error('Error al verificar inscripción:', error);
            throw error;
        }
    }

    async verificarMateriaActiva(materia_id) {
        try {
            const query = await this.db.query(
                'SELECT id, latitud, longitud FROM materia WHERE id = $1 AND activo = true',
                [materia_id]
            );
            return query.rows[0] || null;
        } catch (error) {
            console.error('Error al verificar materia:', error);
            throw error;
        }
    }

    async obtenerHorarioMateria(materia_id, dia_semana) {
        try {
            const query = await this.db.query(
                'SELECT * FROM horario WHERE materia_id = $1 AND dia_semana = $2',
                [materia_id, dia_semana]
            );
            return query.rows;
        } catch (error) {
            console.error('Error al obtener horarios:', error);
            throw error;
        }
    }
}

module.exports = DatosAsistencia;