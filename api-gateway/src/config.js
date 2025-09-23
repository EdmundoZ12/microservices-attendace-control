// Cargar variables de entorno
require('dotenv').config();

// Configuración del API Gateway
const config = {
    // Puerto del Gateway
    port: parseInt(process.env.GATEWAY_PORT) || 3000,

    // JWT Configuration
    jwt: {
        secret: process.env.JWT_SECRET || 'fallback-secret-key',
        expiresIn: '24h'
    },

    // URLs de los microservicios
    services: {
        auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
        academic: process.env.ACADEMIC_SERVICE_URL || 'http://localhost:3002',
        attendance: process.env.ATTENDANCE_SERVICE_URL || 'http://localhost:3003'
    },

    // Rutas públicas (no requieren autenticación)
    publicRoutes: [
        '/auth/login',
        '/auth/register/student',
        '/auth/register/teacher',
        '/health'
    ],

    // Configuración de CORS
    cors: {
        origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['*'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    },

    // Configuración de logging
    logging: {
        enabled: process.env.LOGGING_ENABLED !== 'false',
        level: process.env.LOG_LEVEL || 'info'
    },

    // Environment
    environment: process.env.NODE_ENV || 'development'
};

module.exports = config;