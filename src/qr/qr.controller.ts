import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { QrService } from './qr.service';
import { CreateQrDto } from './dto/create-qr.dto';
import { ValidateQrDto } from './dto/validate-qr.dto';

@Controller('qr')
export class QrController {
  constructor(private readonly qrService: QrService) {}

  /**
   * POST /qr/generate
   * Genera un código QR con un token JWT mediante el student_code proporcionado.
   * @param createQrDto Objeto que contiene el student_code del estudiante.
   * @returns Un objeto con la imagen del QR en base64, el tiempo de expiración y el token JWT.
   */
  @Post('generate')
  create(@Body() createQrDto: CreateQrDto) {
    return this.qrService.create(createQrDto);
  }

  /**
   * POST /qr/validate
   * Valida un código QR mediante un token jwt proporcionado.
   * @param validateQrDto Objeto que contiene el token JWT del QR.
   * @returns Un objeto que indica si el QR es válido y la información del estudiante asociado.
   */
  @Post('validate')
  validateQr(@Body() validateQrDto: ValidateQrDto) {
    return this.qrService.validateQrToken(validateQrDto);
  }
}
