import { Module } from '@nestjs/common';
import { PhotoRequestService } from './photo-request.service';
import { PhotoRequestController } from './photo-request.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PhotoRequestController],
  providers: [PhotoRequestService],
})
export class PhotoRequestModule {}
