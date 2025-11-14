import { EstrategiaInscripcion } from "./strategies/EstrategiaInscripcion";

/**
 * CONTEXTO - Strategy Pattern
 * Mantiene una referencia a la estrategia actual y delega el trabajo
 */
export default class InscripcionContext {
  private estrategia?: EstrategiaInscripcion;

  constructor() {}

  setEstrategia(estrategia: EstrategiaInscripcion): void {
    this.estrategia = estrategia;
  }

  getEstrategia(): EstrategiaInscripcion | undefined {
    return this.estrategia;
  }

  async ejecutarInscripcion(datos: any): Promise<{
    success: boolean;
    data?: any;
    error?: string;
    message?: string;
  }> {
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
