import { EstadoEtapa } from "@/app/data/etapas_electorales"

export function formatearRangoFechas(inicio: Date, fin: Date): string {
  const diaInicio = inicio.getDate().toString().padStart(2, "0")
  const diaFin = fin.getDate().toString().padStart(2, "0")
  const mes = inicio.toLocaleDateString("es-PE", { month: "long" })
  const anio = inicio.getFullYear()
  
  if (inicio.toDateString() === fin.toDateString()) {
    const horaInicio = inicio.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit", hour12: false })
    const horaFin = fin.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit", hour12: false })
    return `${diaInicio} de ${mes}, ${anio} (${horaInicio} a ${horaFin} h)`
  }

  if (inicio.getMonth() === fin.getMonth()) {
    return `${diaInicio} al ${diaFin} de ${mes}, ${anio}`
  }

  const mesFin = fin.toLocaleDateString("es-PE", { month: "long" })
  return `${diaInicio} de ${mes} al ${diaFin} de ${mesFin}, ${anio}`
}

export function calcularEstado(inicio: Date, fin: Date, fechaReferencia: Date): EstadoEtapa {
  const tActual = fechaReferencia.getTime()
  if (tActual > fin.getTime()) return "Finalizado"
  if (tActual >= inicio.getTime() && tActual <= fin.getTime()) return "En curso"
  return "Pendiente"
}