interface Horario {
    dia_semana: string;
    hora_inicio: string;
    hora_fin: string;
}
declare class NegocioMateria {
    private datosMateria;
    private datosHorario;
    constructor();
    crear(nombre: string, codigo: string, descripcion: string, grupo: string, docente_id: number, latitud: number, longitud: number, horarios: Horario[]): Promise<any>;
    actualizar(id: number, nombre: string, codigo: string, descripcion: string, grupo: string, latitud: number, longitud: number, activo: boolean): Promise<any>;
    cambiarEstado(id: number): Promise<any>;
    obtenerPorId(id: number): Promise<any>;
    obtenerTodasPorDocente(docente_id: number): Promise<any>;
    obtenerHorariosPorMateria(materia_id: number): Promise<any>;
    obtenerHorarioPorId(horario_id: number): Promise<any>;
    agregarHorario(materia_id: number, dia_semana: string, hora_inicio: string, hora_fin: string): Promise<any>;
    actualizarHorario(horario_id: number, dia_semana: string, hora_inicio: string, hora_fin: string): Promise<any>;
    eliminarHorario(horario_id: number): Promise<any>;
    eliminarTodosHorarios(materia_id: number): Promise<any>;
    generarQR(materia_id: number, horario_id: number, docente_id: number): Promise<any>;
    /**
     * NUEVO: Generar QR para inscripción (sin validar día)
     */
    generarQRInscripcion(materia_id: number, docente_id: number, duracion_dias?: number): Promise<any>;
    private validarCoordenadas;
    private validarHorario;
    private validarHorarios;
}
export default NegocioMateria;
//# sourceMappingURL=NegocioMateria.d.ts.map