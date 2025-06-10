import { NestFactory } from '@nestjs/core';
import { Transport, RmqOptions } from '@nestjs/microservices';
import { WorkerModule } from './infra/queue/worker.module';

async function bootstrapWorker() {
  const url = process.env.RABBITMQ_URI as string;
  const queue = process.env.RABBITMQ_QUEUE_WORKER as string;

  // const app = await NestFactory.createMicroservice<RmqOptions>(WorkerModule, {
  //   transport: Transport.RMQ,
  //   options: {
  //     urls: [url],
  //     queue,
  //     queueOptions: { durable: true, exclusive: false },
  //     prefetchCount: 1,
  //     noAck: false,
  //     exchange: 'amq.topic',
  //     exchangeType: 'topic',
  //     wildcards: false,
  //     routingKey: 'process_message_queue',
  //   },
  // });

  const app = await NestFactory.create(WorkerModule);

  app.connectMicroservice<RmqOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [url],
      queue,
      queueOptions: { durable: true },
      prefetchCount: 1,
      noAck: false,
      exchange: 'amq.topic',
      exchangeType: 'topic',
      wildcards: false,
      routingKey: 'process_message_queue',
    },
  });
  // await app.startAllMicroservices();

  // await app.listen();
  console.log(`🐇 Worker RabbitMQ iniciado na fila: ${process.env.RABBITMQ_QUEUE}`);
}

bootstrapWorker().catch((error) => {
  console.error('❌ Erro ao inicializar worker RabbitMQ', error);
  process.exit(1);
});
