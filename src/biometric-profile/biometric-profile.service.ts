import { Injectable } from '@nestjs/common';
import { CreateBiometricProfileDto } from './dto/create-biometric-profile.dto';
import { UpdateBiometricProfileDto } from './dto/update-biometric-profile.dto';

@Injectable()
export class BiometricProfileService {
  create(createBiometricProfileDto: CreateBiometricProfileDto) {
    return 'This action adds a new biometricProfile';
  }

  findAll() {
    return `This action returns all biometricProfile`;
  }

  findOne(id: number) {
    return `This action returns a #${id} biometricProfile`;
  }

  update(id: number, updateBiometricProfileDto: UpdateBiometricProfileDto) {
    return `This action updates a #${id} biometricProfile`;
  }

  remove(id: number) {
    return `This action removes a #${id} biometricProfile`;
  }
}
