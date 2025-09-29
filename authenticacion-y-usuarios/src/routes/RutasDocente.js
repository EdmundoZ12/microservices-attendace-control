const DocenteController = require("../controllers/DocenteController");

class RutasDocente {
    constructor() {
        this.docenteController = new DocenteController();
    }

    async handleRoute(req, res, pathname, method, parsedUrl) {
        switch (pathname) {
            case '/register/teacher':
                if (method === 'POST') {
                    await this.docenteController.registrar(req, res);
                    return true;
                } else {
                    res.writeHead(405, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Método no permitido' }));
                    return true;
                }

            case '/teachers':
                if (method === 'GET') {
                    await this.docenteController.obtenerTodos(req, res);
                    return true;
                } else {
                    res.writeHead(405, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Método no permitido' }));
                    return true;
                }

            case '/teacher':
                if (method === 'GET') {
                    req.query = parsedUrl.query;
                    if (req.query.email) {
                        await this.docenteController.obtenerPorEmail(req, res);
                        return true;
                    } else if (req.query.id) {
                        await this.docenteController.obtenerPorId(req, res);
                        return true;
                    } else {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Se requiere parámetro email o id' }));
                        return true;
                    }
                } else if (method === 'PUT') {
                    await this.docenteController.actualizar(req, res);
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

module.exports = RutasDocente;