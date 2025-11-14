interface Materia {
    id: number;
    nombre: string;
    codigo: string;
    descripcion: string;
    grupo: string;
    docente_id: number;
    latitud: number;
    longitud: number;
    activo: boolean;
}
declare class DatosMateria {
    private db;
    constructor();
    crear(nombre: string, codigo: string, descripcion: string, grupo: string, docente_id: number, latitud: number, longitud: number): Promise<Materia>;
    actualizar(id: number, nombre: string, codigo: string, descripcion: string, grupo: string, latitud: number, longitud: number, activo: boolean): Promise<Materia | null>;
    cambiarEstado(id: number): Promise<Materia | null>;
    obtenerPorId(id: number): Promise<Materia | null>;
    obtenerTodasPorDocente(docente_id: number): Promise<Materia[]>;
    verificarDocenteExiste(docente_id: number): Promise<boolean>;
}
export default DatosMateria;
//# sourceMappingURL=DatosMateria.d.ts.map