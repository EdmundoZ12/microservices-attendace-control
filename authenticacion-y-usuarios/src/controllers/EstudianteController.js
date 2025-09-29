const NegocioEstudiante = require('../negocio/NegocioEstudiante');
const HttpHelper = require('../utils/HttpHelper');

class EstudianteController {
    constructor() {
        this.negocioEstudiante = new NegocioEstudiante();
    }

    async registrar(req, res) {
        try {
            const { nombre, apellido, email, password, carrera } = await HttpHelper.parseBody(req);

            const resultado = await this.negocioEstudiante.crear(nombre, apellido, email, password, carrera);

            if (!resultado.success) {
                switch (resultado.error) {
                    case 'EMAIL_EXISTE':
                        return HttpHelper.sendJSON(res, 409, { error: resultado.message });
                    default:
                        return HttpHelper.sendJSON(res, 500, { error: resultado.message });
                }
            }

            HttpHelper.sendJSON(res, 201, {
                message: 'Estudiante registrado exitosamente',
                estudiante: resultado.data
            });

        } catch (error) {
            console.error('Error en EstudianteController.registrar:', error);
            HttpHelper.sendJSON(res, 500, { error: 'Error interno del servidor' });
        }
    }

    async actualizar(req, res) {
        try {
            const { id, nombre, apellido, email, carrera } = await HttpHelper.parseBody(req);

            const resultado = await this.negocioEstudiante.actualizar(id, nombre, apellido, email, carrera);

            if (!resultado.success) {
                switch (resultado.error) {
                    case 'EMAIL_INVALIDO':
                        return HttpHelper.sendJSON(res, 400, { error: resultado.message });
                    case 'ESTUDIANTE_NO_ENCONTRADO':
                        return HttpHelper.sendJSON(res, 404, { error: resultado.message });
                    default:
                        return HttpHelper.sendJSON(res, 500, { error: resultado.message });
                }
            }

            HttpHelper.sendJSON(res, 200, {
                message: 'Estudiante actualizado exitosamente',
                estudiante: resultado.data
            });

        } catch (error) {
            console.error('Error en EstudianteController.actualizar:', error);
            HttpHelper.sendJSON(res, 500, { error: 'Error interno del servidor' });
        }
    }

    async obtenerPorEmail(req, res) {
        try {
            const { email } = req.query || {};

            if (!email) {
                return HttpHelper.sendJSON(res, 400, { error: 'Email es requerido' });
            }

            const resultado = await this.negocioEstudiante.buscarPorEmail(email);

            if (!resultado.success) {
                switch (resultado.error) {
                    case 'EMAIL_INVALIDO':
                        return HttpHelper.sendJSON(res, 400, { error: resultado.message });
                    case 'ESTUDIANTE_NO_ENCONTRADO':
                        return HttpHelper.sendJSON(res, 404, { error: resultado.message });
                    default:
                        return HttpHelper.sendJSON(res, 500, { error: resultado.message });
                }
            }

            HttpHelper.sendJSON(res, 200, {
                estudiante: resultado.data
            });

        } catch (error) {
            console.error('Error en EstudianteController.obtenerPorEmail:', error);
            HttpHelper.sendJSON(res, 500, { error: 'Error interno del servidor' });
        }
    }

    async obtenerPorId(req, res) {
        try {
            const { id } = req.query || {};

            if (!id) {
                return HttpHelper.sendJSON(res, 400, { error: 'ID es requerido' });
            }

            const resultado = await this.negocioEstudiante.buscarPorId(id);

            if (!resultado.success) {
                switch (resultado.error) {
                    case 'ESTUDIANTE_NO_ENCONTRADO':
                        return HttpHelper.sendJSON(res, 404, { error: resultado.message });
                    default:
                        return HttpHelper.sendJSON(res, 500, { error: resultado.message });
                }
            }

            HttpHelper.sendJSON(res, 200, {
                estudiante: resultado.data
            });

        } catch (error) {
            console.error('Error en EstudianteController.obtenerPorId:', error);
            HttpHelper.sendJSON(res, 500, { error: 'Error interno del servidor' });
        }
    }

    async obtenerTodos(req, res) {
        try {
            const resultado = await this.negocioEstudiante.obtenerTodos();

            if (!resultado.success) {
                return HttpHelper.sendJSON(res, 500, { error: resultado.message });
            }

            HttpHelper.sendJSON(res, 200, {
                estudiantes: resultado.data
            });

        } catch (error) {
            console.error('Error en EstudianteController.obtenerTodos:', error);
            HttpHelper.sendJSON(res, 500, { error: 'Error interno del servidor' });
        }
    }
}

module.exports = EstudianteController;