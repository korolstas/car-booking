import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

const PORT = process.env.PORT || 3000;

const ORIGIN_DOMAIN = process.env.ORIGIN_DOMAIN || 'http://localhost:5173';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(cookieParser());

  app.enableCors({
    origin: ORIGIN_DOMAIN,
    credentials: true,
  });

  await app.listen(PORT);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
