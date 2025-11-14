export interface EstrategiaInscripcion {
  inscribir(datos: any): Promise<{
    success: boolean;
    data?: any;
    error?: string;
    message?: string;
  }>;
}
