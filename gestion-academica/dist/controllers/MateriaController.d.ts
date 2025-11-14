import { IncomingMessage, ServerResponse } from "http";
declare class MateriaController {
    private negocioMateria;
    constructor();
    crear(req: IncomingMessage, res: ServerResponse): Promise<void>;
    actualizar(req: IncomingMessage, res: ServerResponse): Promise<void>;
    cambiarEstado(req: IncomingMessage, res: ServerResponse): Promise<void>;
    obtenerPorId(req: IncomingMessage, res: ServerResponse): Promise<void>;
    obtenerTodasPorDocente(req: IncomingMessage, res: ServerResponse): Promise<void>;
    obtenerHorariosPorMateria(req: IncomingMessage, res: ServerResponse): Promise<void>;
    agregarHorario(req: IncomingMessage, res: ServerResponse): Promise<void>;
    actualizarHorario(req: IncomingMessage, res: ServerResponse): Promise<void>;
    eliminarHorario(req: IncomingMessage, res: ServerResponse): Promise<void>;
    generarQR(req: IncomingMessage, res: ServerResponse): Promise<void>;
    /**
     * NUEVO: Generar QR para inscripción (Strategy Pattern)
     * POST /materia/qr/inscripcion
     */
    generarQRInscripcion(req: IncomingMessage, res: ServerResponse): Promise<void>;
}
export default MateriaController;
//# sourceMappingURL=MateriaController.d.ts.map