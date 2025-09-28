const DatosUsuario = require('./DatosUsuario');

class DatosDocente extends DatosUsuario {
    constructor() {
        super();
    }

    async crear(nombre, apellido, email, password, titulo) {
        try {
            // ✅ CORRECTO - Usar super para llamar al método del padre
            const usuario = await super.crear(nombre, apellido, email, password, 'docente');

            // Crear registro específico de docente
            await this.db.query("INSERT INTO docente (usuario_id, titulo) VALUES ($1, $2)", [usuario.id, titulo]);

            return usuario;
        } catch (error) {
            console.error('Error al crear docente:', error);
            throw error;
        }
    }

    async actualizar(id, nombre, apellido, email, titulo) {
        try {
            // ✅ CORRECTO - Usar super para llamar al método del padre
            const usuario = await super.actualizar(id, nombre, apellido, email);

            // Actualizar datos específicos de docente
            await this.db.query("UPDATE docente SET titulo = $1 WHERE usuario_id = $2", [titulo, id]);

            return usuario;
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