export interface EstrategiaInscripcion {
    /**
     * Inscribir estudiante en una materia
     * @param datos - Datos necesarios para la inscripción
     * @returns Resultado de la inscripción
     */
    inscribir(datos: any): Promise<{
        success: boolean;
        data?: any;
        error?: string;
        message?: string;
    }>;
}
//# sourceMappingURL=EstrategiaInscripcion.d.ts.map