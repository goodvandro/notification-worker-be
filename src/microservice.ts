// src/microservice.ts
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module'; // Or a more specific consumer module if you prefer

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule, // You can create a dedicated `ConsumerModule` if AppModule becomes too large
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URI || 'amqp://localhost:5672'],
        queue: process.env.RABBITMQ_QUEUE,
        queueOptions: { durable: true },
        prefetchCount: 5, // Keep prefetchCount here for the consumer

        // wildcards: true,
        // exchange: 'amq.topic',
        // exchangeType: 'topic',
        // routingKey: '*.process_message',
      },
    },
  );
  await app.listen(); // Listens for incoming RabbitMQ messages
  console.log('🚀 RabbitMQ Microservice Consumer is listening...');
}
bootstrap();
