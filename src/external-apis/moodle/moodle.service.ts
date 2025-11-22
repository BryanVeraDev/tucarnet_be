import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { MoodleUserData } from './moodle.interface';

@Injectable()
export class MoodleService {
  private readonly logger = new Logger(MoodleService.name);

  constructor(private httpService: HttpService) {}

  /**
   * Consulta datos de un usuario en Moodle por email
   * Solo se usa para estudiantes de POSGRADO
   */
  async getUserByEmail(email: string): Promise<MoodleUserData | null> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${process.env.MOODLE_API_URL}/webservice/rest/server.php`, {
          params: {
            wstoken: process.env.MOODLE_API_TOKEN,
            wsfunction: 'core_user_get_users_by_field',
            moodlewsrestformat: 'json',
            field: 'email',
            'values[0]': email,
          },
          timeout: 5000,
        })
      );

      return response.data && response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      this.logger.error(`Error consultando Moodle para ${email}:`, error.message);
      return null;
    }
  }

  /**
   * Determina si un usuario de Moodle está activo
   */
  isUserActive(userData: MoodleUserData): boolean {
    return !userData.suspended && userData.confirmed===true;
  }
}