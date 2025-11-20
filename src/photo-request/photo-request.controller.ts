import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PhotoRequestService } from './photo-request.service';
import { CreatePhotoRequestDto } from './dto/create-photo-request.dto';
import { UpdatePhotoRequestDto } from './dto/update-photo-request.dto';

@Controller('photo-request')
export class PhotoRequestController {
  constructor(private readonly photoRequestService: PhotoRequestService) {}

  @Post()
  create(@Body() createPhotoRequestDto: CreatePhotoRequestDto) {
    return this.photoRequestService.create(createPhotoRequestDto);
  }

  @Get()
  findAll() {
    return this.photoRequestService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.photoRequestService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePhotoRequestDto: UpdatePhotoRequestDto) {
    return this.photoRequestService.update(+id, updatePhotoRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.photoRequestService.remove(+id);
  }
}
