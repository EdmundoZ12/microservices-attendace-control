import { EstrategiaInscripcion } from "./EstrategiaInscripcion";
import DatosAsignacion from "../../datos/DatosAsignacion";
import DatosMateria from "../../datos/DatosMateria";
export declare class InscripcionPorDocente implements EstrategiaInscripcion {
    private datosAsignacion;
    private datosMateria;
    constructor(datosAsignacion: DatosAsignacion, datosMateria: DatosMateria);
    inscribir(datos: {
        materia_id: number;
        estudiante_id: number;
        docente_id: number;
    }): Promise<{
        success: boolean;
        data?: any;
        error?: string;
        message?: string;
    }>;
}
//# sourceMappingURL=InscripcionPorDocente.d.ts.map