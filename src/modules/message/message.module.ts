import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreateMessageUseCase } from 'src/app/message/use-cases/create-message.usecase';
import { GetMessageByIdUseCase } from 'src/app/message/use-cases/get-message-by-id';
import { ListMessagesUseCase } from 'src/app/message/use-cases/list-messages.usecase';
import { UpdateMessageStatusUseCase } from 'src/app/message/use-cases/update-message-status.usecase';
import { MessageRepository } from 'src/domain/message/repositories/message.repository';
import { MessageMongoRepository } from 'src/infra/db/mongodb/repositories/massage-mongo.repository';
import { MessageSchema } from 'src/infra/db/mongodb/schemas/message.schema';
import { MessageController } from 'src/interfaces/http/message/controllers/message.controller';
import { MessageService } from './message.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }]),
    BullModule.registerQueue({ name: 'messages' }),
  ],
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
    {
      provide: UpdateMessageStatusUseCase,
      useFactory: (repo: MessageRepository) => new UpdateMessageStatusUseCase(repo),
      inject: ['MessageRepository'],
    },
    {
      provide: GetMessageByIdUseCase,
      useFactory: (repo: MessageRepository) => new GetMessageByIdUseCase(repo),
      inject: ['MessageRepository'],
    },
  ],
  exports: [MessageService],
})
export class MessageModule {}
