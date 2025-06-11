import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MessageModule } from 'src/modules/message/message.module';
import { MessageProcessor } from 'src/infra/queue/message.processor';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: +(process.env.REDIS_PORT ?? 6379),
      },
      defaultJobOptions: {
        attempts: 3, // retry 3 times in case of failure,
        removeOnComplete: false,
        removeOnFail: false, // keep the job in the queue in case of failure
        backoff: {
          type: 'exponential',
          delay: 5000, // start with 5 seconds delay
        },
      },
    }),
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
