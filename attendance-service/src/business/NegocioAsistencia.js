const DatosAsistencia = require('../data/DatosAsistencia');
const jwt = require('jsonwebtoken');

class NegocioAsistencia {
    constructor() {
        this.datosAsistencia = new DatosAsistencia();
    }

    async registrarAsistencia(qr_token, estudiante_id, ubicacion_lat, ubicacion_lng) {
        try {
            // Decodificar y validar JWT

            console.log(qr_token);

            console.log(process.env.JWT_SECRET);


            let payload;
            try {
                payload = jwt.verify(qr_token, process.env.JWT_SECRET);
            } catch (error) {
                if (error.name === 'TokenExpiredError') {
                    return { success: false, error: 'QR_EXPIRADO', message: 'El código QR ha expirado' };
                }
                return { success: false, error: 'QR_INVALIDO', message: 'Código QR inválido' };
            }

            const { materia_id, horario_id, fecha, dia_semana, hora_inicio, hora_fin } = payload;

            // Validar que el estudiante está inscrito en la materia
            const estudianteInscrito = await this.datosAsistencia.verificarEstudianteInscrito(estudiante_id, materia_id);
            if (!estudianteInscrito) {
                return { success: false, error: 'ESTUDIANTE_NO_INSCRITO', message: 'No estás inscrito en esta materia' };
            }

            // Validar que la materia está activa y obtener coordenadas del aula
            const materia = await this.datosAsistencia.verificarMateriaActiva(materia_id);
            if (!materia) {
                return { success: false, error: 'MATERIA_INACTIVA', message: 'La materia no está activa' };
            }

            // Validar que no ha registrado asistencia hoy
            const fechaHoy = new Date().toISOString().split('T')[0];
            const asistenciaExiste = await this.datosAsistencia.verificarAsistenciaExiste(estudiante_id, materia_id, fechaHoy);
            if (asistenciaExiste) {
                return { success: false, error: 'ASISTENCIA_YA_REGISTRADA', message: 'Ya registraste asistencia hoy en esta materia' };
            }

            // Validar proximidad GPS (radio de 50 metros)
            const distancia = this.calcularDistancia(
                parseFloat(ubicacion_lat),
                parseFloat(ubicacion_lng),
                parseFloat(materia.latitud),
                parseFloat(materia.longitud)
            );

            if (distancia > 50) { // 50 metros de radio
                return {
                    success: false,
                    error: 'UBICACION_INCORRECTA',
                    message: `Debes estar cerca del aula. Distancia: ${Math.round(distancia)}m`
                };
            }

            // Validar que está dentro del horario de clase (con margen de 15 minutos antes y 30 después)
            const horaActual = new Date();
            const horaInicioClase = this.convertirHoraString(hora_inicio);
            const horaFinClase = this.convertirHoraString(hora_fin);

            // Margen: 15 min antes y 30 min después
            horaInicioClase.setMinutes(horaInicioClase.getMinutes() - 15);
            horaFinClase.setMinutes(horaFinClase.getMinutes() + 30);

            const horaActualSolo = new Date();
            horaActualSolo.setHours(horaActual.getHours(), horaActual.getMinutes(), 0, 0);

            if (horaActualSolo < horaInicioClase || horaActualSolo > horaFinClase) {
                return {
                    success: false,
                    error: 'FUERA_DE_HORARIO',
                    message: `Clase de ${hora_inicio} a ${hora_fin}. Puedes registrar desde 15 min antes hasta 30 min después`
                };
            }

            // Registrar asistencia
            const asistencia = await this.datosAsistencia.registrar(
                estudiante_id,
                materia_id,
                fechaHoy,
                ubicacion_lat,
                ubicacion_lng
            );

            return {
                success: true,
                data: {
                    asistencia: asistencia,
                    distancia_metros: Math.round(distancia),
                    horario: {
                        dia: dia_semana,
                        inicio: hora_inicio,
                        fin: hora_fin
                    }
                }
            };

        } catch (error) {
            console.error('Error en NegocioAsistencia.registrarAsistencia:', error);
            return { success: false, error: 'ERROR_INTERNO', message: 'Error interno del sistema' };
        }
    }

    async obtenerAsistenciasEstudiante(estudiante_id) {
        try {
            const resultado = await this.datosAsistencia.obtenerAsistenciasPorEstudiante(estudiante_id);
            return { success: true, data: resultado };
        } catch (error) {
            console.error('Error en NegocioAsistencia.obtenerAsistenciasEstudiante:', error);
            return { success: false, error: 'ERROR_INTERNO', message: 'Error interno del sistema' };
        }
    }

    async obtenerAsistenciasMateria(materia_id) {
        try {
            const resultado = await this.datosAsistencia.obtenerAsistenciasPorMateria(materia_id);
            return { success: true, data: resultado };s
        } catch (error) {
            console.error('Error en NegocioAsistencia.obtenerAsistenciasMateria:', error);
            return { success: false, error: 'ERROR_INTERNO', message: 'Error interno del sistema' };
        }
    }

    // Métodos de utilidad privados

    calcularDistancia(lat1, lng1, lat2, lng2) {
        const R = 6371000; // Radio de la Tierra en metros
        const dLat = this.degreesToRadians(lat2 - lat1);
        const dLng = this.degreesToRadians(lng2 - lng1);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.degreesToRadians(lat1)) * Math.cos(this.degreesToRadians(lat2)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distancia en metros
    }

    degreesToRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    convertirHoraString(horaString) {
        const [horas, minutos] = horaString.split(':').map(Number);
        const fecha = new Date();
        fecha.setHours(horas, minutos, 0, 0);
        return fecha;
    }
}

module.exports = NegocioAsistencia;