import { IsString, IsNotEmpty, IsUrl } from 'class-validator';

export class CreatePhotoRequestDto {
  @IsString()
  @IsNotEmpty()
  student_id: string;

  @IsUrl()
  @IsNotEmpty()
  new_photo_url: string;
}
