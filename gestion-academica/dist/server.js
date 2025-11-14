"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http"));
const url_1 = __importDefault(require("url"));
const MateriaRoutes_1 = __importDefault(require("./routes/MateriaRoutes"));
const AsignacionRoutes_1 = __importDefault(require("./routes/AsignacionRoutes"));
dotenv_1.default.config();
const PORT = process.env.PORT || 3002;
const materiaRoutes = new MateriaRoutes_1.default();
const estudianteMateriaRoutes = new AsignacionRoutes_1.default();
function handleCORS(req, res) {
    if (req.method === "OPTIONS") {
        res.writeHead(200, {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        });
        res.end();
        return true;
    }
    return false;
}
async function router(req, res) {
    const parsedUrl = url_1.default.parse(req.url || "", true);
    const pathname = parsedUrl.pathname || "";
    const method = req.method || "";
    try {
        if (handleCORS(req, res))
            return;
        console.log(`[${new Date().toISOString()}] ${method} ${pathname}`);
        if (pathname === "/" && method === "GET") {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Academic Service funcionando" }));
            return;
        }
        let handled = await materiaRoutes.handleRoute(req, res, pathname, method, parsedUrl);
        if (!handled) {
            handled = await materiaRoutes.handleRoute(req, res, pathname, method, parsedUrl);
        }
        if (!handled) {
            handled = await estudianteMateriaRoutes.handleRoute(req, res, pathname, method, parsedUrl);
        }
        if (!handled) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Ruta no encontrada" }));
            return;
        }
    }
    catch (error) {
        console.error("Error en router:", error);
        if (!res.headersSent) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Error interno del servidor" }));
        }
    }
}
const server = http_1.default.createServer(router);
server.listen(PORT, () => {
    console.log(`Academic Service escuchando en el puerto ${PORT}`);
});
process.on("SIGTERM", () => {
    server.close(() => process.exit(0));
});
process.on("SIGINT", () => {
    server.close(() => process.exit(0));
});
