"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NegocioAsignacion_1 = __importDefault(require("../negocio/NegocioAsignacion"));
const HttpHelper_1 = __importDefault(require("../utils/HttpHelper"));
class AsignacionController {
    constructor() {
        this.negocioAsigancion = new NegocioAsignacion_1.default();
    }
    // CU06: ASIGNAR ESTUDIANTE A MATERIA
    async asignar(req, res) {
        try {
            const { materia_id, estudiante_id } = await HttpHelper_1.default.parseBody(req);
            console.log("AsignacionController.asignar called with:", {
                materia_id,
                estudiante_id,
            });
            const resultado = await this.negocioAsigancion.asignarEstudiante(materia_id, estudiante_id);
            if (!resultado.success) {
                switch (resultado.error) {
                    case "MATERIA_NO_ENCONTRADA":
                        return HttpHelper_1.default.sendJSON(res, 404, { error: resultado.message });
                    case "MATERIA_INACTIVA":
                        return HttpHelper_1.default.sendJSON(res, 400, { error: resultado.message });
                    case "ESTUDIANTE_NO_ENCONTRADO":
                        return HttpHelper_1.default.sendJSON(res, 404, { error: resultado.message });
                    case "ESTUDIANTE_YA_ASIGNADO":
                        return HttpHelper_1.default.sendJSON(res, 409, { error: resultado.message });
                    default:
                        return HttpHelper_1.default.sendJSON(res, 500, { error: resultado.message });
                }
            }
            HttpHelper_1.default.sendJSON(res, 201, {
                message: "Estudiante asignado exitosamente",
                asignacion: resultado.data,
            });
        }
        catch (error) {
            console.error("Error en AsignacionController.asignar:", error);
            HttpHelper_1.default.sendJSON(res, 500, { error: "Error interno del servidor" });
        }
    }
    // OBTENER ESTUDIANTES DE UNA MATERIA
    async obtenerEstudiantes(req, res) {
        try {
            console.log("LLEGOOOOO!");
            const { materia_id } = await HttpHelper_1.default.parseBody(req);
            console.log("AsignacionController.obtenerEstudiantes called with:", {
                materia_id,
            });
            console.log("LLEGOOOOO!");
            if (!materia_id) {
                return HttpHelper_1.default.sendJSON(res, 400, {
                    error: "materia_id es requerido",
                });
            }
            const resultado = await this.negocioAsigancion.obtenerEstudiantesDeMateria(materia_id);
            if (!resultado.success) {
                switch (resultado.error) {
                    case "MATERIA_NO_ENCONTRADA":
                        return HttpHelper_1.default.sendJSON(res, 404, { error: resultado.message });
                    default:
                        return HttpHelper_1.default.sendJSON(res, 500, { error: resultado.message });
                }
            }
            HttpHelper_1.default.sendJSON(res, 200, {
                message: "Estudiantes obtenidos exitosamente",
                materia: resultado.data.materia,
                estudiantes: resultado.data.estudiantes,
                total_estudiantes: resultado.data.total_estudiantes,
            });
        }
        catch (error) {
            console.error("Error en AsignacionController.obtenerEstudiantes:", error);
            HttpHelper_1.default.sendJSON(res, 500, { error: "Error interno del servidor" });
        }
    }
    // OBTENER MATERIAS DE UN ESTUDIANTE
    async obtenerMaterias(req, res) {
        try {
            const { estudiante_id } = await HttpHelper_1.default.parseBody(req);
            console.log("LLEGOOOOO!");
            console.log("AsignacionController.obtenerMaterias called with:", {
                estudiante_id,
            });
            if (!estudiante_id) {
                return HttpHelper_1.default.sendJSON(res, 400, {
                    error: "estudiante_id es requerido",
                });
            }
            const resultado = await this.negocioAsigancion.obtenerMateriasDeEstudiante(estudiante_id);
            if (!resultado.success) {
                switch (resultado.error) {
                    case "ESTUDIANTE_NO_ENCONTRADO":
                        return HttpHelper_1.default.sendJSON(res, 404, { error: resultado.message });
                    default:
                        return HttpHelper_1.default.sendJSON(res, 500, { error: resultado.message });
                }
            }
            HttpHelper_1.default.sendJSON(res, 200, {
                message: "Materias del estudiante obtenidas exitosamente",
                estudiante_id: resultado.data.estudiante_id,
                materias: resultado.data.materias,
                total_materias: resultado.data.total_materias,
            });
        }
        catch (error) {
            console.error("Error en AsignacionController.obtenerMaterias:", error);
            HttpHelper_1.default.sendJSON(res, 500, { error: "Error interno del servidor" });
        }
    }
    // DESASIGNAR ESTUDIANTE DE MATERIA
    async desasignar(req, res) {
        try {
            const { materia_id, estudiante_id } = await HttpHelper_1.default.parseBody(req);
            console.log("AsignacionController.desasignar called with:", {
                materia_id,
                estudiante_id,
            });
            const resultado = await this.negocioAsigancion.desasignarEstudiante(materia_id, estudiante_id);
            if (!resultado.success) {
                switch (resultado.error) {
                    case "ASIGNACION_NO_ENCONTRADA":
                        return HttpHelper_1.default.sendJSON(res, 404, { error: resultado.message });
                    default:
                        return HttpHelper_1.default.sendJSON(res, 500, { error: resultado.message });
                }
            }
            HttpHelper_1.default.sendJSON(res, 200, {
                message: "Estudiante desasignado exitosamente",
                desasignacion: resultado.data,
            });
        }
        catch (error) {
            console.error("Error en AsignacionController.desasignar:", error);
            HttpHelper_1.default.sendJSON(res, 500, { error: "Error interno del servidor" });
        }
    }
    // NUEVO: INSCRIPCIÓN POR DOCENTE (Strategy Pattern)
    async inscribirPorDocente(req, res) {
        try {
            const { materia_id, estudiante_id, docente_id } = await HttpHelper_1.default.parseBody(req);
            console.log("LLEGOOOOO!");
            console.log("AsignacionController.inscribirPorDocente called with:", {
                materia_id,
                estudiante_id,
                docente_id,
            });
            const resultado = await this.negocioAsigancion.inscribirPorDocente(materia_id, estudiante_id, docente_id);
            if (!resultado.success) {
                switch (resultado.error) {
                    case "MATERIA_NO_ENCONTRADA":
                    case "ESTUDIANTE_NO_ENCONTRADO":
                        return HttpHelper_1.default.sendJSON(res, 404, { error: resultado.message });
                    case "MATERIA_INACTIVA":
                    case "DOCENTE_NO_AUTORIZADO":
                        return HttpHelper_1.default.sendJSON(res, 400, { error: resultado.message });
                    case "ESTUDIANTE_YA_INSCRITO":
                        return HttpHelper_1.default.sendJSON(res, 409, { error: resultado.message });
                    default:
                        return HttpHelper_1.default.sendJSON(res, 500, { error: resultado.message });
                }
            }
            HttpHelper_1.default.sendJSON(res, 201, {
                message: resultado.message,
                asignacion: resultado.data,
            });
        }
        catch (error) {
            console.error("Error en AsignacionController.inscribirPorDocente:", error);
            HttpHelper_1.default.sendJSON(res, 500, { error: "Error interno del servidor" });
        }
    }
    // NUEVO: AUTO-INSCRIPCIÓN POR QR (Strategy Pattern)
    async inscribirPorQR(req, res) {
        try {
            const { qr_token, estudiante_id } = await HttpHelper_1.default.parseBody(req);
            console.log("AsignacionController.inscribirPorQR called with estudiante_id:", estudiante_id);
            const resultado = await this.negocioAsigancion.inscribirPorQR(qr_token, estudiante_id);
            if (!resultado.success) {
                switch (resultado.error) {
                    case "QR_EXPIRADO":
                    case "QR_INVALIDO":
                    case "QR_TIPO_INCORRECTO":
                        return HttpHelper_1.default.sendJSON(res, 400, { error: resultado.message });
                    case "MATERIA_NO_ENCONTRADA":
                    case "ESTUDIANTE_NO_ENCONTRADO":
                        return HttpHelper_1.default.sendJSON(res, 404, { error: resultado.message });
                    case "ESTUDIANTE_YA_INSCRITO":
                        return HttpHelper_1.default.sendJSON(res, 409, { error: resultado.message });
                    default:
                        return HttpHelper_1.default.sendJSON(res, 500, { error: resultado.message });
                }
            }
            HttpHelper_1.default.sendJSON(res, 201, {
                message: resultado.message,
                asignacion: resultado.data,
            });
        }
        catch (error) {
            console.error("Error en AsignacionController.inscribirPorQR:", error);
            HttpHelper_1.default.sendJSON(res, 500, { error: "Error interno del servidor" });
        }
    }
}
exports.default = AsignacionController;
