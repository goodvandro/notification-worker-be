import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
// import { Transport } from '@nestjs/microservices';
// import { setupBullBoard } from './interfaces/workers/bull-board';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // setupBullBoard(app);

  app.enableCors({
    origin: ['http://localhost:5173'],
    credentials: true,
  });

  // app.connectMicroservice({
  //   transport: Transport.RMQ, // Transport.RMQ
  //   options: {
  //     urls: [process.env.RABBITMQ_URI],
  //     queue: process.env.RABBITMQ_QUEUE,
  //     queueOptions: { durable: true },
  //     prefetchCount: 5,
  //   },
  // });

  // await app.startAllMicroservices();

  const port = process.env.WEB_SERVER_PORT || 3000;
  console.log(`🚀 Starting app on port ${port}`);
  await app.listen(port, '0.0.0.0');
}
bootstrap();
