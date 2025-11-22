import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'prisma/prisma.service';
import { DivisistService } from '../external-apis/divisist/divisist.service';
import { MoodleService } from '../external-apis/moodle/moodle.service';
import { isCareerPregrado } from '../common/constants/careers.constant';
import { LoginUserDto } from '../student/dto/login-student.dto';
import { StudentType, StudentStatus, BiometricStatus } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private divisistService: DivisistService,
    private moodleService: MoodleService,
  ) {}

  /**
   * Valida que el correo sea institucional @ufps.edu.co
   */
  private validateUfpsEmail(email: string): void {
    if (!email.endsWith('@ufps.edu.co')) {
      throw new UnauthorizedException(
        'Solo se permiten correos institucionales @ufps.edu.co',
      );
    }
  }

  /**
   * Login o registro del estudiante
   */
  async loginOrRegister(loginUserDto: LoginUserDto) {
    try {
      
      const { uid, email, name } = loginUserDto;

      // 1. Validar correo institucional
      this.validateUfpsEmail(email);

      // 2. Buscar si ya existe
      const existingStudent = await this.prisma.student.findUnique({
        where: { firebase_id: uid },
        include: { biometric_profile: true },
      });

      // 3. Si existe, retornar sin modificar
      if (existingStudent) {
        return existingStudent;
      }

      // 4. Usuario nuevo: verificar en Divisist
      const divisistData = await this.divisistService.getStudentByEmail(email);

      if (!divisistData) {
        throw new UnauthorizedException(
          'No se encontró información del estudiante en los sistemas institucionales. Por favor contacte con soporte.',
        );
      }

      // 5. Normalizar datos de Divisist
      const normalized =
        this.divisistService.normalizeStudentData(divisistData);
      const isPregrado = isCareerPregrado(normalized.career);
      const studentType = isPregrado
        ? StudentType.PREGRADO
        : StudentType.POSGRADO;

      // 6. Obtener estado correcto
      let studentStatus: StudentStatus;

      if (isPregrado) {
        // Pregrado: usar estado de Divisist
        studentStatus =
          normalized.status === 'MATRICULADO'
            ? StudentStatus.MATRICULADO
            : StudentStatus.NO_ACTIVO;
      } else {
        // Posgrado: consultar Moodle
        const moodleData = await this.moodleService.getUserByEmail(email);
        studentStatus =
          moodleData && this.moodleService.isUserActive(moodleData)
            ? StudentStatus.MATRICULADO
            : StudentStatus.NO_ACTIVO;
      }

      // 7. Crear estudiante + perfil biométrico
      const newStudent = await this.prisma.student.create({
        data: {
          firebase_id: uid,
          student_code: normalized.studentCode,
          card_photo_url: '',
          email: email,
          name: normalized.name || name || '',
          last_name: normalized.lastName,
          student_type: studentType,
          career: normalized.career,
          status: studentStatus,
          lastSyncAt: new Date(),
          biometric_profile: {
            create: {
              status: BiometricStatus.PENDIENTE,
            },
          },
        },
        include: {
          biometric_profile: true,
        },
      });

      return newStudent;
    } catch (error) {
      throw error;
    }
  }

  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
