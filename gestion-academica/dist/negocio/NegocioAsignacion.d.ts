import DatosAsignacion from "../datos/DatosAsignacion";
import DatosMateria from "../datos/DatosMateria";
import { InscripcionContext } from "./InscripcionContext";
declare class NegocioAsignacion {
    datosAsignacion: DatosAsignacion;
    datosMateria: DatosMateria;
    contexto: InscripcionContext;
    constructor();
    /**
     * Inscribir estudiante usando la estrategia actual del contexto
     */
    inscribirEstudiante(datos: any): Promise<any>;
    /**
     * CU06: ASIGNAR ESTUDIANTE A MATERIA (método existente - mantener compatibilidad)
     */
    asignarEstudiante(materia_id: number, estudiante_id: number): Promise<any>;
    /**
     * Obtener estudiantes de una materia
     */
    obtenerEstudiantesDeMateria(materia_id: number): Promise<any>;
    /**
     * Obtener materias de un estudiante
     */
    obtenerMateriasDeEstudiante(estudiante_id: number): Promise<any>;
    /**
     * Desasignar estudiante de una materia
     */
    desasignarEstudiante(materia_id: number, estudiante_id: number): Promise<any>;
}
export default NegocioAsignacion;
//# sourceMappingURL=NegocioAsignacion.d.ts.map