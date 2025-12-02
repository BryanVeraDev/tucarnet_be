
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { initializeFirebase } from './config/firebase.config';

async function bootstrap() {
  initializeFirebase();
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  app.setGlobalPrefix('api');

  const host = '0.0.0.0';
  const port = Number(process.env.PORT) || 3000;

  await app.listen({ port, host });
}
bootstrap();
