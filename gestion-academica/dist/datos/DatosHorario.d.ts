interface Horario {
    id: number;
    materia_id: number;
    dia_semana: string;
    hora_inicio: string;
    hora_fin: string;
}
declare class DatosHorario {
    private db;
    constructor();
    crear(materia_id: number, dia_semana: string, hora_inicio: string, hora_fin: string): Promise<Horario>;
    actualizar(horario_id: number, dia_semana: string, hora_inicio: string, hora_fin: string): Promise<Horario | null>;
    eliminar(horario_id: number): Promise<Horario | null>;
    eliminarTodos(materia_id: number): Promise<boolean>;
    obtenerPorMateria(materia_id: number): Promise<Horario[]>;
    obtenerPorId(horario_id: number): Promise<Horario | null>;
}
export default DatosHorario;
//# sourceMappingURL=DatosHorario.d.ts.map