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

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles-auth.guard';
import { Roles } from '../auth/guard/decorator/roles.decorator';
import { CurrentUser } from '../auth/guard/decorator/current-user.decorator';
import { AdminRole } from '@prisma/client';

@Controller('admin')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Inicia sesión con el email y la contraseña proporcionados.
   * @param loginUserDto Datos de inicio de sesión que incluyen email y contraseña.
   * @returns Un objeto que contiene el token JWT si las credenciales son válidas.
   */
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  /**
   * Crea un nuevo usuario administrador.
   * @param createUserDto Datos necesarios para crear un nuevo usuario administrador.
   * @returns El usuario administrador creado.
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SuperAdmin)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  /**
   * Obtiene todos los usuarios administradores ACTIVOS.
   * @returns Una lista de todos los usuarios administradores activos.
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.userService.findAll();
  }

  /**
   * Obtiene todos los usuarios administradores INACTIVOS (solo SuperAdmin).
   * @returns Una lista de todos los usuarios administradores inactivos.
   */
  @Get('inactive')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SuperAdmin)
  findInactive() {
    return this.userService.findInactive();
  }

  /**
   * Obtiene TODOS los usuarios (activos e inactivos) - Solo SuperAdmin.
   * @returns Una lista completa de todos los usuarios administradores.
   */
  @Get('all-status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SuperAdmin)
  findAllWithStatus() {
    return this.userService.findAllWithStatus();
  }

  /**
   * Obtiene un usuario administrador por su ID.
   * @param id El ID del usuario administrador a buscar.
   * @returns El usuario administrador correspondiente al ID proporcionado.
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SuperAdmin)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  /**
   * Actualiza un usuario administrador existente.
   * @param id El ID del usuario administrador a actualizar.
   * @param updateUserDto Datos para actualizar el usuario administrador.
   * @returns El usuario administrador actualizado.
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: any,
  ) {
    return this.userService.update(id, updateUserDto, user.admin_id, user.role);
  }

  /**
   * Actualiza un usuario administrador existente.
   * @param id El ID del usuario administrador a actualizar.
   * @param updateUserDto Datos para actualizar el usuario administrador.
   * @returns El usuario administrador actualizado.
   */
  @Patch(':id/password')
  updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
    @CurrentUser() user: any,
  ) {
    return this.userService.updatePassword(id, updatePasswordDto);
  }

  /**
   * Elimina un usuario administrador por su ID.
   * @param id El ID del usuario administrador a eliminar.
   * @returns Un mensaje de confirmación de la eliminación.
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SuperAdmin)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
