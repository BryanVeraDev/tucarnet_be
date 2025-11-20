import { Injectable } from '@nestjs/common';
import { CreatePhotoRequestDto } from './dto/create-photo-request.dto';
import { UpdatePhotoRequestDto } from './dto/update-photo-request.dto';

@Injectable()
export class PhotoRequestService {
  create(createPhotoRequestDto: CreatePhotoRequestDto) {
    return 'This action adds a new photoRequest';
  }

  findAll() {
    return `This action returns all photoRequest`;
  }

  findOne(id: number) {
    return `This action returns a #${id} photoRequest`;
  }

  update(id: number, updatePhotoRequestDto: UpdatePhotoRequestDto) {
    return `This action updates a #${id} photoRequest`;
  }

  remove(id: number) {
    return `This action removes a #${id} photoRequest`;
  }
}
