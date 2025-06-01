import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MessageProcessor } from './message.processor';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: +(process.env.REDIS_PORT ?? 6379),
      },
    }),
    BullModule.registerQueue({
      name: 'messages',
    }),
  ],
  providers: [MessageProcessor],
  exports: [],
})
export class QueueModule {}
