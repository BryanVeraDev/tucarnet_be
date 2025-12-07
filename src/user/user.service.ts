import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { PrismaService } from 'prisma/prisma.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly SALT_ROUNDS = 10;

  constructor(private readonly prisma: PrismaService) {}

  // ✅ CREATE ADMIN USER
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

  // ✅ FIND ALL ADMINS
  async findAll() {
    return this.prisma.adminUser.findMany({
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

  // ✅ FIND ONE BY ID
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

  // ✅ UPDATE ADMIN
  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id); // valida que exista

    const data: any = { ...updateUserDto };

    if (updateUserDto.password) {
      data.password = await bcrypt.hash(
        updateUserDto.password,
        this.SALT_ROUNDS,
      );
    }

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

  // ✅ DELETE ADMIN
  async remove(id: string) {
    await this.findOne(id); // valida que exista

    return this.prisma.adminUser.delete({
      where: { admin_id: id },
    });
  }

  // ✅ LOGIN ADMIN
  async login(loginUserDto: LoginUserDto) {
    const user = await this.prisma.adminUser.findFirst({
      where: { email: loginUserDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // ✅ respuesta segura (sin password)
    return {
      admin_id: user.admin_id,
      name: user.name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    };
  }

  // ✅ VALIDAR PASSWORD (reutilizable para JWT)
  async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
