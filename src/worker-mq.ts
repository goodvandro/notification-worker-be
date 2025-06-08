// src/worker.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, RmqOptions } from '@nestjs/microservices';

async function bootstrapWorker() {
  const app = await NestFactory.create(AppModule);

  // Conecta apenas o microservice RabbitMQ
  app.connectMicroservice<RmqOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URI as string], // e.g. amqp://guest:guest@rabbitmq:5672
      queue: process.env.RABBITMQ_QUEUE, // e.g. notifications
      queueOptions: { durable: true },
      prefetchCount: 5,
      exchange: 'amq.topic',
      exchangeType: 'topic',
      wildcards: true,
    },
  });

  // Aqui é que o Nest registra o @EventPattern e cria o binding
  await app.startAllMicroservices();

  console.log(`🐇 Worker RabbitMQ iniciado, aguardando eventos…`);
}

bootstrapWorker();
