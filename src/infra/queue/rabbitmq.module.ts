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
            noAck: false,
            exchange: 'amq.topic',
            exchangeType: 'topic',
            wildcards: true,
            routingKey: config.get('RABBITMQ_ROUTING_KEY')!,
            // replyQueue: 'amq.rabbitmq.reply-to',

            // ← exatamente o mesmo topic-exchange + routingKey
          },
        }),
        inject: [ConfigService],
      },
    ]),
    forwardRef(() => MessageModule),
  ],
  providers: [RabbitMqConsumer, RabbitMqService],
  exports: [RabbitMqService],
})
export class RabbitMqModule {}
