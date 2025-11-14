import { IncomingMessage, ServerResponse } from "http";
declare class AsignacionController {
    private negocioAsignacion;
    constructor();
    /**
     * CU06: ASIGNAR ESTUDIANTE A MATERIA (método existente - mantener compatibilidad)
     * POST /asignacion
     */
    asignar(req: IncomingMessage, res: ServerResponse): Promise<void>;
    /**
     * NUEVO: Inscripción por Docente usando Strategy Pattern
     * POST /asignacion/docente
     */
    inscribirPorDocente(req: IncomingMessage, res: ServerResponse): Promise<void>;
    /**
     * NUEVO: Auto-inscripción por QR usando Strategy Pattern
     * POST /asignacion/qr
     */
    inscribirPorQR(req: IncomingMessage, res: ServerResponse): Promise<void>;
    /**
     * Obtener estudiantes de una materia
     * GET /asignacion/materia/:id/estudiantes
     */
    obtenerEstudiantes(req: IncomingMessage, res: ServerResponse): Promise<void>;
    /**
     * Obtener materias de un estudiante
     * GET /asignacion/estudiante/:id/materias
     */
    obtenerMaterias(req: IncomingMessage, res: ServerResponse): Promise<void>;
    /**
     * Desasignar estudiante de materia
     * DELETE /asignacion
     */
    desasignar(req: IncomingMessage, res: ServerResponse): Promise<void>;
}
export default AsignacionController;
//# sourceMappingURL=AsignacionController.d.ts.map