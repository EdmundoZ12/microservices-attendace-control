const NegocioAsignacion = require("../negocio/NegocioAsignacion");
const HttpHelper = require('../utils/HttpHelper');

class AsignacionController {
    constructor() {
        this.negocioAsigancion = new NegocioAsignacion();
    }

    // CU06: ASIGNAR ESTUDIANTE A MATERIA
    async asignar(req, res) {
        try {
            const { materia_id, estudiante_id } = await HttpHelper.parseBody(req);

            console.log('AsignacionController.asignar called with:', { materia_id, estudiante_id });

            const resultado = await this.negocioAsigancion.asignarEstudiante(materia_id, estudiante_id);

            if (!resultado.success) {
                switch (resultado.error) {
                    case 'MATERIA_NO_ENCONTRADA':
                        return HttpHelper.sendJSON(res, 404, { error: resultado.message });
                    case 'MATERIA_INACTIVA':
                        return HttpHelper.sendJSON(res, 400, { error: resultado.message });
                    case 'ESTUDIANTE_NO_ENCONTRADO':
                        return HttpHelper.sendJSON(res, 404, { error: resultado.message });
                    case 'ESTUDIANTE_YA_ASIGNADO':
                        return HttpHelper.sendJSON(res, 409, { error: resultado.message });
                    default:
                        return HttpHelper.sendJSON(res, 500, { error: resultado.message });
                }
            }

            HttpHelper.sendJSON(res, 201, {
                message: 'Estudiante asignado exitosamente',
                asignacion: resultado.data
            });

        } catch (error) {
            console.error('Error en AsignacionController.asignar:', error);
            HttpHelper.sendJSON(res, 500, { error: 'Error interno del servidor' });
        }
    }

    // OBTENER ESTUDIANTES DE UNA MATERIA
    async obtenerEstudiantes(req, res) {
        try {
            const { materia_id } = await HttpHelper.parseBody(req);

            console.log('AsignacionController.obtenerEstudiantes called with:', { materia_id });

            if (!materia_id) {
                return HttpHelper.sendJSON(res, 400, { error: 'materia_id es requerido' });
            }

            const resultado = await this.negocioAsigancion.obtenerEstudiantesDeMateria(materia_id);

            if (!resultado.success) {
                switch (resultado.error) {
                    case 'MATERIA_NO_ENCONTRADA':
                        return HttpHelper.sendJSON(res, 404, { error: resultado.message });
                    default:
                        return HttpHelper.sendJSON(res, 500, { error: resultado.message });
                }
            }

            HttpHelper.sendJSON(res, 200, {
                message: 'Estudiantes obtenidos exitosamente',
                materia: resultado.data.materia,
                estudiantes: resultado.data.estudiantes,
                total_estudiantes: resultado.data.total_estudiantes
            });

        } catch (error) {
            console.error('Error en AsignacionController.obtenerEstudiantes:', error);
            HttpHelper.sendJSON(res, 500, { error: 'Error interno del servidor' });
        }
    }

    // OBTENER MATERIAS DE UN ESTUDIANTE
    async obtenerMaterias(req, res) {
        try {
            const { estudiante_id } = await HttpHelper.parseBody(req);

            console.log('AsignacionController.obtenerMaterias called with:', { estudiante_id });

            if (!estudiante_id) {
                return HttpHelper.sendJSON(res, 400, { error: 'estudiante_id es requerido' });
            }

            const resultado = await this.negocioAsigancion.obtenerMateriasDeEstudiante(estudiante_id);

            if (!resultado.success) {
                switch (resultado.error) {
                    case 'ESTUDIANTE_NO_ENCONTRADO':
                        return HttpHelper.sendJSON(res, 404, { error: resultado.message });
                    default:
                        return HttpHelper.sendJSON(res, 500, { error: resultado.message });
                }
            }

            HttpHelper.sendJSON(res, 200, {
                message: 'Materias del estudiante obtenidas exitosamente',
                estudiante_id: resultado.data.estudiante_id,
                materias: resultado.data.materias,
                total_materias: resultado.data.total_materias
            });

        } catch (error) {
            console.error('Error en AsignacionController.obtenerMaterias:', error);
            HttpHelper.sendJSON(res, 500, { error: 'Error interno del servidor' });
        }
    }

    // DESASIGNAR ESTUDIANTE DE MATERIA
    async desasignar(req, res) {
        try {
            const { materia_id, estudiante_id } = await HttpHelper.parseBody(req);

            console.log('AsignacionController.desasignar called with:', { materia_id, estudiante_id });

            const resultado = await this.negocioAsigancion.desasignarEstudiante(materia_id, estudiante_id);

            if (!resultado.success) {
                switch (resultado.error) {
                    case 'ASIGNACION_NO_ENCONTRADA':
                        return HttpHelper.sendJSON(res, 404, { error: resultado.message });
                    default:
                        return HttpHelper.sendJSON(res, 500, { error: resultado.message });
                }
            }

            HttpHelper.sendJSON(res, 200, {
                message: 'Estudiante desasignado exitosamente',
                desasignacion: resultado.data
            });

        } catch (error) {
            console.error('Error en AsignacionController.desasignar:', error);
            HttpHelper.sendJSON(res, 500, { error: 'Error interno del servidor' });
        }
    }
}

module.exports = AsignacionController;