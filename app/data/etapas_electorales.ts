export type EstadoEtapa = "Finalizado" | "En curso" | "Pendiente"

export interface EtapaElectoral {
  id: number
  fase: string
  titulo: string
  fechaInicio?: Date
  fechaFin?: Date
  fechaTexto: string
  detalle: string
  lugar: string
  obligatorio?: boolean
  nota?: string
}

const inicio = (dia: string) => new Date(`${dia}T00:00:00-05:00`)
const fin = (dia: string) => new Date(`${dia}T23:59:59-05:00`)

const PORTAL = "Portal web del Comité Electoral"
const PORTAL_Y_WHATSAPP = "Portal web del Comité Electoral y grupos de WhatsApp"
const DIFUSION_GENERAL = "Redes de la escuela, grupos de WhatsApp y portal web del Comité Electoral"

export const ETAPAS_ELECTORALES: EtapaElectoral[] = [
  { id: 1, fase: "Etapa I", titulo: "Convocatoria a las elecciones CEIS 2027", fechaInicio: inicio("2026-09-22"), fechaFin: fin("2026-09-22"), fechaTexto: "Martes 22 de setiembre", detalle: "Convocatoria oficial al proceso electoral.", lugar: DIFUSION_GENERAL },
  { id: 2, fase: "Etapa I", titulo: "Entrega del kit electoral", fechaInicio: inicio("2026-09-22"), fechaFin: fin("2026-09-22"), fechaTexto: "Martes 22 de setiembre", detalle: "Puesta a disposición del kit electoral para las listas participantes.", lugar: PORTAL },
  { id: 3, fase: "Etapa II", titulo: "Inscripción de listas", fechaInicio: inicio("2026-09-23"), fechaFin: fin("2026-10-16"), fechaTexto: "Del miércoles 23 de setiembre al viernes 16 de octubre", detalle: "Registro ordinario de listas postulantes.", lugar: PORTAL, obligatorio: true },
  { id: 4, fase: "Etapa II", titulo: "Inscripción extemporánea", fechaInicio: inicio("2026-10-17"), fechaFin: fin("2026-10-21"), fechaTexto: "Del sábado 17 al miércoles 21 de octubre", detalle: "Periodo de inscripción extemporánea de listas.", lugar: PORTAL },
  { id: 5, fase: "Etapa III", titulo: "Publicación de listas preliminares", fechaInicio: inicio("2026-10-26"), fechaFin: fin("2026-10-26"), fechaTexto: "Lunes 26 de octubre", detalle: "Difusión de la relación preliminar de listas inscritas.", lugar: DIFUSION_GENERAL },
  { id: 6, fase: "Etapa III", titulo: "Presentación de impugnaciones y tachas", fechaInicio: inicio("2026-10-27"), fechaFin: fin("2026-10-28"), fechaTexto: "Martes 27 y miércoles 28 de octubre", detalle: "Recepción de impugnaciones y tachas conforme a las bases.", lugar: PORTAL_Y_WHATSAPP },
  { id: 7, fase: "Etapa III", titulo: "Subsanación y absolución de observaciones, tachas e impugnaciones", fechaInicio: inicio("2026-10-29"), fechaFin: fin("2026-10-29"), fechaTexto: "Jueves 29 de octubre", detalle: "Atención de observaciones, tachas e impugnaciones presentadas.", lugar: PORTAL_Y_WHATSAPP },
  { id: 8, fase: "Etapa III", titulo: "Publicación de listas aptas", fechaInicio: inicio("2026-10-30"), fechaFin: fin("2026-10-30"), fechaTexto: "Viernes 30 de octubre", detalle: "Publicación de las listas que cumplen los requisitos para continuar en el proceso.", lugar: "Portal web, redes de la escuela y grupos de WhatsApp" },
  { id: 9, fase: "Campaña", titulo: "Campaña electoral", fechaInicio: inicio("2026-10-31"), fechaTexto: "Desde el sábado 31 de octubre hasta un día antes del acto de sufragio", detalle: "Periodo autorizado para la difusión de propuestas de las listas aptas.", lugar: "-" },
  { id: 10, fase: "Etapa IV", titulo: "Sorteo de miembros de mesa", fechaInicio: inicio("2026-11-15"), fechaFin: fin("2026-11-15"), fechaTexto: "Domingo 15 de noviembre", detalle: "Sorteo de miembros de mesa para la jornada electoral.", lugar: PORTAL_Y_WHATSAPP },
  { id: 11, fase: "Etapa IV", titulo: "Primer debate entre listas", fechaInicio: inicio("2026-11-20"), fechaFin: fin("2026-11-20"), fechaTexto: "Viernes 20 de noviembre", detalle: "Primer espacio de debate entre las listas participantes.", lugar: "Por definirse" },
  { id: 12, fase: "Etapa IV", titulo: "Publicación del padrón electoral", fechaInicio: inicio("2026-11-22"), fechaFin: fin("2026-11-22"), fechaTexto: "Domingo 22 de noviembre", detalle: "Publicación del padrón electoral.", lugar: PORTAL_Y_WHATSAPP },
  { id: 13, fase: "Etapa IV", titulo: "Segundo debate entre listas", fechaInicio: inicio("2026-11-27"), fechaFin: fin("2026-11-27"), fechaTexto: "Viernes 27 de noviembre", detalle: "Segundo espacio de debate entre las listas participantes.", lugar: "Por definirse" },
  { id: 14, fase: "Etapa IV", titulo: "Recepción de justificaciones sustentadas en el Anexo I de las bases", fechaInicio: inicio("2026-11-29"), fechaFin: fin("2026-12-02"), fechaTexto: "Del domingo 29 de noviembre al miércoles 2 de diciembre", detalle: "Recepción de justificaciones sustentadas conforme al Anexo I de las bases.", lugar: "Correo: ceiscomiteelectoral01@gmail.com" },
  { id: 15, fase: "Etapa V", titulo: "Acto de sufragio", fechaTexto: "Fecha por confirmar", detalle: "Jornada de votación para la elección del CEIS.", lugar: "Lugar y horario por confirmar", obligatorio: true, nota: "La fecha será reevaluada y comunicada oportunamente." },
  { id: 16, fase: "Etapa V", titulo: "Publicación y proclamación de resultados", fechaTexto: "Fecha por confirmar", detalle: "Publicación y proclamación de los resultados del proceso electoral.", lugar: PORTAL_Y_WHATSAPP },
  { id: 17, fase: "Etapa V", titulo: "Publicación de lista de estudiantes justificados", fechaTexto: "Fecha por confirmar", detalle: "Publicación de la relación de estudiantes con justificación aceptada.", lugar: PORTAL_Y_WHATSAPP },
  { id: 18, fase: "Etapa VI", titulo: "Acreditación y proclamación del nuevo CEIS", fechaTexto: "Por definirse", detalle: "Acreditación y proclamación del nuevo CEIS.", lugar: "Por definirse" },
]
