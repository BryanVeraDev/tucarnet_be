import { IsEnum, IsOptional, IsEmail, IsNotEmpty } from 'class-validator';
import { AdminRole, AdminStatus } from '@prisma/client';

export class UpdateUserDto {
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  last_name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(AdminStatus)
  status?: AdminStatus;

  @IsOptional()
  @IsEnum(AdminRole)
  role?: AdminRole;
}
