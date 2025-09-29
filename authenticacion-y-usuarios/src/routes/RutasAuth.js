const AuthController = require('../controllers/AuthController');

class RutasAuth {
    constructor() {
        this.authController = new AuthController();
    }

    async handleRoute(req, res, pathname, method, parsedUrl) {
        switch (pathname) {
            case '/login':
                if (method === 'POST') {
                    await this.authController.login(req, res);
                    return true;
                } else {
                    res.writeHead(405, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Método no permitido' }));
                    return true;
                }
        }

        return false; // No manejó la ruta
    }
}

module.exports = RutasAuth;