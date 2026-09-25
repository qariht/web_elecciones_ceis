import type { DocumentoKit, KitDestacado } from "./types"

export const KIT_DESTACADO: KitDestacado = {
  version: "2027.1",
  actualizacion: "Setiembre 2026",
  tamano: "1.3 MB",
  archivo: "/docs/kit-electoral-elecciones-ceis-2027.zip",
}

export const DOCUMENTOS_KIT: DocumentoKit[] = [
  {
    codigo: "BASES",
    tipo: "PDF",
    titulo: "Bases para las Elecciones CEIS 2027–2028",
    descripcion:
      "Bases oficiales que regulan la inscripción de listas, campaña, sufragio y resultados del proceso electoral.",
    archivo: "/docs/bases-elecciones-ceis-2027.pdf",
    tamano: "101 KB",
    obligatorio: true,
  },
  {
    codigo: "CRONO",
    tipo: "PDF",
    titulo: "Cronograma Oficial de Elecciones CEIS 2027",
    descripcion: "Fechas y actividades oficiales del proceso electoral.",
    archivo: "/docs/cronograma-elecciones-ceis-2027.pdf",
    tamano: "604 KB",
    obligatorio: true,
  },
  {
    codigo: "F-01",
    tipo: "DOCX",
    titulo: "Formato de Inscripción de Candidatos",
    descripcion:
      "Formato editable para registrar a los integrantes y cargos de la lista postulante.",
    archivo: "/docs/formato-inscripcion-elecciones-ceis-2027.docx",
    tamano: "91 KB",
    obligatorio: true,
  },
  {
    codigo: "F-02",
    tipo: "DOCX",
    titulo: "Carta de Compromiso",
    descripcion:
      "Formato individual de compromiso para cada integrante de la lista.",
    archivo: "/docs/carta-compromiso-ceis-2027.docx",
    tamano: "415 KB",
    obligatorio: true,
  },
  {
    codigo: "CONTACTO",
    tipo: "PDF",
    titulo: "Directorio de Contacto Electoral",
    descripcion:
      "Canales de contacto oficiales para consultas sobre el proceso electoral.",
    archivo: "/docs/directorio-contacto-elecciones-ceis-2027.pdf",
    tamano: "87 KB",
  },
]
