import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';

import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

import { AdminRole, AdminStatus } from '@prisma/client';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  // Número de rondas para hashear la contraseña
  private readonly SALT_ROUNDS = 10;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Crea un nuevo usuario administrador.
   * @param createUserDto Datos necesarios para crear un nuevo usuario administrador.
   * @returns El usuario administrador creado.
   */
  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.adminUser.findFirst({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('El correo ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      this.SALT_ROUNDS,
    );

    return this.prisma.adminUser.create({
      data: {
        name: createUserDto.name,
        last_name: createUserDto.last_name,
        email: createUserDto.email,
        role: createUserDto.role,
        password: hashedPassword,
      },
      select: {
        admin_id: true,
        name: true,
        last_name: true,
        email: true,
        role: true,
        created_at: true,
      },
    });
  }

  /**
   * Obtiene todos los usuarios administradores.
   * @returns Una lista de todos los usuarios administradores.
   */
  async findAll() {
    return this.prisma.adminUser.findMany({
      where: { status: AdminStatus.ACTIVO },
      select: {
        admin_id: true,
        name: true,
        last_name: true,
        email: true,
        role: true,
        created_at: true,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  /**
   * Obtiene todos los usuarios administradores INACTIVOS (para dashboard).
   * @returns Una lista de todos los usuarios administradores inactivos.
   */
  async findInactive() {
    return this.prisma.adminUser.findMany({
      where: { status: AdminStatus.INACTIVO },
      select: {
        admin_id: true,
        name: true,
        last_name: true,
        email: true,
        role: true,
        status: true,
        created_at: true,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  /**
   * Obtiene TODOS los usuarios (activos e inactivos) - Solo SuperAdmin.
   * @returns Una lista completa de todos los usuarios administradores.
   */
  async findAllWithStatus() {
    return this.prisma.adminUser.findMany({
      select: {
        admin_id: true,
        name: true,
        last_name: true,
        email: true,
        role: true,
        status: true,
        created_at: true,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  /**
   * Obtiene un usuario administrador por su ID.
   * @param id El ID del usuario administrador a buscar.
   * @returns El usuario administrador correspondiente al ID proporcionado.
   */
  async findOne(id: string) {
    const user = await this.prisma.adminUser.findUnique({
      where: { admin_id: id },
      select: {
        admin_id: true,
        name: true,
        last_name: true,
        email: true,
        role: true,
        created_at: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Administrador no encontrado');
    }

    return user;
  }

  /**
   * Valida que el usuario actual esté ACTIVO antes de realizar operaciones.
   * @param userId ID del usuario a validar.
   * @throws UnauthorizedException si el usuario está inactivo.
   */
  private async validateActiveUser(userId: string): Promise<void> {
    // Obtener el usuario
    const user = await this.prisma.adminUser.findUnique({
      where: { admin_id: userId },
      select: { status: true },
    });

    // Validar estado
    if (!user || user.status === AdminStatus.INACTIVO) {
      throw new UnauthorizedException(
        'Tu cuenta está inactiva. Contacta al administrador.',
      );
    }
  }

  /**
   * Actualiza un usuario administrador existente.
   * @param id El ID del usuario administrador a actualizar.
   * @param updateUserDto Datos para actualizar el usuario administrador.
   * @param currentUserId ID del usuario que realiza la acción.
   * @param currentUserRole Rol del usuario que realiza la acción.
   * @returns El usuario administrador actualizado.
   */
  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    currentUserId: string,
    currentUserRole: AdminRole,
  ) {
    // Validar que el usuario actual esté activo
    await this.validateActiveUser(currentUserId);

    // Obtener el usuario objetivo
    const targetUser = await this.findOne(id);

    // No puedes modificar tu propio rol
    if (id === currentUserId && updateUserDto.role) {
      throw new ForbiddenException('No puedes modificar tu propio rol');
    }

    // Solo SuperAdmin puede cambiar roles
    if (updateUserDto.role && currentUserRole !== AdminRole.SuperAdmin) {
      throw new ForbiddenException('Solo SuperAdmin puede modificar roles');
    }

    // No puedes desactivarte a ti mismo
    if (id === currentUserId && updateUserDto.status === AdminStatus.INACTIVO) {
      throw new ForbiddenException('No puedes desactivarte a ti mismo');
    }

    // Solo SuperAdmin puede cambiar estados
    if (updateUserDto.status && currentUserRole !== AdminRole.SuperAdmin) {
      throw new ForbiddenException(
        'Solo SuperAdmin puede cambiar el estado de usuarios',
      );
    }

    // Un SuperAdmin no puede quitarse su propio rol de SuperAdmin
    if (
      id === currentUserId &&
      targetUser.role === AdminRole.SuperAdmin &&
      updateUserDto.role &&
      updateUserDto.role !== AdminRole.SuperAdmin
    ) {
      throw new ForbiddenException(
        'No puedes quitarte tu propio rol de SuperAdmin',
      );
    }

    // Actualizar datos
    return this.prisma.adminUser.update({
      where: { admin_id: id },
      data: updateUserDto,
      select: {
        admin_id: true,
        name: true,
        last_name: true,
        email: true,
        role: true,
        status: true,
        created_at: true,
      },
    });
  }

  /**
   * Actualiza la contraseña de un usuario administrador existente.
   * @param id El ID del usuario administrador a actualizar.
   * @param updatePasswordDto Datos para actualizar la contraseña del usuario administrador.
   * @returns El usuario administrador actualizado.
   */
  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    // Verificar que el usuario exista
    await this.findOne(id);

    // Preparar los datos para la actualización
    const data: any = { ...updatePasswordDto };

    // Hashear la nueva contraseña si se proporciona
    if (updatePasswordDto.newPassword) {
      data.password = await bcrypt.hash(
        updatePasswordDto.newPassword,
        this.SALT_ROUNDS,
      );
    }

    // Actualizar la contraseña
    return this.prisma.adminUser.update({
      where: { admin_id: id },
      data,
      select: {
        admin_id: true,
        name: true,
        last_name: true,
        email: true,
        role: true,
        created_at: true,
      },
    });
  }

  /**
   * Elimina un usuario administrador por su ID.
   * @param id El ID del usuario administrador a eliminar.
   * @returns Un mensaje de confirmación de la eliminación.
   */
  async remove(id: string) {
    await this.findOne(id); // valida que exista

    return this.prisma.adminUser.delete({
      where: { admin_id: id },
    });
  }

  /**
   * Inicia sesión con el email y la contraseña proporcionados.
   * @param loginUserDto Datos de inicio de sesión que incluyen email y contraseña.
   * @returns Un objeto que contiene el token JWT si las credenciales son válidas.
   */
  async login(loginUserDto: LoginUserDto) {
    //Buscar el usuario por email
    const user = await this.prisma.adminUser.findFirst({
      where: { email: loginUserDto.email },
    });

    // Validar que el usuario exista
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Validar que el usuario esté activo
    if (user.status === AdminStatus.INACTIVO) {
      throw new UnauthorizedException(
        'Tu cuenta está inactiva. Contacta al administrador.',
      );
    }

    // Validar la contraseña
    const isPasswordValid = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );

    // Si la contraseña no es válida, lanzar error
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar JWT
    const payload = {
      sub: user.admin_id,
      email: user.email,
      role: user.role,
    };

    const access_token = this.jwtService.sign(payload);

    // respuesta segura (sin password)
    return {
      access_token,
      user: {
        admin_id: user.admin_id,
        name: user.name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
      },
    };
  }

  /**
   * Valida la contraseña proporcionada contra la contraseña hasheada almacenada.
   * @param plainPassword Contraseña en texto plano proporcionada por el usuario.
   * @param hashedPassword Contraseña hasheada almacenada en la base de datos.
   * @returns True si la contraseña es válida, de lo contrario false.
   */
  async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
