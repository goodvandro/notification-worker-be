import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitMqConsumer } from './rabbitmq.consumer';
import { RabbitMqService } from './rabbitmq.service';
import { MessageModule } from 'src/modules/message/message.module';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'MESSAGES_RMQ_CLIENT',
        imports: [ConfigModule],
        useFactory: (config: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [config.get('RABBITMQ_URI')!] as string[],
            queue: config.get('RABBITMQ_QUEUE')!, // 'notifications'
            queueOptions: { durable: true },
            prefetchCount: 1,
            replyQueue: 'amq.rabbitmq.reply-to',
            noAck: true,

            // ← exatamente o mesmo topic-exchange + routingKey
            exchange: 'amq.topic',
            exchangeType: 'topic',
            wildcards: true,
            routingKey: 'process_message_queue',
          },
        }),
        inject: [ConfigService],
      },
    ]),
    forwardRef(() => MessageModule), // Use forwardRef to resolve circular dependency
  ],
  providers: [RabbitMqConsumer, RabbitMqService],
  exports: [RabbitMqService],
})
export class RabbitMqModule {}
