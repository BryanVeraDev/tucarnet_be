import { PartialType } from '@nestjs/mapped-types';
import { CreatePhotoRequestDto } from './create-photo-request.dto';

export class UpdatePhotoRequestDto extends PartialType(CreatePhotoRequestDto) {}
