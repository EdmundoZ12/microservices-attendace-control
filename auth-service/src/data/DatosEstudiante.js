const DatosUsuario = require('./DatosUsuario');

class DatosEstudiante extends DatosUsuario {
    constructor() {
        super();
    }

    async crear(nombre, apellido, email, password, carrera) {
        try {
            // Usar método heredado del padre
            const usuario = await this.crear(nombre, apellido, email, password, 'estudiante');

            // Crear registro específico de estudiante
            await this.db.query("INSERT INTO estudiante (usuario_id, carrera) VALUES ($1, $2)", [usuario.id, carrera]);

            return usuario;
        } catch (error) {
            console.error('Error al crear estudiante:', error);
            throw error;
        }
    }

    async actualizar(id, nombre, apellido, email, carrera) {
        try {
            // Usar método heredado del padre
            const usuario = await this.actualizar(id, nombre, apellido, email);

            // Actualizar datos específicos de estudiante
            await this.db.query("UPDATE estudiante SET carrera = $1 WHERE usuario_id = $2", [carrera, id]);

            return usuario;
        } catch (error) {
            console.error('Error al actualizar estudiante:', error);
            throw error;
        }
    }

    async obtenerPorEmail(email) {
        try {
            const query = await this.db.query(
                "SELECT u.id, u.nombre, u.apellido, u.email, e.carrera FROM usuario u JOIN estudiante e ON u.id = e.usuario_id WHERE u.email=$1",
                [email]
            );
            return query.rows[0] || null;
        } catch (error) {
            console.error('Error al obtener estudiante por email:', error);
            throw error;
        }
    }

    async obtenerPorId(id) {
        try {
            const query = await this.db.query(
                "SELECT u.id, u.nombre, u.apellido, u.email, e.carrera FROM usuario u JOIN estudiante e ON u.id = e.usuario_id WHERE u.id=$1",
                [id]
            );
            return query.rows[0] || null;
        } catch (error) {
            console.error('Error al obtener estudiante por id:', error);
            throw error;
        }
    }

    async obtenerTodos() {
        try {
            const query = await this.db.query(
                "SELECT u.id, u.nombre, u.apellido, u.email, e.carrera FROM usuario u JOIN estudiante e ON u.id = e.usuario_id ORDER BY u.apellido, u.nombre"
            );
            return query.rows;
        } catch (error) {
            console.error('Error al obtener estudiantes:', error);
            throw error;
        }
    }
}

module.exports = DatosEstudiante;