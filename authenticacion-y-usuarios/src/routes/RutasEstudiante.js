const EstudianteController = require("../controllers/EstudianteController");

class RutasEstudiante {
    constructor() {
        this.estudianteController = new EstudianteController();
    }

    async handleRoute(req, res, pathname, method, parsedUrl) {
        switch (pathname) {
            case '/register/student':
                if (method === 'POST') {
                    return await this.estudianteController.registrar(req, res);
                }
                break;

            case '/students':
                if (method === 'GET') {
                    return await this.estudianteController.obtenerTodos(req, res);
                }
                break;

            case '/student':
                if (method === 'GET') {
                    req.query = parsedUrl.query;
                    if (req.query.email) {
                        return await this.estudianteController.obtenerPorEmail(req, res);
                    } else if (req.query.id) {
                        return await this.estudianteController.obtenerPorId(req, res);
                    } else {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Se requiere parámetro email o id' }));
                        return true;
                    }
                } else if (method === 'PUT') {
                    return await this.estudianteController.actualizar(req, res);
                }
                break;
        }

        return false; // No manejó la ruta
    }
}

module.exports = RutasEstudiante;