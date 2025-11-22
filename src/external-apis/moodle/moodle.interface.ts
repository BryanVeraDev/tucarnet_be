/**
 * Interface para los datos que retorna la API de Moodle
 */
export interface MoodleUserData {
  id?: number;
  username?: string;
  fullname?: string;
  email?: string;
  suspended?: boolean;
  confirmed?: boolean;
}