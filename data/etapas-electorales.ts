import type { EtapaElectoral } from "./types"

export const ETAPAS_ELECTORALES: EtapaElectoral[] = [
  {
    id: 1,
    fase: "Fase 01",
    titulo: "Convocatoria y publicación de bases",
    fechaInicio: new Date("2026-05-01T08:00:00"),
    fechaFin: new Date("2026-05-05T23:59:59"),
    detalle:
      "Publicación oficial del reglamento y puesta a disposición del Kit Electoral para personeros de listas estudiantiles.",
    obligatorio: true,
  },
  {
    id: 2,
    fase: "Fase 02",
    titulo: "Inscripción de listas y presentación de expedientes",
    fechaInicio: new Date("2026-05-06T08:00:00"),
    fechaFin: new Date("2026-05-12T18:00:00"),
    detalle:
      "Recepción del plan de trabajo, actas de adhesión y declaraciones juradas vía plataforma oficial del Comité.",
    nota: "Cierre improrrogable a las 18:00 h.",
    obligatorio: true,
  },
  {
    id: 3,
    fase: "Fase 03",
    titulo: "Publicación de listas admitidas y periodo de tachas",
    fechaInicio: new Date("2026-05-13T08:00:00"),
    fechaFin: new Date("2026-05-15T18:00:00"),
    detalle:
      "Revisión de expedientes, publicación de listas provisionales y recepción de observaciones debidamente fundamentadas.",
  },
  {
    id: 4,
    fase: "Fase 04",
    titulo: "Resolución de tachas y publicación definitiva",
    fechaInicio: new Date("2026-05-16T08:00:00"),
    fechaFin: new Date("2026-05-17T20:00:00"),
    detalle:
      "Pronunciamiento oficial del Comité Electoral sobre la validez y aptitud definitiva de las candidaturas participantes.",
  },
  {
    id: 5,
    fase: "Fase 05",
    titulo: "Debate electoral y cierre de campaña",
    fechaInicio: new Date("2026-05-18T16:00:00"),
    fechaFin: new Date("2026-05-18T20:00:00"),
    detalle:
      "Exposición de propuestas ante la comunidad estudiantil de la EPIS. Cese obligatorio de toda propaganda al culminar la jornada.",
  },
  {
    id: 6,
    fase: "Fase 06",
    titulo: "Jornada electoral, escrutinio y proclamación",
    fechaInicio: new Date("2026-05-20T08:00:00"),
    fechaFin: new Date("2026-05-20T16:00:00"),
    detalle:
      "Sufragio presencial en urnas, conteo público de votos con personeros y publicación de los resultados preliminares oficiales.",
    obligatorio: true,
  },
]
