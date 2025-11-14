"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AsignacionController_1 = __importDefault(require("../controllers/AsignacionController"));
class AsigancionRoutes {
    constructor() {
        this.controller = new AsignacionController_1.default();
    }
    async handleRoute(req, res, pathname, method, parsedUrl) {
        switch (pathname) {
            case "/asignacion":
                if (method === "POST") {
                    await this.controller.asignar(req, res);
                    return true;
                }
                else if (method === "DELETE") {
                    await this.controller.desasignar(req, res);
                    return true;
                }
                else {
                    res.writeHead(405, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Método no permitido" }));
                    return true;
                }
            case "/asignacion/estudiantes":
                if (method === "GET") {
                    await this.controller.obtenerEstudiantes(req, res);
                    return true;
                }
                else {
                    res.writeHead(405, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Método no permitido" }));
                    return true;
                }
            case "/asignacion/materias":
                if (method === "GET") {
                    await this.controller.obtenerMaterias(req, res);
                    return true;
                }
                else {
                    res.writeHead(405, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Método no permitido" }));
                    return true;
                }
            case "/asignacion/docente":
                if (method === "POST") {
                    await this.controller.inscribirPorDocente(req, res);
                    return true;
                }
                else {
                    res.writeHead(405, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Método no permitido" }));
                    return true;
                }
            case "/asignacion/qr":
                if (method === "POST") {
                    await this.controller.inscribirPorQR(req, res);
                    return true;
                }
                else {
                    res.writeHead(405, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Método no permitido" }));
                    return true;
                }
            default:
                return false;
        }
    }
}
exports.default = AsigancionRoutes;
