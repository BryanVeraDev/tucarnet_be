import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { DivisistStudentData } from './divisist.interface';

@Injectable()
export class DivisistService {
  private readonly logger = new Logger(DivisistService.name);

  constructor(private httpService: HttpService) {}

  /**
   * Consulta datos de un estudiante en Divisist por email
   */
  async getStudentByEmail(email: string): Promise<DivisistStudentData | null> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${process.env.DIVISIST_API_URL}/student`, {
          params: { email },
          headers: {
            Authorization: `Bearer ${process.env.DIVISIST_API_KEY}`,
          },
          timeout: 5000, // 5 segundos timeout
        })
      );

      return response.data || null;
    } catch (error) {
      this.logger.error(`Error consultando Divisist para ${email}:`, error.message);
      return null;
    }
  }

  /**
   * Normaliza los datos de Divisist a nuestro formato
   */
  normalizeStudentData(data: DivisistStudentData) {
    return {
      studentCode: data.codigo || '',
      name: data.nombres || '',
      lastName: data.apellidos || '',
      career: data.programa || '',
      status: data.estado?.toUpperCase() === 'MATRICULADO' ? 'MATRICULADO' : 'NO_ACTIVO',
    };
  }
}