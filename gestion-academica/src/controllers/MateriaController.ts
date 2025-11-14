import { IncomingMessage, ServerResponse } from "http";
import NegocioMateria from "../negocio/NegocioMateria";
import HttpHelper from "../utils/HttpHelper";

class MateriaController {
  private negocioMateria: NegocioMateria;

  constructor() {
    this.negocioMateria = new NegocioMateria();
  }

  async crear(req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
      const {
        nombre,
        codigo,
        descripcion,
        grupo,
        docente_id,
        latitud,
        longitud,
        horarios,
      } = await HttpHelper.parseBody(req);

      console.log("MateriaController.crear called with:", {
        nombre,
        codigo,
        descripcion,
        grupo,
        docente_id,
        latitud,
        longitud,
        horarios,
      });

      const resultado = await this.negocioMateria.crear(
        nombre,
        codigo,
        descripcion,
        grupo,
        docente_id,
        latitud,
        longitud,
        horarios
      );

      if (!resultado.success) {
        switch (resultado.error) {
          case "DOCENTE_NO_ENCONTRADO":
            return HttpHelper.sendJSON(res, 404, { error: resultado.message });
          case "COORDENADAS_INVALIDAS":
            return HttpHelper.sendJSON(res, 401, { error: resultado.message });
          case "HORARIOS_INVALIDOS":
            return HttpHelper.sendJSON(res, 402, { error: resultado.message });
          default:
            return HttpHelper.sendJSON(res, 500, { error: resultado.message });
        }
      }
      HttpHelper.sendJSON(res, 201, {
        message: "Materia creada exitosamente",
        materia: resultado.data,
      });
    } catch (error) {
      console.error("Error en MateriaController.crear:", error);
      HttpHelper.sendJSON(res, 500, { error: "Error interno del servidor" });
    }
  }

  async actualizar(req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
      const {
        id,
        nombre,
        codigo,
        descripcion,
        grupo,
        latitud,
        longitud,
        activo,
      } = await HttpHelper.parseBody(req);

      console.log("MateriaController.actualizar called with:", {
        id,
        nombre,
        codigo,
        descripcion,
        grupo,
        latitud,
        longitud,
        activo,
      });

      const resultado = await this.negocioMateria.actualizar(
        id,
        nombre,
        codigo,
        descripcion,
        grupo,
        latitud,
        longitud,
        activo
      );

      if (!resultado.success) {
        switch (resultado.error) {
          case "COORDENADAS_INVALIDAS":
            return HttpHelper.sendJSON(res, 404, { error: resultado.message });
          case "MATERIA_NO_ENCONTRADA":
            return HttpHelper.sendJSON(res, 402, { error: resultado.message });
          default:
            return HttpHelper.sendJSON(res, 500, { error: resultado.message });
        }
      }
      HttpHelper.sendJSON(res, 200, {
        message: "Materia actualizada exitosamente",
        materia: resultado.data,
      });
    } catch (error) {
      console.error("Error en MateriaController.actualizar:", error);
      HttpHelper.sendJSON(res, 500, { error: "Error interno del servidor" });
    }
  }

  async cambiarEstado(
    req: IncomingMessage,
    res: ServerResponse
  ): Promise<void> {
    try {
      const { id } = await HttpHelper.parseBody(req);

      console.log("MateriaController.cambiarEstado called with ID:", id);
      const resultado = await this.negocioMateria.cambiarEstado(id);

      if (!resultado.success) {
        switch (resultado.error) {
          case "MATERIA_NO_ENCONTRADA":
            return HttpHelper.sendJSON(res, 404, { error: resultado.message });
          default:
            return HttpHelper.sendJSON(res, 500, { error: resultado.message });
        }
      }
      HttpHelper.sendJSON(res, 200, {
        message: "Cambio de estado de materia exitoso",
        materia: resultado.data,
      });
    } catch (error) {
      console.error("Error en MateriaController.cambiarEstado:", error);
      HttpHelper.sendJSON(res, 500, { error: "Error interno del servidor" });
    }
  }

  async obtenerPorId(req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
      const { id } = await HttpHelper.parseBody(req);
      const resultado = await this.negocioMateria.obtenerPorId(id);

      if (!resultado.success) {
        switch (resultado.error) {
          case "MATERIA_NO_ENCONTRADA":
            return HttpHelper.sendJSON(res, 404, { error: resultado.message });
          default:
            return HttpHelper.sendJSON(res, 500, { error: resultado.message });
        }
      }
      HttpHelper.sendJSON(res, 200, {
        materia: resultado.data,
      });
    } catch (error) {
      console.error("Error en MateriaController.obtenerPorId:", error);
      HttpHelper.sendJSON(res, 500, { error: "Error interno del servidor" });
    }
  }

  async obtenerTodasPorDocente(
    req: IncomingMessage,
    res: ServerResponse
  ): Promise<void> {
    try {
      const { docente_id } = await HttpHelper.parseBody(req);
      const resultado = await this.negocioMateria.obtenerTodasPorDocente(
        docente_id
      );
      if (!resultado.success) {
        switch (resultado.error) {
          case "MATERIA_NO_ENCONTRADA":
            return HttpHelper.sendJSON(res, 404, { error: resultado.message });
          default:
            return HttpHelper.sendJSON(res, 500, { error: resultado.message });
        }
      }
      HttpHelper.sendJSON(res, 200, {
        materias: resultado.data,
      });
    } catch (error) {
      console.error(
        "Error en MateriaController.obtenerTodasPorDocente:",
        error
      );
      HttpHelper.sendJSON(res, 500, { error: "Error interno del servidor" });
    }
  }

  async obtenerHorariosPorMateria(
    req: IncomingMessage,
    res: ServerResponse
  ): Promise<void> {
    try {
      const { materia_id } = await HttpHelper.parseBody(req);
      const resultado = await this.negocioMateria.obtenerHorariosPorMateria(
        materia_id
      );

      if (!resultado.success) {
        return HttpHelper.sendJSON(res, 500, { error: resultado.message });
      }
      HttpHelper.sendJSON(res, 200, {
        horarios: resultado.data,
      });
    } catch (error) {
      console.error(
        "Error en MateriaController.obtenerHorariosPorMateria:",
        error
      );
      HttpHelper.sendJSON(res, 500, { error: "Error interno del servidor" });
    }
  }

  async agregarHorario(
    req: IncomingMessage,
    res: ServerResponse
  ): Promise<void> {
    try {
      const { materia_id, dia_semana, hora_inicio, hora_fin } =
        await HttpHelper.parseBody(req);
      const resultado = await this.negocioMateria.agregarHorario(
        materia_id,
        dia_semana,
        hora_inicio,
        hora_fin
      );
      if (!resultado.success) {
        switch (resultado.error) {
          case "HORARIO_INVALIDO":
            return HttpHelper.sendJSON(res, 402, { error: resultado.message });
          default:
            return HttpHelper.sendJSON(res, 500, { error: resultado.message });
        }
      }

      HttpHelper.sendJSON(res, 201, {
        message: "Horario agregado exitosamente",
        horario: resultado.data,
      });
    } catch (error) {
      console.error("Error en MateriaController.agregarHorario:", error);
      HttpHelper.sendJSON(res, 500, { error: "Error interno del servidor" });
    }
  }

  async actualizarHorario(
    req: IncomingMessage,
    res: ServerResponse
  ): Promise<void> {
    try {
      const { horario_id, dia_semana, hora_inicio, hora_fin } =
        await HttpHelper.parseBody(req);
      const resultado = await this.negocioMateria.actualizarHorario(
        horario_id,
        dia_semana,
        hora_inicio,
        hora_fin
      );
      if (!resultado.success) {
        switch (resultado.error) {
          case "HORARIO_INVALIDO":
            return HttpHelper.sendJSON(res, 402, { error: resultado.message });
          case "HORARIO_NO_ENCONTRADO":
            return HttpHelper.sendJSON(res, 404, { error: resultado.message });
          default:
            return HttpHelper.sendJSON(res, 500, { error: resultado.message });
        }
      }

      HttpHelper.sendJSON(res, 200, {
        message: "Horario actualizado exitosamente",
        horario: resultado.data,
      });
    } catch (error) {
      console.error("Error en MateriaController.actualizarHorario:", error);
      HttpHelper.sendJSON(res, 500, { error: "Error interno del servidor" });
    }
  }

  async eliminarHorario(
    req: IncomingMessage,
    res: ServerResponse
  ): Promise<void> {
    try {
      const { horario_id } = await HttpHelper.parseBody(req);
      const resultado = await this.negocioMateria.eliminarHorario(horario_id);

      if (!resultado.success) {
        switch (resultado.error) {
          case "HORARIO_NO_ENCONTRADO":
            return HttpHelper.sendJSON(res, 404, { error: resultado.message });
          default:
            return HttpHelper.sendJSON(res, 500, { error: resultado.message });
        }
      }

      HttpHelper.sendJSON(res, 200, {
        message: "Horario eliminado exitosamente",
        horario: resultado.data,
      });
    } catch (error) {
      console.error("Error en MateriaController.eliminarHorario:", error);
      HttpHelper.sendJSON(res, 500, { error: "Error interno del servidor" });
    }
  }

  async generarQR(req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
      const { materia_id, horario_id, docente_id } = await HttpHelper.parseBody(
        req
      );

      console.log("MateriaController.generarQR called with:", {
        materia_id,
        horario_id,
        docente_id,
      });

      const resultado = await this.negocioMateria.generarQR(
        materia_id,
        horario_id,
        docente_id
      );

      if (!resultado.success) {
        switch (resultado.error) {
          case "HORARIO_NO_ENCONTRADO":
            return HttpHelper.sendJSON(res, 404, { error: resultado.message });
          case "DIA_INCORRECTO":
            return HttpHelper.sendJSON(res, 400, { error: resultado.message });
          default:
            return HttpHelper.sendJSON(res, 500, { error: resultado.message });
        }
      }

      HttpHelper.sendJSON(res, 200, {
        message: "QR generado exitosamente",
        qr: resultado.data,
      });
    } catch (error) {
      console.error("Error en MateriaController.generarQR:", error);
      HttpHelper.sendJSON(res, 500, { error: "Error interno del servidor" });
    }
  }

  /**
   * NUEVO: Generar QR para inscripción (Strategy Pattern)
   * POST /materia/qr/inscripcion
   */
  async generarQRInscripcion(
    req: IncomingMessage,
    res: ServerResponse
  ): Promise<void> {
    try {
      const { materia_id, docente_id, duracion_dias } =
        await HttpHelper.parseBody(req);

      console.log("MateriaController.generarQRInscripcion called with:", {
        materia_id,
        docente_id,
        duracion_dias,
      });

      const resultado = await this.negocioMateria.generarQRInscripcion(
        materia_id,
        docente_id,
        duracion_dias
      );

      if (!resultado.success) {
        switch (resultado.error) {
          case "MATERIA_NO_ENCONTRADA":
            return HttpHelper.sendJSON(res, 404, { error: resultado.message });
          case "DOCENTE_NO_AUTORIZADO":
            return HttpHelper.sendJSON(res, 403, { error: resultado.message });
          default:
            return HttpHelper.sendJSON(res, 500, { error: resultado.message });
        }
      }

      HttpHelper.sendJSON(res, 200, {
        message: "QR de inscripción generado exitosamente",
        qr: resultado.data,
      });
    } catch (error) {
      console.error("Error en MateriaController.generarQRInscripcion:", error);
      HttpHelper.sendJSON(res, 500, { error: "Error interno del servidor" });
    }
  }
}

export default MateriaController;
