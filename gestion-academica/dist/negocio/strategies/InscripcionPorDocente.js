"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InscripcionPorDocente = void 0;
class InscripcionPorDocente {
    constructor(datosAsignacion, datosMateria) {
        this.datosAsignacion = datosAsignacion;
        this.datosMateria = datosMateria;
    }
    async inscribir(datos) {
        const { materia_id, estudiante_id, docente_id } = datos;
        try {
            // 1. Validar que la materia existe y está activa
            const materia = await this.datosMateria.obtenerPorId(materia_id);
            if (!materia) {
                return {
                    success: false,
                    error: "MATERIA_NO_ENCONTRADA",
                    message: "La materia no existe",
                };
            }
            if (!materia.activo) {
                return {
                    success: false,
                    error: "MATERIA_INACTIVA",
                    message: "La materia no está activa",
                };
            }
            // 2. Validar que el docente es el dueño de la materia
            if (materia.docente_id !== docente_id) {
                return {
                    success: false,
                    error: "DOCENTE_NO_AUTORIZADO",
                    message: "Solo el docente de la materia puede inscribir estudiantes",
                };
            }
            // 3. Validar que el estudiante existe
            const estudianteExiste = await this.datosAsignacion.verificarEstudianteExiste(estudiante_id);
            if (!estudianteExiste) {
                return {
                    success: false,
                    error: "ESTUDIANTE_NO_ENCONTRADO",
                    message: "El estudiante no existe",
                };
            }
            // 4. Verificar que no esté ya inscrito
            const yaInscrito = await this.datosAsignacion.verificarAsignacion(estudiante_id, materia_id);
            if (yaInscrito) {
                return {
                    success: false,
                    error: "ESTUDIANTE_YA_INSCRITO",
                    message: "El estudiante ya está inscrito en esta materia",
                };
            }
            // 5. Inscribir en la tabla asignacion
            const resultado = await this.datosAsignacion.asignar(estudiante_id, materia_id);
            return {
                success: true,
                data: resultado,
                message: "Estudiante inscrito por el docente exitosamente",
            };
        }
        catch (error) {
            console.error("Error en InscripcionPorDocente.inscribir:", error);
            return {
                success: false,
                error: "ERROR_INTERNO",
                message: "Error interno del sistema",
            };
        }
    }
}
exports.InscripcionPorDocente = InscripcionPorDocente;
