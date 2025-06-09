import { NestFactory } from '@nestjs/core';
import { Transport, RmqOptions } from '@nestjs/microservices';
import { WorkerModule } from './infra/queue/worker.module';

async function bootstrapWorker() {
  const app = await NestFactory.createMicroservice<RmqOptions>(WorkerModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URI as string],
      queue: process.env.RABBITMQ_QUEUE as string,
      queueOptions: {
        durable: true,
      },
      prefetchCount: 1,
      noAck: true,
      exchange: 'amq.topic',
      exchangeType: 'topic',
      wildcards: true,
      // falta aqui ↓
      routingKey: 'process_message',
    },
  });

  await app.listen();
  console.log(`🐇 Worker RabbitMQ iniciado na fila: ${process.env.RABBITMQ_QUEUE}`);
}

bootstrapWorker().catch(console.error);
