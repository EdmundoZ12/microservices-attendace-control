const AsistenciaController = require("../controllers/AsistenciaController");

class AsistenciaRoutes {
    constructor() {
        this.controller = new AsistenciaController();
    }

    async handleRoute(req, res, pathname, method, parsedUrl) {
        switch (pathname) {
            case '/asistencia':
                if (method === 'POST') {
                    await this.controller.registrar(req, res);
                    return true;
                } else {
                    res.writeHead(405, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Método no permitido' }));
                    return true;
                }

            case '/asistencia/estudiante':
                if (method === 'GET') {
                    await this.controller.obtenerPorEstudiante(req, res);
                    return true;
                } else {
                    res.writeHead(405, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Método no permitido' }));
                    return true;

                }
            case '/asistencia/materia':
                if (method === 'GET') {
                    await this.controller.obtenerPorMateria(req, res);
                    return true;
                } else {
                    res.writeHead(405, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Método no permitido' }));
                    return true;
                }

            default:
                return false;
        }
    }
}

module.exports = AsistenciaRoutes;