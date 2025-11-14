import { EstrategiaInscripcion } from "./EstrategiaInscripcion";
import DatosAsignacion from "../../datos/DatosAsignacion";
import DatosMateria from "../../datos/DatosMateria";
export declare class InscripcionPorQR implements EstrategiaInscripcion {
    private datosAsignacion;
    private datosMateria;
    constructor(datosAsignacion: DatosAsignacion, datosMateria: DatosMateria);
    inscribir(datos: {
        qr_token: string;
        estudiante_id: number;
    }): Promise<{
        success: boolean;
        data?: any;
        error?: string;
        message?: string;
    }>;
}
//# sourceMappingURL=InscripcionPorQR.d.ts.map