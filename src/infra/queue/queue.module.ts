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
    }),
    BullModule.registerQueue({
      name: 'messages',
    }),
    MessageModule,
  ],
  providers: [MessageProcessor],
  exports: [],
})
export class QueueModule {}
