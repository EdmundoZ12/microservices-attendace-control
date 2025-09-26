require('dotenv').config();
const { Pool } = require('pg');

class Database {
    constructor() {
        this.pool = new Pool({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        });

        this.pool.on('error', (err, client) => {
            console.error('Error en cliente de base de datos:', err);
        });
    }

    // Método para ejecutar consultas
    async query(text, params) {
        try {
            const result = await this.pool.query(text, params);
            return result;
        } catch (error) {
            console.error('Error en query:', error);
            throw error;
        }
    }

    // Método para cerrar conexiones
    async disconnect() {
        try {
            await this.pool.end();
            console.log('Conexiones cerradas');
        } catch (error) {
            console.error('Error al cerrar conexiones:', error);
            throw error;
        }
    }
}

module.exports = Database;