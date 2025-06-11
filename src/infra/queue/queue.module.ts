import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MessageModule } from 'src/modules/message/message.module';
import { MessageProcessor } from 'src/infra/queue/message.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'messages',
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT) || 6379,
      },
    }),
    MessageModule,
  ],
  providers: [MessageProcessor],
  exports: [],
})
export class QueueModule {}
