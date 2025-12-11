import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateQrDto } from './dto/create-qr.dto';
import { ValidateQrDto } from './dto/validate-qr.dto';
import { QrTokenCache } from './interfaces/qr.interface';
import { StudentService } from '../student/student.service';
import { JwtService } from '@nestjs/jwt';
import * as QRCode from 'qrcode';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class QrService {
  private readonly PREFIX = 'UFPSCARNET:';
  private readonly TOKEN_DURATION = 3600;
  // Cache en memoria para tokens activos
  private tokenCache = new Map<string, QrTokenCache>();

  constructor(
    private student: StudentService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Genera un código QR con un token JWT mediante el student_code proporcionado.
   * @param createQrDto Objeto que contiene el student_code del estudiante.
   * @returns Un objeto con la imagen del QR en base64, el tiempo de expiración y el token JWT.
   */
  async create(createQrDto: CreateQrDto) {
    try {
      const { student_code } = createQrDto;

      // 1. Verificar si existe un token válido en cache
      const cachedToken = this.tokenCache.get(student_code);

      if (cachedToken && cachedToken.expiresAt > new Date()) {
        // Token aún válido, retornar el existente
        const qrImageBase64 = await QRCode.toDataURL(
          `${this.PREFIX}${cachedToken.token}`,
        );

        const remainingTime = Math.floor(
          (cachedToken.expiresAt.getTime() - Date.now()) / 1000,
        );

        return {
          qr: qrImageBase64,
          expiresIn: remainingTime,
          jwt: cachedToken.token,
          isNew: false,
        };
      }

      // 2. Token expirado o no existe, crear uno nuevo
      const expiresAt = new Date(Date.now() + this.TOKEN_DURATION * 1000);

      const token = this.jwtService.sign({ student_code });

      // 3. Guardar en cache
      this.tokenCache.set(student_code, {
        token,
        expiresAt,
        studentCode: student_code,
      });

      // 5. Generar QR
      const qrCodeData = `${this.PREFIX}${token}`;

      // Generar QR como base64 PNG
      const qrImageBase64 = await QRCode.toDataURL(qrCodeData);

      return {
        qr: qrImageBase64,
        expiresIn: 3600,
        jwt: token,
        isNew: true,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Valida un código QR mediante un token jwt proporcionado.
   * @param validateQrDto Objeto que contiene el token JWT del QR.
   * @returns Un objeto que indica si el QR es válido y la información del estudiante asociado.
   */
  async validateQrToken(validateQrDto: ValidateQrDto) {
    try {
      const { token } = validateQrDto;

      // 1. Verificar y decodificar JWT
      const decoded = this.jwtService.verify(token);

      if (!decoded || !decoded.student_code) {
        throw new UnauthorizedException('QR inválido o expirado');
      }

      // 2. Verificar que coincida con el token en cache/BD
      const cachedToken = this.tokenCache.get(decoded.student_code);

      if (!cachedToken || cachedToken.token !== token) {
        throw new UnauthorizedException('QR inválido o expirado');
      }

      // 3. Obtener datos del estudiante
      const student = await this.student.getStudentByCode(decoded.student_code);
      
      // 4. Validar que el estudiante esté exista y activo
      if (!student) {
        throw new UnauthorizedException(
          'Estudiante no encontrado para el QR proporcionado',
        );
      }

      if (student.status !== 'MATRICULADO') {
        throw new UnauthorizedException('Estudiante no matriculado');
      }

      return {
        valid: true,
        student,
      };
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException('QR expirado, genera uno nuevo');
      }
      throw err;
    }
  }

  /**
   * Limpia tokens expirados del cache
   * @Cron que se ejecuta cada 10 minutos
   */
  @Cron(CronExpression.EVERY_10_MINUTES)
  cleanExpiredTokens() {
    const now = new Date();
    for (const [studentCode, tokenData] of this.tokenCache.entries()) {
      if (tokenData.expiresAt < now) {
        this.tokenCache.delete(studentCode);
      }
    }
  }
}
