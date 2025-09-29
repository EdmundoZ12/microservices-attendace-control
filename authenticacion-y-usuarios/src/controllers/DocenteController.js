const NegocioDocente = require('../negocio/NegocioDocente');
const HttpHelper = require('../utils/HttpHelper');

class DocenteController {
    constructor() {
        this.negocioDocente = new NegocioDocente();
    }

    async registrar(req, res) {
        try {
            const { nombre, apellido, email, password, titulo } = await HttpHelper.parseBody(req);

            const resultado = await this.negocioDocente.crear(nombre, apellido, email, password, titulo);

            if (!resultado.success) {
                switch (resultado.error) {
                    case 'EMAIL_EXISTE':
                        return HttpHelper.sendJSON(res, 409, { error: resultado.message });
                    default:
                        return HttpHelper.sendJSON(res, 500, { error: resultado.message });
                }
            }

            HttpHelper.sendJSON(res, 201, {
                message: 'Docente registrado exitosamente',
                docente: resultado.data
            });

        } catch (error) {
            console.error('Error en DocenteController.registrar:', error);
            HttpHelper.sendJSON(res, 500, { error: 'Error interno del servidor' });
        }
    }

    async actualizar(req, res) {
        try {
            const { id, nombre, apellido, email, titulo } = await HttpHelper.parseBody(req);

            const resultado = await this.negocioDocente.actualizar(id, nombre, apellido, email, titulo);

            if (!resultado.success) {
                switch (resultado.error) {
                    case 'EMAIL_INVALIDO':
                        return HttpHelper.sendJSON(res, 400, { error: resultado.message });
                    case 'DOCENTE_NO_ENCONTRADO':
                        return HttpHelper.sendJSON(res, 404, { error: resultado.message });
                    default:
                        return HttpHelper.sendJSON(res, 500, { error: resultado.message });
                }
            }

            HttpHelper.sendJSON(res, 200, {
                message: 'Docente actualizado exitosamente',
                docente: resultado.data
            });

        } catch (error) {
            console.error('Error en DocenteController.actualizar:', error);
            HttpHelper.sendJSON(res, 500, { error: 'Error interno del servidor' });
        }
    }

    async obtenerPorEmail(req, res) {
        try {
            const { email } = req.query || {};

            if (!email) {
                return HttpHelper.sendJSON(res, 400, { error: 'Email es requerido' });
            }

            const resultado = await this.negocioDocente.buscarPorEmail(email);

            if (!resultado.success) {
                switch (resultado.error) {
                    case 'EMAIL_INVALIDO':
                        return HttpHelper.sendJSON(res, 400, { error: resultado.message });
                    case 'DOCENTE_NO_ENCONTRADO':
                        return HttpHelper.sendJSON(res, 404, { error: resultado.message });
                    default:
                        return HttpHelper.sendJSON(res, 500, { error: resultado.message });
                }
            }

            HttpHelper.sendJSON(res, 200, {
                docente: resultado.data
            });

        } catch (error) {
            console.error('Error en DocenteController.obtenerPorEmail:', error);
            HttpHelper.sendJSON(res, 500, { error: 'Error interno del servidor' });
        }
    }

    async obtenerPorId(req, res) {
        try {
            const { id } = req.query || {};

            if (!id) {
                return HttpHelper.sendJSON(res, 400, { error: 'ID es requerido' });
            }

            const resultado = await this.negocioDocente.buscarPorId(id);

            if (!resultado.success) {
                switch (resultado.error) {
                    case 'DOCENTE_NO_ENCONTRADO':
                        return HttpHelper.sendJSON(res, 404, { error: resultado.message });
                    default:
                        return HttpHelper.sendJSON(res, 500, { error: resultado.message });
                }
            }

            HttpHelper.sendJSON(res, 200, {
                docente: resultado.data
            });

        } catch (error) {
            console.error('Error en DocenteController.obtenerPorId:', error);
            HttpHelper.sendJSON(res, 500, { error: 'Error interno del servidor' });
        }
    }

    async obtenerTodos(req, res) {
        try {
            const resultado = await this.negocioDocente.obtenerTodos();

            if (!resultado.success) {
                return HttpHelper.sendJSON(res, 500, { error: resultado.message });
            }

            HttpHelper.sendJSON(res, 200, {
                docentes: resultado.data
            });

        } catch (error) {
            console.error('Error en DocenteController.obtenerTodos:', error);
            HttpHelper.sendJSON(res, 500, { error: 'Error interno del servidor' });
        }
    }
}

module.exports = DocenteController;