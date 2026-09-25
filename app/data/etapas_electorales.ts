export type EstadoEtapa = "Finalizado" | "En curso" | "Pendiente"

export interface EtapaElectoral {
  id: number
  fase: string
  titulo: string
  fechaInicio: Date
  fechaFin: Date
  detalle: string
  lugar: string
  obligatorio?: boolean
  nota?: string
}

const PORTAL = "Portal web del Comité Electoral"
const PORTAL_Y_WHATSAPP = "Portal web del Comité Electoral y grupos de WhatsApp"
const DIFUSION_GENERAL = "Redes de la escuela, grupos de WhatsApp y portal web del Comité Electoral"

export const ETAPAS_ELECTORALES: EtapaElectoral[] = [
  { id: 1, fase: "Etapa I", titulo: "Convocatoria a las elecciones CEIS 2027", fechaInicio: new Date("2026-09-22T00:00:00"), fechaFin: new Date("2026-09-22T23:59:59"), detalle: "Convocatoria oficial al proceso electoral.", lugar: DIFUSION_GENERAL },
  { id: 2, fase: "Etapa I", titulo: "Entrega del kit electoral", fechaInicio: new Date("2026-09-22T00:00:00"), fechaFin: new Date("2026-09-22T23:59:59"), detalle: "Puesta a disposición del kit electoral para las listas participantes.", lugar: PORTAL },
  { id: 3, fase: "Etapa II", titulo: "Inscripción de listas", fechaInicio: new Date("2026-09-23T00:00:00"), fechaFin: new Date("2026-10-16T23:59:59"), detalle: "Registro ordinario de listas postulantes.", lugar: PORTAL, obligatorio: true },
  { id: 4, fase: "Etapa II", titulo: "Inscripción extemporánea", fechaInicio: new Date("2026-10-17T00:00:00"), fechaFin: new Date("2026-10-21T23:59:59"), detalle: "Periodo de inscripción extemporánea de listas.", lugar: PORTAL },
  { id: 5, fase: "Etapa III", titulo: "Publicación de listas preliminares", fechaInicio: new Date("2026-10-26T00:00:00"), fechaFin: new Date("2026-10-26T23:59:59"), detalle: "Difusión de la relación preliminar de listas inscritas.", lugar: DIFUSION_GENERAL },
  { id: 6, fase: "Etapa III", titulo: "Presentación de impugnaciones y tachas", fechaInicio: new Date("2026-10-27T00:00:00"), fechaFin: new Date("2026-10-30T23:59:59"), detalle: "Recepción de impugnaciones y tachas conforme a las bases.", lugar: PORTAL_Y_WHATSAPP },
  { id: 7, fase: "Etapa III", titulo: "Subsanación y absolución de observaciones, tachas e impugnaciones", fechaInicio: new Date("2026-10-31T00:00:00"), fechaFin: new Date("2026-11-03T23:59:59"), detalle: "Atención de observaciones, tachas e impugnaciones presentadas.", lugar: PORTAL_Y_WHATSAPP },
  { id: 8, fase: "Etapa III", titulo: "Publicación de listas aptas", fechaInicio: new Date("2026-11-06T00:00:00"), fechaFin: new Date("2026-11-06T23:59:59"), detalle: "Publicación de las listas que cumplen los requisitos para continuar en el proceso.", lugar: "Portal web, redes de la escuela y grupos de WhatsApp" },
  { id: 9, fase: "Campaña", titulo: "Campaña electoral", fechaInicio: new Date("2026-11-07T00:00:00"), fechaFin: new Date("2026-12-03T23:59:59"), detalle: "Periodo autorizado para la difusión de propuestas de las listas aptas.", lugar: "No aplica" },
  { id: 10, fase: "Etapa IV", titulo: "Sorteo de miembros de mesa", fechaInicio: new Date("2026-11-15T00:00:00"), fechaFin: new Date("2026-11-15T23:59:59"), detalle: "Sorteo de miembros de mesa para la jornada electoral.", lugar: PORTAL_Y_WHATSAPP },
  { id: 11, fase: "Etapa IV", titulo: "Primer debate entre listas", fechaInicio: new Date("2026-11-20T00:00:00"), fechaFin: new Date("2026-11-20T23:59:59"), detalle: "Primer espacio de debate entre las listas participantes.", lugar: "Por definirse", nota: "Lugar pendiente de definición." },
  { id: 12, fase: "Etapa IV", titulo: "Publicación del padrón electoral", fechaInicio: new Date("2026-11-22T00:00:00"), fechaFin: new Date("2026-11-22T23:59:59"), detalle: "Publicación del padrón electoral.", lugar: PORTAL_Y_WHATSAPP },
  { id: 13, fase: "Etapa IV", titulo: "Segundo debate entre listas", fechaInicio: new Date("2026-11-27T00:00:00"), fechaFin: new Date("2026-11-27T23:59:59"), detalle: "Segundo espacio de debate entre las listas participantes.", lugar: "Por definirse", nota: "Lugar pendiente de definición." },
  { id: 14, fase: "Etapa IV", titulo: "Recepción de justificaciones sustentadas en el Anexo I de las bases", fechaInicio: new Date("2026-11-29T00:00:00"), fechaFin: new Date("2026-12-02T23:59:59"), detalle: "Recepción de justificaciones sustentadas conforme al Anexo I de las bases.", lugar: "Correo: ceiscomiteelectoral01@gmail.com" },
  { id: 15, fase: "Etapa V", titulo: "Acto de sufragio", fechaInicio: new Date("2026-12-04T09:30:00"), fechaFin: new Date("2026-12-04T15:00:00"), detalle: "Jornada de votación para la elección del CEIS.", lugar: "Pabellón H (aulas por definirse)", obligatorio: true },
  { id: 16, fase: "Etapa V", titulo: "Publicación y proclamación de resultados", fechaInicio: new Date("2026-12-04T00:00:00"), fechaFin: new Date("2026-12-04T23:59:59"), detalle: "Publicación y proclamación de los resultados del proceso electoral.", lugar: PORTAL_Y_WHATSAPP },
  { id: 17, fase: "Etapa V", titulo: "Publicación de lista de estudiantes justificados", fechaInicio: new Date("2026-12-13T00:00:00"), fechaFin: new Date("2026-12-13T23:59:59"), detalle: "Publicación de la relación de estudiantes con justificación aceptada.", lugar: PORTAL_Y_WHATSAPP },
  { id: 18, fase: "Etapa VI", titulo: "Acreditación y proclamación del nuevo CEIS", fechaInicio: new Date("2026-12-14T00:00:00"), fechaFin: new Date("2026-12-14T23:59:59"), detalle: "Acreditación y proclamación del nuevo CEIS.", lugar: "Por definirse", nota: "Fecha y lugar pendientes de definición." },
]
