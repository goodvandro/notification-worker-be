import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // Configura o cliente Redis para o Bull em toda a aplicação
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        redis: {
          host: config.get<string>('REDIS_HOST', 'redis'),
          port: config.get<number>('REDIS_PORT', 6379),
        },
        defaultJobOptions: {
          attempts: 3, // retry 3 times in case of failure,
          backoff: { type: 'exponential', delay: 5000 },
          removeOnComplete: false,
          removeOnFail: false,
        },
        // limiter: {
        //   max: 100, // limit to 100 jobs per second
        //   duration: 1000, // 1 second
        // },
      }),
    }),
  ],
  exports: [BullModule],
})
export class BullConfigModule {}
