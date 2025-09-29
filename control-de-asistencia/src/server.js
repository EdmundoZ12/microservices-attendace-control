require('dotenv').config();
const http = require('http');
const url = require('url');

const AsistenciaRoutes = require('./routes/AsistenciaRoutes');

const PORT = process.env.PORT || 3003;

const asistenciaRoutes = new AsistenciaRoutes();

function handleCORS(req, res) {
    if (req.method === 'OPTIONS') {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        });
        res.end();
        return true;
    }
    return false;
}

async function router(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    try {
        if (handleCORS(req, res)) return;

        console.log(`[${new Date().toISOString()}] ${method} ${pathname}`);

        if (pathname === '/' && method === 'GET') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Attendance Service funcionando' }));
            return;
        }

        let handled = await asistenciaRoutes.handleRoute(req, res, pathname, method, parsedUrl);

        if (!handled) {
            handled = await asistenciaRoutes.handleRoute(req, res, pathname, method, parsedUrl);
        }

        if (!handled) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
            return;
        }

    } catch (error) {
        console.error('Error en router:', error);
        if (!res.headersSent) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error interno del servidor' }));
        }
    }

}

const server = http.createServer(router);

server.listen(PORT, () => {
    console.log(`Attendance Service escuchando en el puerto ${PORT}`);
});

process.on('SIGTERM', () => {
    server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
    server.close(() => process.exit(0));
});