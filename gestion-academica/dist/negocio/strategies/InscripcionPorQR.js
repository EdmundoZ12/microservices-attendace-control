"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InscripcionPorQR = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class InscripcionPorQR {
    constructor(datosAsignacion, datosMateria) {
        this.datosAsignacion = datosAsignacion;
        this.datosMateria = datosMateria;
    }
    async inscribir(datos) {
        const { qr_token, estudiante_id } = datos;
        try {
            // 1. Decodificar y validar el token QR
            let payload;
            try {
                payload = jsonwebtoken_1.default.verify(qr_token, process.env.JWT_SECRET);
            }
            catch (error) {
                if (error.name === "TokenExpiredError") {
                    return {
                        success: false,
                        error: "QR_EXPIRADO",
                        message: "El código QR ha expirado",
                    };
                }
                return {
                    success: false,
                    error: "QR_INVALIDO",
                    message: "El código QR no es válido",
                };
            }
            const { materia_id, tipo } = payload;
            // 2. Verificar que el QR es de tipo inscripción
            if (tipo !== "INSCRIPCION") {
                return {
                    success: false,
                    error: "QR_TIPO_INCORRECTO",
                    message: "Este código QR no es para inscripción",
                };
            }
            // 3. Validar que la materia existe y está activa
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
            // 4. Validar que el estudiante existe
            const estudianteExiste = await this.datosAsignacion.verificarEstudianteExiste(estudiante_id);
            if (!estudianteExiste) {
                return {
                    success: false,
                    error: "ESTUDIANTE_NO_ENCONTRADO",
                    message: "El estudiante no existe",
                };
            }
            // 5. Verificar que no esté ya inscrito
            const yaInscrito = await this.datosAsignacion.verificarAsignacion(estudiante_id, materia_id);
            if (yaInscrito) {
                return {
                    success: false,
                    error: "ESTUDIANTE_YA_INSCRITO",
                    message: "Ya estás inscrito en esta materia",
                };
            }
            // 6. Inscribir en la tabla asignacion
            const resultado = await this.datosAsignacion.asignar(estudiante_id, materia_id);
            return {
                success: true,
                data: resultado,
                message: "Te has inscrito exitosamente mediante código QR",
            };
        }
        catch (error) {
            console.error("Error en InscripcionPorQR.inscribir:", error);
            return {
                success: false,
                error: "ERROR_INTERNO",
                message: "Error interno del sistema",
            };
        }
    }
}
exports.InscripcionPorQR = InscripcionPorQR;
