const Database = require("../config/database");

class DatosMateria {
    constructor() {
        this.db = new Database();
    }

    async crear(nombre, codigo, descripcion, grupo, docente_id, latitud, longitud) {
        try {
            const query = await this.db.query(
                "INSERT INTO materia (nombre, codigo, descripcion, grupo, docente_id, latitud, longitud, activo) VALUES ($1, $2, $3, $4, $5, $6, $7, true) RETURNING *",
                [nombre, codigo, descripcion, grupo, docente_id, latitud, longitud]
            );
            return query.rows[0];
        } catch (error) {
            console.error('Error en DatosMateria.crear:', error);
            throw error;
        }
    }

    async actualizar(id, nombre, codigo, descripcion, grupo, latitud, longitud, activo) {
        try {
            const query = await this.db.query(
                "UPDATE materia SET nombre = $1, codigo = $2, descripcion = $3, grupo = $4, latitud = $5, longitud = $6, activo = $7 WHERE id = $8 RETURNING *",
                [nombre, codigo, descripcion, grupo, latitud, longitud, activo, id]
            );

            
            return query.rows[0] || null;
        } catch (error) {
            console.error('Error en DatosMateria.actualizar:', error);
            throw error;
        }
    }

    async cambiarEstado(id) {
        try {
            // Primero obtener el estado actual
            const materiaActual = await this.db.query("SELECT activo FROM materia WHERE id = $1", [id]);

            if (materiaActual.rows.length === 0) {
                return null;
            }

            // Cambiar al estado opuesto
            const nuevoEstado = !materiaActual.rows[0].activo;

            const query = await this.db.query(
                "UPDATE materia SET activo = $1 WHERE id = $2 RETURNING *",
                [nuevoEstado, id]
            );
            return query.rows[0] || null;
        } catch (error) {
            console.error('Error en DatosMateria.cambiarEstado:', error);
            throw error;
        }
    }

    async obtenerPorId(id) {
        try {
            const query = await this.db.query("SELECT * FROM materia WHERE id = $1", [id]);
            return query.rows[0] || null;
        } catch (error) {
            console.error('Error en DatosMateria.obtenerPorId:', error);
            throw error;
        }
    }

    async obtenerTodasPorDocente(docente_id) {
        try {
            const query = await this.db.query("SELECT * FROM materia WHERE docente_id = $1 ORDER BY nombre", [docente_id]);
            return query.rows;
        } catch (error) {
            console.error('Error en DatosMateria.obtenerTodasPorDocente:', error);
            throw error;
        }
    }

    async verificarDocenteExiste(docente_id) {
        try {
            console.log('Verificando existencia de docente con ID:', docente_id);
            const query = await this.db.query('SELECT usuario_id FROM docente WHERE usuario_id = $1', [docente_id]);
            console.log('Query result in verificarDocenteExiste:', query.rows);

            return query.rows.length > 0;
        } catch (error) {
            console.error('Error al verificar docente:', error);
            throw error;
        }
    }
}

module.exports = DatosMateria;