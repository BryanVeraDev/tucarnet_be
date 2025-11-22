/**
 * Lista de carreras de PREGRADO de la UFPS
 * Mantener actualizada según el catálogo oficial
 */
export const PREGRADO_CAREERS = [
  // Facultad de Ingeniería
  "INGENIERÍA MECÁNICA",
  "INGENIERÍA CIVIL",
  "INGENIERÍA ELECTROMECÁNICA",
  "INGENIERÍA DE SISTEMAS",
  "INGENIERÍA ELECTRÓNICA",
  "INGENIERÍA INDUSTRIAL",
  "INGENIERÍA DE MINAS",
  "TEC. EN OBRAS CIVILES",
  "TEC. EN PROCESOS INDUSTRIALES",
  "TEC. EN ANALÍTICA DE DATOS",

  // Facultad de Ciencias Agrarias y del Ambiente
  "INGENIERÍA BIOTECNOLÓGICA",
  "INGENIERÍA AMBIENTAL",
  "INGENIERÍA AGRONÓMICA",
  "INGENIERÍA AGROINDUSTRIAL",
  "ZOOTECNIA",

  // Facultad de Ciencias Básicas
  "QUÍMICA INDUSTRIAL",

  // Facultad de Ciencias Empresariales
  "ADMINISTRACIÓN DE EMPRESAS",
  "CONTADURÍA PÚBLICA",
  "COMERCIO INTERNACIONAL",

  // Facultad de Educación, Artes y Humanidades
  "LICENCIATURA EN MATEMÁTICAS",
  "COMUNICACIÓN SOCIAL",
  "ARQUITECTURA",
  "DERECHO",
  "TRABAJO SOCIAL",
  "LICENCIATURA EN EDUCACIÓN INFANTIL",
  "LICENCIATURA EN CIENCIAS NATURALES Y EDUCACIÓN AMBIENTAL",

  // Facultad de Ciencias de la Salud
  "ENFERMERÍA",
  "SEGURIDAD Y SALUD EN EL TRABAJO",

  // Modalidad a Distancia
  "LICENCIATURA EN EDUCACIÓN COMUNITARIA",
  "TECNOLOGÍA EN CONSTRUCCIONES CIVILES",
  "TECNOLOGÍA EN REGENCIA DE FARMACIA"
];

/**
 * Verifica si una carrera pertenece a pregrado
 */
export function isCareerPregrado(career: string): boolean {
  const normalizedCareer = career.toUpperCase().trim();
  return PREGRADO_CAREERS.some(
    pregradoCareer => normalizedCareer.includes(pregradoCareer)
  );
}

/**
 * Lista de carreras de POSGRADO (Especializaciones, Maestrías, Doctorados) de la UFPS
 * Mantener actualizada según el catálogo oficial
 */
export const POSGRADO_CAREERS = [
  // Doctorados
  "DOCTORADO EN EDUCACIÓN",

  // Maestrías
  "MAESTRÍA EN GERENCIA DE EMPRESAS",
  "MAESTRÍA EN ESTUDIOS SOCIALES Y EDUCACIÓN PARA LA PAZ",
  "MAESTRÍA EN INGENIERÍA DE RECURSOS HIDRÁULICOS",
  "MAESTRÍA EN TECNOLOGÍAS DE LA INFORMACIÓN Y LA COMUNICACIÓN APLICADAS A LA EDUCACIÓN",
  "MAESTRÍA EN EDUCACIÓN MATEMÁTICA",
  "MAESTRÍA EN PRÁCTICA PEDAGÓGICA",
  "MAESTRÍA EN CIENCIAS BIOLÓGICAS",
  "MAESTRÍA EN NEGOCIOS INTERNACIONALES",
  "MAESTRÍA EN DERECHO PÚBLICO: GOBIERNO, JUSTICIA Y DERECHOS HUMANOS",

  // Especializaciones
  "ESPECIALIZACIÓN EN PRÁCTICA PEDAGÓGICA",
  "ESPECIALIZACIÓN EN ESTRUCTURAS",
  "ESPECIALIZACIÓN EN LOGÍSTICA Y NEGOCIOS INTERNACIONALES",
  "ESPECIALIZACIÓN EN EDUCACIÓN, EMPRENDIMIENTO Y ECONOMÍA SOLIDARIA",
  "ESPECIALIZACIÓN EN EDUCACIÓN PARA LA ATENCIÓN A POBLACIÓN AFECTADA POR EL CONFLICTO ARMADO Y EN PROBLEMÁTICA FRONTERIZA",
  "ESPECIALIZACIÓN EN EDUCACIÓN MEDIADA POR LAS TIC"
];

/**
 * Verifica si una carrera pertenece a posgrado
 */
export function isCareerPosgrado(career: string): boolean {
  const normalizedCareer = career.toUpperCase().trim();
  return POSGRADO_CAREERS.some(
    posgradoCareer => normalizedCareer.includes(posgradoCareer)
  );
}