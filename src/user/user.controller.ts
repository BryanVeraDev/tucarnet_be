import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

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
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  /**
   * Obtiene todos los usuarios administradores.
   * @returns Una lista de todos los usuarios administradores.
   */
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  /**
   * Obtiene un usuario administrador por su ID.
   * @param id El ID del usuario administrador a buscar.
   * @returns El usuario administrador correspondiente al ID proporcionado.
   */
  @Get(':id')
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
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  /**
   * Elimina un usuario administrador por su ID.
   * @param id El ID del usuario administrador a eliminar.
   * @returns Un mensaje de confirmación de la eliminación.
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
