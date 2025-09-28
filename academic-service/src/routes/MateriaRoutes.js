const MateriaController = require("../controllers/MateriaController");

class MateriaRoutes {
    constructor() {
        this.controller = new MateriaController();
    }

    async handleRoute(req, res, pathname, method, parsedUrl) {
        switch (pathname) {
            case '/materia':
                if (method === 'POST') {
                    await this.controller.crear(req, res);
                    return true;
                } else if (method === 'GET') {
                    await this.controller.obtenerPorId(req, res);
                    return true;
                } else if (method === 'PUT') {
                    await this.controller.actualizar(req, res);
                    return true;
                } else if (method === 'PATCH') {
                    await this.controller.cambiarEstado(req, res);
                    return true;
                } else {
                    res.writeHead(405, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Método no permitido' }));
                    return true;
                }

            case '/materias':
                if (method === 'GET') {
                    await this.controller.obtenerTodasPorDocente(req, res);
                    return true;
                } else {
                    res.writeHead(405, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Método no permitido' }));
                    return true;
                }

            case '/materias/horarios':
                if (method === 'GET') {
                    await this.controller.obtenerHorariosPorMateria(req, res);
                    return true;
                } else {
                    res.writeHead(405, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Método no permitido' }));
                    return true;
                }

            case '/materia/horario':
                if (method === 'POST') {
                    await this.controller.agregarHorario(req, res);
                    return true;
                } else if (method === 'GET') {
                    await this.controller.obtenerHorarioPorId(req, res);
                    return true;
                } else if (method === 'PUT') {
                    await this.controller.actualizarHorario(req, res);
                    return true;
                } else if (method === 'DELETE') {
                    await this.controller.eliminarHorario(req, res);
                    return true;
                } else {
                    res.writeHead(405, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Método no permitido' }));
                    return true;
                }

            case '/materia/horarios':
                if (method === 'DELETE') {
                    await this.controller.eliminarTodosHorarios(req, res);
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

module.exports = MateriaRoutes;