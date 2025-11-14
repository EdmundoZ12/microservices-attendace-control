import { EstrategiaInscripcion } from "./strategies/EstrategiaInscripcion";
/**
 * CONTEXTO - Strategy Pattern
 * Mantiene una referencia a la estrategia actual y delega el trabajo
 */
export declare class InscripcionContext {
    private estrategia;
    constructor(estrategia: EstrategiaInscripcion);
    /**
     * Cambiar la estrategia en tiempo de ejecución
     */
    setEstrategia(estrategia: EstrategiaInscripcion): void;
    /**
     * Obtener la estrategia actual
     */
    getEstrategia(): EstrategiaInscripcion;
    /**
     * Delegar la inscripción a la estrategia actual
     */
    inscribirEstudiante(datos: any): Promise<{
        success: boolean;
        data?: any;
        error?: string;
        message?: string;
    }>;
}
//# sourceMappingURL=InscripcionContext.d.ts.map