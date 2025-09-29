const DatosMateria = require('../datos/DatosMateria');
const DatosHorario = require('../datos/DatosHorario');
const jwt = require('jsonwebtoken');
const QRCode = require('qrcode');
class NegocioMateria {
    constructor() {
        this.datosMateria = new DatosMateria();
        this.datosHorario = new DatosHorario();
    }

    async crear(nombre, codigo, descripcion, grupo, docente_id, latitud, longitud, horarios) {
        try {
            // Validar que el docente existe
            const docenteExiste = await this.datosMateria.verificarDocenteExiste(docente_id);
            if (!docenteExiste) {
                return { success: false, error: 'DOCENTE_NO_ENCONTRADO', message: 'El docente no existe' };
            }

            // Validar coordenadas GPS
            if (!this.validarCoordenadas(latitud, longitud)) {
                return { success: false, error: 'COORDENADAS_INVALIDAS', message: 'Las coordenadas GPS no son válidas' };
            }

            // Validar horarios
            const horariosValidos = this.validarHorarios(horarios);
            if (!horariosValidos.valido) {
                return { success: false, error: 'HORARIOS_INVALIDOS', message: horariosValidos.mensaje };
            }

            // Crear materia
            const materia = await this.datosMateria.crear(nombre, codigo, descripcion, grupo, docente_id, latitud, longitud);

            // Crear horarios para la materia
            for (const horario of horarios) {
                await this.datosHorario.crear(materia.id, horario.dia_semana, horario.hora_inicio, horario.hora_fin);
            }

            return { success: true, data: materia };

        } catch (error) {
            console.error('Error en NegocioMateria.crear:', error);
            return { success: false, error: 'ERROR_INTERNO', message: 'Error interno del sistema' };
        }
    }

    async actualizar(id, nombre, codigo, descripcion, grupo, latitud, longitud, activo) {
        try {
            // Validar coordenadas GPS
            console.log('Validando coordenadas:', { latitud, longitud });
            console.log('Resultado de validación:', this.validarCoordenadas(latitud, longitud));

            if (!this.validarCoordenadas(latitud, longitud)) {
                return { success: false, error: 'COORDENADAS_INVALIDAS', message: 'Las coordenadas GPS no son válidas' };
            }

            // Actualizar materia
            const resultado = await this.datosMateria.actualizar(id, nombre, codigo, descripcion, grupo, latitud, longitud, activo);
            if (!resultado) {
                return { success: false, error: 'MATERIA_NO_ENCONTRADA', message: 'Materia no encontrada' };
            }

            return { success: true, data: resultado };

        } catch (error) {
            console.error('Error en NegocioMateria.actualizar:', error);
            return { success: false, error: 'ERROR_INTERNO', message: 'Error interno del sistema' };
        }
    }

    async cambiarEstado(id) {
        try {
            const resultado = await this.datosMateria.cambiarEstado(id);
            if (!resultado) {
                return { success: false, error: 'MATERIA_NO_ENCONTRADA', message: 'Materia no encontrada' };
            }

            return { success: true, data: resultado };

        } catch (error) {
            console.error('Error en NegocioMateria.cambiarEstado:', error);
            return { success: false, error: 'ERROR_INTERNO', message: 'Error interno del sistema' };
        }
    }

    async obtenerPorId(id) {
        try {
            const resultado = await this.datosMateria.obtenerPorId(id);
            if (!resultado) {
                return { success: false, error: 'MATERIA_NO_ENCONTRADA', message: 'Materia no encontrada' };
            }

            return { success: true, data: resultado };

        } catch (error) {
            console.error('Error en NegocioMateria.obtenerPorId:', error);
            return { success: false, error: 'ERROR_INTERNO', message: 'Error interno del sistema' };
        }
    }

    async obtenerTodasPorDocente(docente_id) {
        try {
            const resultado = await this.datosMateria.obtenerTodasPorDocente(docente_id);
            return { success: true, data: resultado };

        } catch (error) {
            console.error('Error en NegocioMateria.obtenerTodasPorDocente:', error);
            return { success: false, error: 'ERROR_INTERNO', message: 'Error interno del sistema' };
        }
    }

    async obtenerHorariosPorMateria(materia_id) {
        try {
            const resultado = await this.datosHorario.obtenerPorMateria(materia_id);
            return { success: true, data: resultado };

        } catch (error) {
            console.error('Error en NegocioMateria.obtenerHorariosPorMateria:', error);
            return { success: false, error: 'ERROR_INTERNO', message: 'Error interno del sistema' };
        }
    }

    async obtenerHorarioPorId(horario_id) {
        try {
            const resultado = await this.datosHorario.obtenerPorId(horario_id);
            if (!resultado) {
                return { success: false, error: 'HORARIO_NO_ENCONTRADO', message: 'Horario no encontrado' };
            }

            return { success: true, data: resultado };

        } catch (error) {
            console.error('Error en NegocioMateria.obtenerHorarioPorId:', error);
            return { success: false, error: 'ERROR_INTERNO', message: 'Error interno del sistema' };
        }
    }

    // Métodos específicos para horarios

