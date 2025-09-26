require('dotenv').config();
const http = require('http');
const url = require('url');

// Solo importar rutas
const StudentRoutes = require('./routes/RutasEstudiante');
const TeacherRoutes = require('./routes/RutasDocente');
const AuthRoutes = require('./routes/RutasAuth');

const PORT = process.env.PORT || 3001;

// Instanciar solo rutas (ellas crean sus controladores internamente)
const studentRoutes = new StudentRoutes();
const teacherRoutes = new TeacherRoutes();
const authRoutes = new AuthRoutes();

// Helper para manejar CORS
function handleCORS(req, res) {
    if (req.method === 'OPTIONS') {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        });
        res.end();
        return true;
    }
    return false;
}

// Router principal
async function router(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    try {
        if (handleCORS(req, res)) return;

        console.log(`[${new Date().toISOString()}] ${method} ${pathname}`);

        // Ruta básica
        if (pathname === '/' && method === 'GET') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Auth Service funcionando' }));
            return;
        }

        // Intentar con rutas de estudiante
        let handled = await studentRoutes.handleRoute(req, res, pathname, method, parsedUrl);

        // Si no fue manejada, intentar con rutas de docente
        if (!handled) {
            handled = await teacherRoutes.handleRoute(req, res, pathname, method, parsedUrl);
        }

        if (!handled) {
            handled = await authRoutes.handleRoute(req, res, pathname, method, parsedUrl);
        }

        if (!handled) {
            if (!res.headersSent) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
            }
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

server.listen(PORT,  () => {
    console.log(`Auth Service iniciado en http://192.168.100.101:${PORT}`);
});

process.on('SIGTERM', () => {
    server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
    server.close(() => process.exit(0));
});