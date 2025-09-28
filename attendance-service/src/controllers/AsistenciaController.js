const NegocioAsistencia = require("../business/NegocioAsistencia");
const HttpHelper = require('../utils/HttpHelper');

class AsistenciaController {
    constructor() {
        this.negocioAsistencia = new NegocioAsistencia();
    }

    async registrar(req, res) {
        try {
            const { qr_token, estudiante_id, ubicacion_lat, ubicacion_lng } = await HttpHelper.parseBody(req);

            console.log('AsistenciaController.registrar called with:', {
                estudiante_id,
                ubicacion_lat,
                ubicacion_lng,
                qr_token: qr_token ? 'presente' : 'ausente'
            });

            if (!qr_token || !estudiante_id || !ubicacion_lat || !ubicacion_lng) {
                return HttpHelper.sendJSON(res, 400, {
                    error: 'Faltan datos requeridos: qr_token, estudiante_id, ubicacion_lat, ubicacion_lng'
                });
            }

            const resultado = await this.negocioAsistencia.registrarAsistencia(
                qr_token,
                estudiante_id,
                ubicacion_lat,
                ubicacion_lng
            );

            if (!resultado.success) {
                switch (resultado.error) {
                    case 'QR_EXPIRADO':
                        return HttpHelper.sendJSON(res, 400, { error: resultado.message });
                    case 'QR_INVALIDO':
                        return HttpHelper.sendJSON(res, 400, { error: resultado.message });
                    case 'ESTUDIANTE_NO_INSCRITO':
                        return HttpHelper.sendJSON(res, 403, { error: resultado.message });
                    case 'MATERIA_INACTIVA':
                        return HttpHelper.sendJSON(res, 400, { error: resultado.message });
                    case 'ASISTENCIA_YA_REGISTRADA':
                        return HttpHelper.sendJSON(res, 409, { error: resultado.message });
                    case 'UBICACION_INCORRECTA':
                        return HttpHelper.sendJSON(res, 400, { error: resultado.message });
                    case 'FUERA_DE_HORARIO':
                        return HttpHelper.sendJSON(res, 400, { error: resultado.message });
                    default:
                        return HttpHelper.sendJSON(res, 500, { error: resultado.message });
                }
            }

            HttpHelper.sendJSON(res, 201, {
                message: 'Asistencia registrada exitosamente',
                asistencia: resultado.data
            });

        } catch (error) {
            console.error('Error en AsistenciaController.registrar:', error);
            HttpHelper.sendJSON(res, 500, { error: 'Error interno del servidor' });
        }
    }

    async obtenerPorEstudiante(req, res) {
        try {
            const { estudiante_id } = await HttpHelper.parseBody(req);

            console.log('AsistenciaController.obtenerPorEstudiante called with:', { estudiante_id });

            if (!estudiante_id) {
                return HttpHelper.sendJSON(res, 400, { error: 'estudiante_id es requerido' });
            }

            const resultado = await this.negocioAsistencia.obtenerAsistenciasEstudiante(estudiante_id);

            if (!resultado.success) {
                return HttpHelper.sendJSON(res, 500, { error: resultado.message });
            }

            HttpHelper.sendJSON(res, 200, {
                asistencias: resultado.data
            });

        } catch (error) {
            console.error('Error en AsistenciaController.obtenerPorEstudiante:', error);
            HttpHelper.sendJSON(res, 500, { error: 'Error interno del servidor' });
        }
    }

    async obtenerPorMateria(req, res) {
        try {
            const { materia_id } = await HttpHelper.parseBody(req);

            console.log('AsistenciaController.obtenerPorMateria called with:', { materia_id });

            if (!materia_id) {
                return HttpHelper.sendJSON(res, 400, { error: 'materia_id es requerido' });
            }

            const resultado = await this.negocioAsistencia.obtenerAsistenciasMateria(materia_id);

            if (!resultado.success) {
                return HttpHelper.sendJSON(res, 500, { error: resultado.message });
            }

            HttpHelper.sendJSON(res, 200, {
                asistencias: resultado.data
            });

        } catch (error) {
            console.error('Error en AsistenciaController.obtenerPorMateria:', error);
            HttpHelper.sendJSON(res, 500, { error: 'Error interno del servidor' });
        }
    }
}

module.exports = AsistenciaController;