import { IncomingMessage, ServerResponse } from "http";
import AsignacionController from "../controllers/AsignacionController";

class AsigancionRoutes {
  private controller: AsignacionController;

  constructor() {
    this.controller = new AsignacionController();
  }

  async handleRoute(
    req: IncomingMessage,
    res: ServerResponse,
    pathname: string,
    method: string,
    parsedUrl: any
  ): Promise<boolean> {
    switch (pathname) {
      case "/asignacion":
        if (method === "POST") {
          await this.controller.asignar(req, res);
          return true;
        } else if (method === "DELETE") {
          await this.controller.desasignar(req, res);
          return true;
        } else {
          res.writeHead(405, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Método no permitido" }));
          return true;
        }

      case "/asignacion/estudiantes":
        if (method === "GET") {
          await this.controller.obtenerEstudiantes(req, res);
          return true;
        } else {
          res.writeHead(405, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Método no permitido" }));
          return true;
        }

      case "/asignacion/materias":
        if (method === "GET") {
          await this.controller.obtenerMaterias(req, res);
          return true;
        } else {
          res.writeHead(405, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Método no permitido" }));
          return true;
        }

      case "/asignacion/docente":
        if (method === "POST") {
          await this.controller.inscribirPorDocente(req, res);
          return true;
        } else {
          res.writeHead(405, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Método no permitido" }));
          return true;
        }

      case "/asignacion/qr":
        if (method === "POST") {
          await this.controller.inscribirPorQR(req, res);
          return true;
        } else {
          res.writeHead(405, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Método no permitido" }));
          return true;
        }

      default:
        return false;
    }
  }
}

export default AsigancionRoutes;
