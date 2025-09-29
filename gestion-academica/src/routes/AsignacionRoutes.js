const AsignacionController = require("../controllers/AsignacionController");

class AsigancionRoutes {
    constructor() {
        this.controller = new AsignacionController();
    }

    async handleRoute(req, res, pathname, method, parsedUrl) {
        switch (pathname) {
            case '/asignacion':
                if (method === 'POST') {
                    await this.controller.asignar(req, res);
                    return true;
                } else if (method === 'DELETE') {
                    await this.controller.desasignar(req, res);
                    return true;
                } else {
                    res.writeHead(405, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Método no permitido' }));
                    return true;
                }

            case '/asignacion/estudiantes':
                if (method === 'GET') {
                    await this.controller.obtenerEstudiantes(req, res);
                    return true;
                } else {
                    res.writeHead(405, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Método no permitido' }));
                    return true;
                }

            case '/asignacion/materias':
                if (method === 'GET') {
                    await this.controller.obtenerMaterias(req, res);
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

module.exports = AsigancionRoutes;