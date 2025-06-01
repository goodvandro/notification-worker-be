import { Injectable } from '@nestjs/common';
import { CreateMessageDTO } from 'src/app/message/dtos/create-message.dto';
import { CreateMessageUseCase } from 'src/app/message/use-cases/create-message.usecase';
import { ListMessagesUseCase } from 'src/app/message/use-cases/list-messages.usecase';
import { AuthUser } from 'src/domain/auth/types/auth-user.interface';
import { Message } from 'src/domain/message/entities/message.entity';

@Injectable()
export class MessageService {
  constructor(
    private readonly createMessageUseCase: CreateMessageUseCase,
    private readonly listMessagesUseCase: ListMessagesUseCase,
  ) {}

  async create(data: CreateMessageDTO, user: AuthUser): Promise<Message> {
    return this.createMessageUseCase.execute(data, user);
  }

  async findAllByUser(user: AuthUser): Promise<Message[]> {
    return this.listMessagesUseCase.execute(user);
  }
}
