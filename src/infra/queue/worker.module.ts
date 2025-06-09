// worker.module.ts - Import RabbitMqModule to get the consumer
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongoModule } from '../db/mongodb/mongodb.module';
import { MessageModule } from 'src/modules/message/message.module';
import { RabbitMqModule } from './rabbitmq.module'; // Import RabbitMqModule

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongoModule,
    MessageModule,
    RabbitMqModule, // This provides RabbitMqConsumer with the event handlers
  ],
  providers: [], // Remove RabbitMqConsumer from here since it's in RabbitMqModule
})
export class WorkerModule {}
