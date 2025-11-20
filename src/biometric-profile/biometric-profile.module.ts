import { Module } from '@nestjs/common';
import { BiometricProfileService } from './biometric-profile.service';
import { BiometricProfileController } from './biometric-profile.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BiometricProfileController],
  providers: [BiometricProfileService],
})
export class BiometricProfileModule {}
