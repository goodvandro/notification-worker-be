import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { setupBullBoard } from './interfaces/workers/bull-board';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.enableCors({
    origin: ['http://localhost:5173'],
    credentials: true,
  });

  setupBullBoard(app);

  const port = process.env.WEB_SERVER_PORT || 3000;
  console.log(`🚀 Starting app on port ${port}`);
  await app.listen(port, '0.0.0.0');
}
bootstrap();
