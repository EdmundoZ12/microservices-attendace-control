import DatosAsignacion from "../datos/DatosAsignacion";
import DatosMateria from "../datos/DatosMateria";
import InscripcionContext from "./InscripcionContext";
import { InscripcionPorDocente } from "./strategies/InscripcionPorDocente";
import { InscripcionPorQR } from "./strategies/InscripcionPorQR";

class NegocioAsignacion {
  private datosAsignacion: DatosAsignacion;
  private datosMateria: DatosMateria;
  public contexto: InscripcionContext;

  constructor() {
    this.datosAsignacion = new DatosAsignacion();
    this.datosMateria = new DatosMateria();
    this.contexto = new InscripcionContext();
  }

  async asignarEstudiante(
    materia_id: number,
    estudiante_id: number
  ): Promise<any> {
    try {
      // Validar que la materia existe y está activa
      const materia = await this.datosMateria.obtenerPorId(materia_id);
      if (!materia) {
        return {
          success: false,
          error: "MATERIA_NO_ENCONTRADA",
          message: "Materia no encontrada",
        };
      }

      if (!materia.activo) {
        return {
          success: false,
          error: "MATERIA_INACTIVA",
          message: "No se puede asignar estudiantes a una materia inactiva",
        };
      }

      // Validar que el estudiante existe
      const estudianteExiste =
        await this.datosAsignacion.verificarEstudianteExiste(estudiante_id);
      if (!estudianteExiste) {
        return {
          success: false,
          error: "ESTUDIANTE_NO_ENCONTRADO",
          message: "El estudiante no existe",
        };
      }

      // Verificar que no esté ya asignado
      const yaAsignado = await this.datosAsignacion.verificarAsignacion(
        estudiante_id,
        materia_id
      );
      if (yaAsignado) {
        return {
          success: false,
          error: "ESTUDIANTE_YA_ASIGNADO",
          message: "El estudiante ya está inscrito en esta materia",
        };
      }

      // Realizar la asignación
      const resultado = await this.datosAsignacion.asignar(
        estudiante_id,
        materia_id
      );
      return { success: true, data: resultado };
    } catch (error) {
      console.error("Error en NegocioAsignacion.asignarEstudiante:", error);
      return {
        success: false,
        error: "ERROR_INTERNO",
        message: "Error interno del sistema",
      };
    }
  }

  async obtenerEstudiantesDeMateria(materia_id: number): Promise<any> {
    try {
      // Validar que la materia existe
      const materia = await this.datosMateria.obtenerPorId(materia_id);
      if (!materia) {
        return {
          success: false,
          error: "MATERIA_NO_ENCONTRADA",
          message: "Materia no encontrada",
        };
      }

      // Obtener estudiantes inscritos en la materia
      const estudiantes =
        await this.datosAsignacion.obtenerEstudiantesPorMateria(materia_id);

      return {
        success: true,
        data: {
          materia: {
            id: materia.id,
            nombre: materia.nombre,
            codigo: materia.codigo,
            grupo: materia.grupo,
          },
          estudiantes: estudiantes,
          total_estudiantes: estudiantes.length,
        },
      };
    } catch (error) {
      console.error(
        "Error en NegocioAsignacion.obtenerEstudiantesDeMateria:",
        error
      );
      return {
        success: false,
        error: "ERROR_INTERNO",
        message: "Error interno del sistema",
      };
    }
  }

  async obtenerMateriasDeEstudiante(estudiante_id: number): Promise<any> {
    try {
      // Validar que el estudiante existe
      const estudianteExiste =
        await this.datosAsignacion.verificarEstudianteExiste(estudiante_id);
      if (!estudianteExiste) {
        return {
          success: false,
          error: "ESTUDIANTE_NO_ENCONTRADO",
          message: "El estudiante no existe",
        };
      }

      // Obtener materias del estudiante
      const materias = await this.datosAsignacion.obtenerMateriasPorEstudiante(
        estudiante_id
      );

      return {
        success: true,
        data: {
          estudiante_id: estudiante_id,
          materias: materias,
          total_materias: materias.length,
        },
      };
    } catch (error) {
      console.error(
        "Error en NegocioAsignacion.obtenerMateriasDeEstudiante:",
        error
      );
      return {
        success: false,
        error: "ERROR_INTERNO",
        message: "Error interno del sistema",
      };
    }
  }

  async desasignarEstudiante(
    materia_id: number,
    estudiante_id: number
  ): Promise<any> {
    try {
      // Verificar que la asignación existe
      const asignacionExiste = await this.datosAsignacion.verificarAsignacion(
        estudiante_id,
        materia_id
      );
      if (!asignacionExiste) {
        return {
          success: false,
          error: "ASIGNACION_NO_ENCONTRADA",
          message: "El estudiante no está inscrito en esta materia",
        };
      }

      // Realizar la desasignación
      const resultado = await this.datosAsignacion.desasignar(
        estudiante_id,
        materia_id
      );
      return { success: true, data: resultado };
    } catch (error) {
      console.error("Error en NegocioAsignacion.desasignarEstudiante:", error);
      return {
        success: false,
        error: "ERROR_INTERNO",
        message: "Error interno del sistema",
      };
    }
  }

  // NUEVO: INSCRIPCIÓN POR DOCENTE (Strategy Pattern)
  async inscribirPorDocente(
    materia_id: number,
    estudiante_id: number,
    docente_id: number
  ): Promise<any> {
    try {
      // Configurar estrategia de inscripción por docente
      this.contexto.setEstrategia(
        new InscripcionPorDocente(this.datosAsignacion, this.datosMateria)
      );

      // Inscribir usando la estrategia
      return await this.contexto.ejecutarInscripcion({
        materia_id,
        estudiante_id,
        docente_id,
      });
    } catch (error) {
      console.error("Error en NegocioAsignacion.inscribirPorDocente:", error);
      return {
        success: false,
        error: "ERROR_INTERNO",
        message: "Error interno del sistema",
      };
    }
  }

  // NUEVO: AUTO-INSCRIPCIÓN POR QR (Strategy Pattern)
  async inscribirPorQR(qr_token: string, estudiante_id: number): Promise<any> {
    try {
      // Configurar estrategia de inscripción por QR
      this.contexto.setEstrategia(
        new InscripcionPorQR(this.datosAsignacion, this.datosMateria)
      );

      // Inscribir usando la estrategia
      return await this.contexto.ejecutarInscripcion({
        qr_token,
        estudiante_id,
      });
    } catch (error) {
      console.error("Error en NegocioAsignacion.inscribirPorQR:", error);
      return {
        success: false,
        error: "ERROR_INTERNO",
        message: "Error interno del sistema",
      };
    }
  }
}

export default NegocioAsignacion;
