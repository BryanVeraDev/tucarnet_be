import { IsString, IsNotEmpty, IsUrl, IsNumber, Min, Max } from 'class-validator';

export class UpdateBiometricDto {
  @IsString()
  @IsNotEmpty()
  student_id: string;

  @IsString()
  card_photo_key: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  similarity: number;
}