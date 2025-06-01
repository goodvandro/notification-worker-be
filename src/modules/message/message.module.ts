import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreateMessageUseCase } from 'src/app/message/use-cases/create-message.usecase';
import { ListMessagesUseCase } from 'src/app/message/use-cases/list-messages.usecase';
import { MessageRepository } from 'src/domain/message/repositories/message.repository';
import { MessageMongoRepository } from 'src/infra/db/mongodb/repositories/massage-mongo.repository';
import { MessageSchema } from 'src/infra/db/mongodb/schemas/message.schema';
import { MessageController } from 'src/interfaces/http/message/controllers/message.controller';
import { MessageService } from './message.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }])],
  controllers: [MessageController],
  providers: [
    MessageService,
    {
      provide: 'MessageRepository',
      useClass: MessageMongoRepository,
    },
    {
      provide: CreateMessageUseCase,
      useFactory: (repo: MessageRepository) => new CreateMessageUseCase(repo),
      inject: ['MessageRepository'],
    },
    {
      provide: ListMessagesUseCase,
      useFactory: (repo: MessageRepository) => new ListMessagesUseCase(repo),
      inject: ['MessageRepository'],
    },
  ],
  exports: [],
})
export class MessageModule {}