    async agregarHorario(materia_id, dia_semana, hora_inicio, hora_fin) {
        try {
            // Validar formato de horario
            if (!this.validarHorario(dia_semana, hora_inicio, hora_fin)) {
                return { success: false, error: 'HORARIO_INVALIDO', message: 'Formato de horario inválido' };
            }

            const resultado = await this.datosHorario.crear(materia_id, dia_semana, hora_inicio, hora_fin);
            return { success: true, data: resultado };

        } catch (error) {
            console.error('Error en NegocioMateria.agregarHorario:', error);
            return { success: false, error: 'ERROR_INTERNO', message: 'Error interno del sistema' };
        }
    }

    async actualizarHorario(horario_id, dia_semana, hora_inicio, hora_fin) {
        try {
            // Validar formato de horario
            if (!this.validarHorario(dia_semana, hora_inicio, hora_fin)) {
                return { success: false, error: 'HORARIO_INVALIDO', message: 'Formato de horario inválido' };
            }

            const resultado = await this.datosHorario.actualizar(horario_id, dia_semana, hora_inicio, hora_fin);
            if (!resultado) {
                return { success: false, error: 'HORARIO_NO_ENCONTRADO', message: 'Horario no encontrado' };
            }

            return { success: true, data: resultado };

        } catch (error) {
            console.error('Error en NegocioMateria.actualizarHorario:', error);
            return { success: false, error: 'ERROR_INTERNO', message: 'Error interno del sistema' };
        }
    }

    async eliminarHorario(horario_id) {
        try {
            const resultado = await this.datosHorario.eliminar(horario_id);
            if (!resultado) {
                return { success: false, error: 'HORARIO_NO_ENCONTRADO', message: 'Horario no encontrado' };
            }

            return { success: true, data: resultado };

        } catch (error) {
            console.error('Error en NegocioMateria.eliminarHorario:', error);
            return { success: false, error: 'ERROR_INTERNO', message: 'Error interno del sistema' };
        }
    }

    async eliminarTodosHorarios(materia_id) {
        try {
            await this.datosHorario.eliminarTodos(materia_id);
            return { success: true, data: true };

        } catch (error) {
            console.error('Error en NegocioMateria.eliminarTodosHorarios:', error);
            return { success: false, error: 'ERROR_INTERNO', message: 'Error interno del sistema' };
        }
    }


    async generarQR(materia_id, horario_id, docente_id) {
        try {
            // Obtener horario para validar día
            const horario = await this.datosHorario.obtenerPorId(horario_id);
            if (!horario) {
                return { success: false, error: 'HORARIO_NO_ENCONTRADO', message: 'Horario no encontrado' };
            }

            // Validar que es el día correcto
            const hoy = new Date();
            const diasSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
            const diaActual = diasSemana[hoy.getDay()];

            if (horario.dia_semana !== diaActual) {
                return { success: false, error: 'DIA_INCORRECTO', message: `Hoy es ${diaActual}, la clase es ${horario.dia_semana}` };
            }

            // Crear payload JWT
            const fechaActual = hoy.toISOString().split('T')[0]; // YYYY-MM-DD
            const expiracion = Math.floor(Date.now() / 1000) + (2 * 60 * 60); // 2 horas

            const payload = {
                materia_id: materia_id,
                horario_id: horario_id,
                docente_id: docente_id,
                fecha: fechaActual,
                dia_semana: horario.dia_semana,
                hora_inicio: horario.hora_inicio,
                hora_fin: horario.hora_fin,
                exp: expiracion
            };


            console.log(process.env.JWT_SECRET);


            // Generar JWT
            const qrToken = jwt.sign(payload, process.env.JWT_SECRET);

            // Generar imagen QR
            const qrImage = await QRCode.toDataURL(qrToken, {
                width: 300,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            });

            return {
                success: true,
                data: {
                    qr_token: qrToken,
                    qr_image: qrImage,
                    expires_at: new Date(expiracion * 1000).toISOString(),
                    horario: {
                        id: horario.id,
                        dia_semana: horario.dia_semana,
                        hora_inicio: horario.hora_inicio,
                        hora_fin: horario.hora_fin
                    }
                }
            };

        } catch (error) {
            console.error('Error en NegocioMateria.generarQR:', error);
            return { success: false, error: 'ERROR_INTERNO', message: 'Error interno del sistema' };
        }
    }

    // Métodos de validación privados

    validarCoordenadas(latitud, longitud) {
        const lat = parseFloat(latitud);
        const lng = parseFloat(longitud);

        return !isNaN(lat) && !isNaN(lng) &&
            lat >= -90 && lat <= 90 &&
            lng >= -180 && lng <= 180;
    }

    validarHorario(dia_semana, hora_inicio, hora_fin) {
        const diasValidos = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];

        if (!diasValidos.includes(dia_semana)) {
            return false;
        }

        // Validar formato de hora (HH:MM)
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(hora_inicio) || !timeRegex.test(hora_fin)) {
            return false;
        }

        // Validar que hora_inicio < hora_fin
        return hora_inicio < hora_fin;
    }

    validarHorarios(horarios) {
        if (!Array.isArray(horarios) || horarios.length === 0) {
            return { valido: false, mensaje: 'Debe incluir al menos un horario' };
        }

        for (const horario of horarios) {
            if (!this.validarHorario(horario.dia_semana, horario.hora_inicio, horario.hora_fin)) {
                return { valido: false, mensaje: 'Uno o más horarios tienen formato inválido' };
            }
        }

        return { valido: true };
    }
}

module.exports = NegocioMateria;