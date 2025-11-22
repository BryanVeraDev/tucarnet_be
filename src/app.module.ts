import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentModule } from './student/student.module';
import { BiometricProfileModule } from './biometric-profile/biometric-profile.module';
import { UserModule } from './user/user.module';
import { PhotoRequestModule } from './photo-request/photo-request.module';
import { QrModule } from './qr/qr.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot({
      isGlobal: true,
    }),
    StudentModule, BiometricProfileModule, UserModule, PhotoRequestModule, QrModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
