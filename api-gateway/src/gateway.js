const http = require('http');
const url = require('url');
const { createProxyMiddleware } = require('http-proxy-middleware');
const jwt = require('jsonwebtoken');

// Configuración básica
const config = require('./config');

// Middleware para logging
function logRequest(req, res, next) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
}

// Middleware para CORS
function setupCORS(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    next();
}

// Función para determinar qué servicio usar
function getTargetService(pathname) {
    if (pathname.startsWith('/auth')) {
        return config.services.auth;
    } else if (pathname.startsWith('/academic')) {
        return config.services.academic;
    } else if (pathname.startsWith('/attendance')) {
        return config.services.attendance;
    }
    return null;
}

// Función para manejar el proxy
function proxyRequest(req, res, targetUrl) {
    const proxy = createProxyMiddleware({
        target: targetUrl,
        changeOrigin: true,
        pathRewrite: {
            '^/auth': '',
            '^/academic': '',
            '^/attendance': ''
        },
        onError: (err, req, res) => {
            console.error('Proxy Error:', err.message);
            res.writeHead(502, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                error: 'Error de conexión con el servicio'
            }));
        }
    });

    proxy(req, res);
}

// Crear servidor
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // Ejecutar middlewares
    logRequest(req, res, () => {
        setupCORS(req, res, () => {
            // Determinar servicio destino
            const targetService = getTargetService(pathname);

            if (!targetService) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
                return;
            }

            // Hacer proxy de la petición
            proxyRequest(req, res, targetService);
        });
    });
});

// Iniciar servidor
server.listen(config.port, () => {
    console.log(`API Gateway iniciado en puerto ${config.port}`);
    console.log(`Servicios configurados:`);
    console.log(`- Auth Service: ${config.services.auth}`);
    console.log(`- Academic Service: ${config.services.academic}`);
    console.log(`- Attendance Service: ${config.services.attendance}`);
});

console.log('Servidor iniciándose...');