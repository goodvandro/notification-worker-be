// src/infra/queue/worker.module.ts

import { Module } from '@nestjs/common';
import { MessageModule } from 'src/modules/message/message.module';
import { BullConfigModule } from './bull-config.module';
import { QueueModule } from './queue.module';
import { MongoModule } from '../db/mongodb/mongodb.module';

@Module({
  imports: [BullConfigModule, MongoModule, QueueModule, MessageModule],
})
export class WorkerModule {}
