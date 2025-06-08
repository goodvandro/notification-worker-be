import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongoModule } from './infra/db/mongodb/mongodb.module';
import { QueueModule } from './infra/queue/queue.module';
import { RabbitMqModule } from './infra/queue/rabbitmq.module';
import { AuthModule } from './modules/auth/auth.module';
import { MessageModule } from './modules/message/message.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongoModule,
    UserModule,
    AuthModule,
    MessageModule,
    QueueModule, // Bull/Redis
    RabbitMqModule, // RabbitMQ (consumer + producer)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
