import Database from "../config/database";

interface Asignacion {
  estudiante_id: number;
  materia_id: number;
}

interface Estudiante {
  usuario_id: number;
  nombre: string;
  apellido: string;
  email: string;
  carrera: string;
}

interface Materia {
  id: number;
  nombre: string;
  codigo: string;
  grupo: string;
  descripcion: string;
}

class DatosAsignacion {
  private db: Database;

  constructor() {
    this.db = Database.getInstance();
  }

  async asignar(
    estudiante_id: number,
    materia_id: number
  ): Promise<Asignacion> {
    const query = `
            INSERT INTO asignacion (estudiante_id, materia_id)
            VALUES ($1, $2)
            RETURNING *
        `;
    const result = await this.db.query(query, [estudiante_id, materia_id]);
    return result.rows[0];
  }

  async verificarAsignacion(
    estudiante_id: number,
    materia_id: number
  ): Promise<boolean> {
    const query = `
            SELECT 1 FROM asignacion
            WHERE estudiante_id = $1 AND materia_id = $2
        `;
    const result = await this.db.query(query, [estudiante_id, materia_id]);
    return result.rows.length > 0;
  }

  async verificarEstudianteExiste(estudiante_id: number): Promise<boolean> {
    const query = `SELECT 1 FROM estudiante WHERE usuario_id = $1`;
    const result = await this.db.query(query, [estudiante_id]);
    return result.rows.length > 0;
  }

  async obtenerEstudiantesPorMateria(
    materia_id: number
  ): Promise<Estudiante[]> {
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

  async obtenerMateriasPorEstudiante(
    estudiante_id: number
  ): Promise<Materia[]> {
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

  async desasignar(estudiante_id: number, materia_id: number): Promise<void> {
    const query = `
            DELETE FROM asignacion
            WHERE estudiante_id = $1 AND materia_id = $2
        `;
    await this.db.query(query, [estudiante_id, materia_id]);
  }
}

export default DatosAsignacion;
