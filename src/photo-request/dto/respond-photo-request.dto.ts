import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

export class RespondPhotoRequestDto {
  @IsString()
  @IsNotEmpty()
  request_id: string;

  @IsString()
  @IsNotEmpty()
  admin_id: string;

  @IsEnum(['APROBADO', 'RECHAZADO'])
  @IsNotEmpty()
  status: 'APROBADO' | 'RECHAZADO';
}