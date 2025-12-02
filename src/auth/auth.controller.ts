import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { FirebaseAuthGuard } from './guard/firebase-auth.guard';
import { LoginUserDto } from '../student/dto/login-student.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /auth/login
   * Inicia sesión o registra a un estudiante utilizando Firebase Authentication.
   * @param loginUserDto DTO que contiene el email del estudiante.
   * @return Información del estudiante si existe.
   */
  @Post('login')
  @UseGuards(FirebaseAuthGuard)
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginOrRegister(loginUserDto);
  }

  /**
   * PATCH /auth/:id
   * Actualiza la información del estudiante asociado al email proporcionado.
   * @param id ID del estudiante a actualizar.
   * @return Información actualizada del estudiante.
   */
  @Patch(':id')
  update(@Param('id') id: string) {
    return this.authService.update(+id);
  }
}
