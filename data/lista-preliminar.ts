export interface IntegrantePreliminar {
  cargo: string
  nombre: string
}

export interface ListaPreliminar {
  nombre: string
  logo: string
  integrantes: IntegrantePreliminar[]
}

export const LISTA_PRELIMINAR: ListaPreliminar = {
  nombre: "Avanza Sistemas PRO",
  logo: "/imagenes/logo-lista-1-avanza-sistemas-pro.jpeg",
  integrantes: [
    { nombre: "CARPIO LEON, JHOR MARINIO", cargo: "Presidente" },
    { nombre: "RUIZ RIVEROS, ROY JHONY", cargo: "Vicepresidente" },
    { nombre: "RAMOS ARRUNATEGUI, PETER STEVEN", cargo: "Secretario(a) de Organización" },
    { nombre: "GUTIERREZ AVALOS, DENIS", cargo: "Secretario(a) de Actas y Archivos" },
    { nombre: "BAUTISTA AYALA, OSCAR ABEL", cargo: "Coordinador(a) de Tecnología y Desarrollo" },
    { nombre: "CALDERON GALINDO, ANTONY BRAYAN", cargo: "Coordinador(a) Académico(a)" },
    { nombre: "FIGUEROA ARCE, LUIS MIGUEL", cargo: "Coordinador(a) de Economía" },
    { nombre: "CHUCHON TUCNO, ISMAEL ISAAC", cargo: "Coordinador(a) de Prensa y Propaganda" },
    { nombre: "DE LA CRUZ ALARCON, YOVICK LEONARDO", cargo: "Coordinador(a) de Relaciones Públicas" },
    { nombre: "AVILA CONTRERAS, NELSSON", cargo: "Coordinador(a) de Deportes 1" },
    { nombre: "HINOSTROZA GARAMENDI, JOSUE MICHAEL", cargo: "Coordinador(a) de Deportes 2" },
    { nombre: "UCHARIMA QUISPE, ANY ANDREA", cargo: "Coordinador(a) de Eventos Culturales" },
    { nombre: "HINOSTROZA BERROCAL, HANS JORDAN", cargo: "Vocal 1" },
    { nombre: "CORDERO GARCIA SAMIR BRYAN", cargo: "Vocal 2" },
    { nombre: "MAMANI ESCALANTE CHRIS JOSEPH", cargo: "Vocal 3" },
    { nombre: "ORTIZ CCONOCC PAULING ANTONNY", cargo: "Vocal 4" },
  ],
}
