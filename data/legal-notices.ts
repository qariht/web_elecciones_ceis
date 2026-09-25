import type { LegalNotice } from "./types"

export const LEGAL_NOTICES: Record<string, LegalNotice> = {
  cronograma: {
    titulo: "Principio de Preclusión y Seguridad Jurídica",
    texto:
      "Ningún plazo podrá ser extendido ni retrotraído salvo resolución formal debidamente sustentada emitida por el Comité Electoral Universitario conforme al reglamento de la EPIS.",
  },
  comunicados: {
    titulo: "Efectos de Notificación y Validez Publicitaria",
    texto:
      "Toda publicación efectuada en este portal oficial surte efectos legales de notificación a la comunidad universitaria y personeros de lista a partir de la fecha y hora de su fijación digital, conforme al Reglamento General de Elecciones.",
  },
  kitElectoral: {
    titulo: "Validez Reglamentaria de la Documentación",
    texto:
      "Los formatos no deben ser alterados en su estructura básica. Cualquier tachadura, omisión de firmas o presentación en modelos desactualizados será causal de observación formal e inadmisibilidad de la lista postulante.",
  },
}
