interface Asignacion {
    estudiante_id: number;
    materia_id: number;
}
interface Estudiante {
    usuario_id: number;
    nombre: string;
    apellido: string;
    email: string;
    carrera: string;
}
interface Materia {
    id: number;
    nombre: string;
    codigo: string;
    grupo: string;
    descripcion: string;
}
declare class DatosAsignacion {
    private db;
    constructor();
    asignar(estudiante_id: number, materia_id: number): Promise<Asignacion>;
    verificarAsignacion(estudiante_id: number, materia_id: number): Promise<boolean>;
    verificarEstudianteExiste(estudiante_id: number): Promise<boolean>;
    obtenerEstudiantesPorMateria(materia_id: number): Promise<Estudiante[]>;
    obtenerMateriasPorEstudiante(estudiante_id: number): Promise<Materia[]>;
    desasignar(estudiante_id: number, materia_id: number): Promise<void>;
}
export default DatosAsignacion;
//# sourceMappingURL=DatosAsignacion.d.ts.map