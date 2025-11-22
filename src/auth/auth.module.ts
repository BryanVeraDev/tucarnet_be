import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from 'prisma/prisma.module';
import { DivisistService } from '../external-apis/divisist/divisist.service';
import { MoodleService } from '../external-apis/moodle/moodle.service';

@Module({
  imports: [PrismaModule, HttpModule],
  controllers: [AuthController],
  providers: [AuthService, DivisistService, MoodleService],
  exports: [AuthService],
})
export class AuthModule {}
