import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StudentModule } from './student/student.module';
import { UserModule } from './user/user.module';
import { PhotoRequestModule } from './photo-request/photo-request.module';
import { QrModule } from './qr/qr.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot({
      isGlobal: true,
    }),
    StudentModule, UserModule, PhotoRequestModule, QrModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
