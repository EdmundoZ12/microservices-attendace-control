const NegocioAuth = require('../negocio/NegocioAuth');
const HttpHelper = require('../utils/HttpHelper');

class AuthController {
    constructor() {
        this.negocioAuth = new NegocioAuth();
    }

    async login(req, res) {
        try {
            console.log('AuthController.login called');

            const { email, password } = await HttpHelper.parseBody(req);

            if (!email || !password) {
                return HttpHelper.sendJSON(res, 400, { error: 'Email y contraseña son requeridos' });
            }

            const resultado = await this.negocioAuth.login(email, password);

            if (!resultado.success) {
                switch (resultado.error) {
                    case 'EMAIL_INVALIDO':
                        return HttpHelper.sendJSON(res, 400, { error: resultado.message });
                    case 'CREDENCIALES_INVALIDAS':
                        return HttpHelper.sendJSON(res, 401, { error: resultado.message });
                    default:
                        return HttpHelper.sendJSON(res, 500, { error: resultado.message });
                }
            }

            HttpHelper.sendJSON(res, 200, {
                message: 'Login exitoso',
                token: resultado.data.token,
                user: resultado.data.user
            });

        } catch (error) {
            console.error('Error en AuthController.login:', error);
            HttpHelper.sendJSON(res, 500, { error: 'Error interno del servidor' });
        }
    }
}

module.exports = AuthController;