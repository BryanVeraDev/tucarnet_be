/**
 * Interface para los datos que retorna la API de Divisist
 */
export interface DivisistStudentData {
  codigo?: string;
  nombre?: string;
  email?: string;
  programa?: string;
  semestre?: number;
  estado?: string;
}