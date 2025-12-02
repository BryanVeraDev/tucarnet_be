import { IsString, IsNotEmpty, IsUrl, IsNumber, Min, Max } from 'class-validator';

export class UpdateBiometricDto {
  @IsString()
  @IsNotEmpty()
  student_id: string;

  @IsUrl()
  @IsNotEmpty()
  card_photo_url: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  similarity: number;
}