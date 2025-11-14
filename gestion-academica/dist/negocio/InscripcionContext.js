"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * CONTEXTO - Strategy Pattern
 * Mantiene una referencia a la estrategia actual y delega el trabajo
 */
class InscripcionContext {
    constructor() {
        // Constructor vacío - la estrategia se configura dinámicamente
    }
    /**
     * Cambiar la estrategia en tiempo de ejecución
     */
    setEstrategia(estrategia) {
        this.estrategia = estrategia;
    }
    /**
     * Obtener la estrategia actual
     */
    getEstrategia() {
        return this.estrategia;
    }
    /**
     * Delegar la inscripción a la estrategia actual
     * Este método se corresponde con doSomething() del diagrama UML
     */
    async ejecutarInscripcion(datos) {
        if (!this.estrategia) {
            return {
                success: false,
                error: "ESTRATEGIA_NO_DEFINIDA",
                message: "No se ha configurado una estrategia de inscripción",
            };
        }
        // Delega la ejecución a la estrategia actual
        return await this.estrategia.inscribir(datos);
    }
}
exports.default = InscripcionContext;
