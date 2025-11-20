import { PartialType } from '@nestjs/mapped-types';
import { CreateBiometricProfileDto } from './create-biometric-profile.dto';

export class UpdateBiometricProfileDto extends PartialType(CreateBiometricProfileDto) {}
