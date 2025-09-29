const DatosAsignacion = require('../datos/DatosAsignacion');
const DatosMateria = require('../datos/DatosMateria');

class NegocioAsignacion {
    constructor() {
        this.datosAsignacion = new DatosAsignacion();
        this.datosMateria = new DatosMateria();
    }

    async asignarEstudiante(materia_id, estudiante_id) {
        try {
            // Validar que la materia existe y está activa
            const materia = await this.datosMateria.obtenerPorId(materia_id);
            if (!materia) {
                return { success: false, error: 'MATERIA_NO_ENCONTRADA', message: 'Materia no encontrada' };
            }

            if (!materia.activo) {
                return { success: false, error: 'MATERIA_INACTIVA', message: 'No se puede asignar estudiantes a una materia inactiva' };
            }

            // Validar que el estudiante existe
            const estudianteExiste = await this.datosAsignacion.verificarEstudianteExiste(estudiante_id);
            if (!estudianteExiste) {
                return { success: false, error: 'ESTUDIANTE_NO_ENCONTRADO', message: 'El estudiante no existe' };
            }

            // Verificar que no esté ya asignado
            const yaAsignado = await this.datosAsignacion.verificarAsignacion(estudiante_id, materia_id);
            if (yaAsignado) {
                return { success: false, error: 'ESTUDIANTE_YA_ASIGNADO', message: 'El estudiante ya está inscrito en esta materia' };
            }

            // Realizar la asignación
            const resultado = await this.datosAsignacion.asignar(estudiante_id, materia_id);
            return { success: true, data: resultado };

        } catch (error) {
            console.error('Error en NegocioAsignacion.asignarEstudiante:', error);
            return { success: false, error: 'ERROR_INTERNO', message: 'Error interno del sistema' };
        }
    }

    async obtenerEstudiantesDeMateria(materia_id) {
        try {
            // Validar que la materia existe
            const materia = await this.datosMateria.obtenerPorId(materia_id);
            if (!materia) {
                return { success: false, error: 'MATERIA_NO_ENCONTRADA', message: 'Materia no encontrada' };
            }

            // Obtener estudiantes inscritos en la materia
            const estudiantes = await this.datosAsignacion.obtenerEstudiantesPorMateria(materia_id);

            return {
                success: true,
                data: {
                    materia: {
                        id: materia.id,
                        nombre: materia.nombre,
                        codigo: materia.codigo,
                        grupo: materia.grupo
                    },
                    estudiantes: estudiantes,
                    total_estudiantes: estudiantes.length
                }
            };

        } catch (error) {
            console.error('Error en NegocioAsignacion.obtenerEstudiantesDeMateria:', error);
            return { success: false, error: 'ERROR_INTERNO', message: 'Error interno del sistema' };
        }
    }

    async obtenerMateriasDeEstudiante(estudiante_id) {
        try {
            // Validar que el estudiante existe
            const estudianteExiste = await this.datosAsignacion.verificarEstudianteExiste(estudiante_id);
            if (!estudianteExiste) {
                return { success: false, error: 'ESTUDIANTE_NO_ENCONTRADO', message: 'El estudiante no existe' };
            }

            // Obtener materias del estudiante
            const materias = await this.datosAsignacion.obtenerMateriasPorEstudiante(estudiante_id);

            return {
                success: true,
                data: {
                    estudiante_id: estudiante_id,
                    materias: materias,
                    total_materias: materias.length
                }
            };

        } catch (error) {
            console.error('Error en NegocioAsignacion.obtenerMateriasDeEstudiante:', error);
            return { success: false, error: 'ERROR_INTERNO', message: 'Error interno del sistema' };
        }
    }

    async desasignarEstudiante(materia_id, estudiante_id) {
        try {
            // Verificar que la asignación existe
            const asignacionExiste = await this.datosAsignacion.verificarAsignacion(estudiante_id, materia_id);
            if (!asignacionExiste) {
                return { success: false, error: 'ASIGNACION_NO_ENCONTRADA', message: 'El estudiante no está inscrito en esta materia' };
            }

            // Realizar la desasignación
            const resultado = await this.datosAsignacion.desasignar(estudiante_id, materia_id);
            return { success: true, data: resultado };

        } catch (error) {
            console.error('Error en NegocioAsignacion.desasignarEstudiante:', error);
            return { success: false, error: 'ERROR_INTERNO', message: 'Error interno del sistema' };
        }
    }
}

module.exports = NegocioAsignacion;