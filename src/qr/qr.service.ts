import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateQrDto } from './dto/create-qr.dto';
import { UpdateQrDto } from './dto/update-qr.dto';
import { ValidateQrDto } from './dto/validate-qr.dto';
import { StudentService } from '../student/student.service';
import { JwtService } from '@nestjs/jwt';
import * as QRCode from 'qrcode';

@Injectable()
export class QrService {
  private readonly PREFIX = 'UFPSCARNET:';

  constructor(
    private student: StudentService,
    private readonly jwtService: JwtService,
  ) {}

  async create(createQrDto: CreateQrDto) {
    try {
      const { student_code } = createQrDto;

      const token = this.jwtService.sign({ student_code });

      const qrCodeData = `${this.PREFIX}${token}`;

      // Generar QR como base64 PNG
      const qrImageBase64 = await QRCode.toDataURL(qrCodeData);

      return {
        qr: qrImageBase64,
        expiresIn: 3600,
        jwt: token,
      };
    } catch (error) {
      throw error;
    }
  }

  async validateQrToken(validateQrDto: ValidateQrDto) {
    try {

      const { token } = validateQrDto;

      const decoded = this.jwtService.verify(token);

      if(!decoded || !decoded.student_code){
        throw new UnauthorizedException('QR inválido o expirado');
      }

      const student = await this.student.getStudentByCode(decoded.student_code);

      if(!student){
        throw new UnauthorizedException('Estudiante no encontrado para el QR proporcionado');
      }

      return {
        valid: true,
        student,
      };
    } catch (err) {
      throw new UnauthorizedException('QR inválido o expirado');
    }
  }

  findAll() {
    return `This action returns all qr`;
  }

  findOne(id: number) {
    return `This action returns a #${id} qr`;
  }

  update(id: number, updateQrDto: UpdateQrDto) {
    return `This action updates a #${id} qr`;
  }

  remove(id: number) {
    return `This action removes a #${id} qr`;
  }
}
