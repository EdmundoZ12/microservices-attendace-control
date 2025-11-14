import Database from "../config/database";

interface Materia {
  id: number;
  nombre: string;
  codigo: string;
  descripcion: string;
  grupo: string;
  docente_id: number;
  latitud: number;
  longitud: number;
  activo: boolean;
}

class DatosMateria {
  private db: Database;

  constructor() {
    this.db = Database.getInstance();
  }

  async crear(
    nombre: string,
    codigo: string,
    descripcion: string,
    grupo: string,
    docente_id: number,
    latitud: number,
    longitud: number
  ): Promise<Materia> {
    try {
      const query = await this.db.query(
        "INSERT INTO materia (nombre, codigo, descripcion, grupo, docente_id, latitud, longitud, activo) VALUES ($1, $2, $3, $4, $5, $6, $7, true) RETURNING *",
        [nombre, codigo, descripcion, grupo, docente_id, latitud, longitud]
      );
      return query.rows[0];
    } catch (error) {
      console.error("Error en DatosMateria.crear:", error);
      throw error;
    }
  }

  async actualizar(
    id: number,
    nombre: string,
    codigo: string,
    descripcion: string,
    grupo: string,
    latitud: number,
    longitud: number,
    activo: boolean
  ): Promise<Materia | null> {
    try {
      const query = await this.db.query(
        "UPDATE materia SET nombre = $1, codigo = $2, descripcion = $3, grupo = $4, latitud = $5, longitud = $6, activo = $7 WHERE id = $8 RETURNING *",
        [nombre, codigo, descripcion, grupo, latitud, longitud, activo, id]
      );
      return query.rows[0] || null;
    } catch (error) {
      console.error("Error en DatosMateria.actualizar:", error);
      throw error;
    }
  }

  async cambiarEstado(id: number): Promise<Materia | null> {
    try {
      // Primero obtener el estado actual
      const materiaActual = await this.db.query(
        "SELECT activo FROM materia WHERE id = $1",
        [id]
      );

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
      console.error("Error en DatosMateria.cambiarEstado:", error);
      throw error;
    }
  }

  async obtenerPorId(id: number): Promise<Materia | null> {
    try {
      const query = await this.db.query("SELECT * FROM materia WHERE id = $1", [
        id,
      ]);
      return query.rows[0] || null;
    } catch (error) {
      console.error("Error en DatosMateria.obtenerPorId:", error);
      throw error;
    }
  }

  async obtenerTodasPorDocente(docente_id: number): Promise<Materia[]> {
    try {
      const query = await this.db.query(
        "SELECT * FROM materia WHERE docente_id = $1 ORDER BY nombre",
        [docente_id]
      );
      return query.rows;
    } catch (error) {
      console.error("Error en DatosMateria.obtenerTodasPorDocente:", error);
      throw error;
    }
  }

  async verificarDocenteExiste(docente_id: number): Promise<boolean> {
    try {
      console.log("Verificando existencia de docente con ID:", docente_id);
      const query = await this.db.query(
        "SELECT usuario_id FROM docente WHERE usuario_id = $1",
        [docente_id]
      );
      console.log("Query result in verificarDocenteExiste:", query.rows);

      return query.rows.length > 0;
    } catch (error) {
      console.error("Error al verificar docente:", error);
      throw error;
    }
  }
}

export default DatosMateria;
