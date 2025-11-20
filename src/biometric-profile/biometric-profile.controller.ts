import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BiometricProfileService } from './biometric-profile.service';
import { CreateBiometricProfileDto } from './dto/create-biometric-profile.dto';
import { UpdateBiometricProfileDto } from './dto/update-biometric-profile.dto';

@Controller('biometric-profile')
export class BiometricProfileController {
  constructor(private readonly biometricProfileService: BiometricProfileService) {}

  @Post()
  create(@Body() createBiometricProfileDto: CreateBiometricProfileDto) {
    return this.biometricProfileService.create(createBiometricProfileDto);
  }

  @Get()
  findAll() {
    return this.biometricProfileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.biometricProfileService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBiometricProfileDto: UpdateBiometricProfileDto) {
    return this.biometricProfileService.update(+id, updateBiometricProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.biometricProfileService.remove(+id);
  }
}
