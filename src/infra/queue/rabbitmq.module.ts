import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MessageModule } from 'src/modules/message/message.module';
import { RabbitMqConsumer } from './rabbitmq.consumer';
import { RabbitMqService } from './rabbitmq.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'MESSAGES_RMQ_CLIENT',
        imports: [ConfigModule],
        useFactory: (config: ConfigService) => {
          const rabbitmqUri = config.get<string>('RABBITMQ_URI');
          const queue = config.get<string>('RABBITMQ_QUEUE');
          if (!rabbitmqUri || !queue) {
            throw new Error('RABBITMQ_URI and RABBITMQ_QUEUE configuration property is required');
          }
          return {
            transport: Transport.RMQ,
            options: {
              urls: [rabbitmqUri],
              queue,
              queueOptions: { durable: true },
              prefetchCount: 5,
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
    forwardRef(() => MessageModule),
  ],
  providers: [RabbitMqConsumer, RabbitMqService],
  exports: [RabbitMqService],
})
export class RabbitMqModule {}
