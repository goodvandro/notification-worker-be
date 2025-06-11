import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { setupBullBoard } from './interfaces/workers/bull-board';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.useWebSocketAdapter(new IoAdapter(app));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  setupBullBoard(app);

  app.enableCors({
    origin: [process.env.WEB_FRONTEND_URL],
    credentials: true,
  });

  const port = process.env.WEB_SERVER_PORT || 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 HTTP+WebSocket running on port ${port}`);
}
bootstrap();
