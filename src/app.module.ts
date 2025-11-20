import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentModule } from './student/student.module';
import { BiometricProfileModule } from './biometric-profile/biometric-profile.module';
import { UserModule } from './user/user.module';
import { PhotoRequestModule } from './photo-request/photo-request.module';

@Module({
  imports: [StudentModule, BiometricProfileModule, UserModule, PhotoRequestModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
