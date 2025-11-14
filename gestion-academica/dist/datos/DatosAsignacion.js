"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
class DatosAsignacion {
    constructor() {
        this.db = database_1.default.getInstance();
    }
    async asignar(estudiante_id, materia_id) {
        const query = `
            INSERT INTO asignacion (estudiante_id, materia_id)
            VALUES ($1, $2)
            RETURNING *
        `;
        const result = await this.db.query(query, [estudiante_id, materia_id]);
        return result.rows[0];
    }
    async verificarAsignacion(estudiante_id, materia_id) {
        const query = `
            SELECT 1 FROM asignacion
            WHERE estudiante_id = $1 AND materia_id = $2
        `;
        const result = await this.db.query(query, [estudiante_id, materia_id]);
        return result.rows.length > 0;
    }
    async verificarEstudianteExiste(estudiante_id) {
        const query = `SELECT 1 FROM estudiante WHERE usuario_id = $1`;
        const result = await this.db.query(query, [estudiante_id]);
        return result.rows.length > 0;
    }
    async obtenerEstudiantesPorMateria(materia_id) {
        const query = `
            SELECT 
                u.id as usuario_id,
                u.nombre,
                u.apellido,
                u.email,
                e.carrera
            FROM asignacion a
            INNER JOIN estudiante e ON a.estudiante_id = e.usuario_id
            INNER JOIN usuario u ON e.usuario_id = u.id
            WHERE a.materia_id = $1
            ORDER BY u.apellido, u.nombre
        `;
        const result = await this.db.query(query, [materia_id]);
        return result.rows;
    }
    async obtenerMateriasPorEstudiante(estudiante_id) {
        const query = `
            SELECT 
                m.id,
                m.nombre,
                m.codigo,
                m.grupo,
                m.descripcion
            FROM asignacion a
            INNER JOIN materia m ON a.materia_id = m.id
            WHERE a.estudiante_id = $1 AND m.activo = TRUE
            ORDER BY m.nombre
        `;
        const result = await this.db.query(query, [estudiante_id]);
        return result.rows;
    }
    async desasignar(estudiante_id, materia_id) {
        const query = `
            DELETE FROM asignacion
            WHERE estudiante_id = $1 AND materia_id = $2
        `;
        await this.db.query(query, [estudiante_id, materia_id]);
    }
}
exports.default = DatosAsignacion;
