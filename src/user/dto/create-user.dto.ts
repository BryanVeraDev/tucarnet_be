import { AdminRole } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  last_name: string;

  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;

  @IsEnum(AdminRole)
  role: AdminRole;
}
