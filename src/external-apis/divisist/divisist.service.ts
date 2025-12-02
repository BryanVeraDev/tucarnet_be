import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { DivisistStudentData } from './divisist.interface';
import { NormalizedStudent, NormalizedStudentResult } from './normalized_student_result';

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
        this.httpService.get(`${process.env.DIVISIST_API_URL}/student/email`, {
          params: { email },
          headers: {
            Authorization: `Bearer ${process.env.DIVISIST_API_KEY}`,
          },
          timeout: 5000,
        }),
      );

      return response.data || null;
    } catch (error) {
      this.logger.error(
        `Error consultando Divisist para ${email}:`,
        error.message,
      );
      return null;
    }
  }

  /**
   * Normaliza los datos de Divisist a el formato que necesita la aplicación
   */
  normalizeStudentData(data: DivisistStudentData): NormalizedStudentResult {
    const fullName = (data.nombre || '').trim();

    // Separar por espacios múltiples
    const parts = fullName.split(/\s+/);

    if (parts.length < 3) {
      // Validar que haya al menos un nombre y dos apellidos
      return {
        error:
          'El nombre completo debe incluir al menos un nombre y dos apellidos.',
      };
    }

    // Palabras que típicamente forman parte de un apellido compuesto
    const particles = ['de', 'del', 'la', 'las', 'los', 'san', 'santa'];

    // Función para extraer apellido desde el final
    function extractLastNameTokens(tokens: string[]) {
      const lastNameTokens: string[] = [];
      let i = tokens.length - 1;

      // Siempre tomamos al menos la última palabra
      lastNameTokens.unshift(tokens[i]);
      i--;

      // Mientras haya partículas o palabras clave, seguirlas anexando
      while (i >= 0 && particles.includes(tokens[i].toLowerCase())) {
        lastNameTokens.unshift(tokens[i]);
        i--;
      }

      return {
        lastNameTokens: lastNameTokens as string[],
        remainingTokens: tokens.slice(0, tokens.length - lastNameTokens.length),
      };
    }

    // Extraer apellido materno desde el final
    const firstExtraction = extractLastNameTokens(parts);
    const lastName2 = firstExtraction.lastNameTokens.join(' ');

    // Extraer apellido paterno (está antes del materno)
    const secondExtraction = extractLastNameTokens(
      firstExtraction.remainingTokens,
    );
    const lastName1 = secondExtraction.lastNameTokens.join(' ');

    // Lo que queda son los nombres
    const names = secondExtraction.remainingTokens.join(' ');

    // Crear objeto final normalizado
    const result: NormalizedStudent = {
      studentCode: data.codigo || '',
      name: names,
      lastName: `${lastName1} ${lastName2}`.trim(),
      email: data.email || '',
      career: data.programa || '',
      semester: data.semestre ?? null,
      status:
        data.estado?.toUpperCase() === 'ACTIVO' ? 'MATRICULADO' : 'NO_ACTIVO',
    };

    return result;
  }
}
