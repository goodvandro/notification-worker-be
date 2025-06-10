import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { CreateMessageDTO } from 'src/app/message/dtos/create-message.dto';
import { PaginatedMessagesOutputDTO } from 'src/app/message/dtos/paginated-messages.output.dto';
import { CreateMessageUseCase } from 'src/app/message/use-cases/create-message.usecase';
import { GetMessageByIdUseCase } from 'src/app/message/use-cases/get-message-by-id';
import { ListMessagesUseCase } from 'src/app/message/use-cases/list-messages.usecase';
import { UpdateMessageStatusUseCase } from 'src/app/message/use-cases/update-message-status.usecase';
import { AuthUser } from 'src/domain/auth/types/auth-user.interface';
import { Message } from 'src/domain/message/entities/message.entity';

@Injectable()
export class MessageService {
  constructor(
    private readonly createMessageUseCase: CreateMessageUseCase,
    private readonly listMessagesUseCase: ListMessagesUseCase,
    private readonly updateMessageStatusUseCase: UpdateMessageStatusUseCase,
    private readonly getMessageByIdUseCase: GetMessageByIdUseCase,
    @InjectQueue('messages') private readonly messageQueue: Queue,
  ) {}

  async create(data: CreateMessageDTO, user: AuthUser): Promise<Message> {
    const msg = await this.createMessageUseCase.execute(data, user);

    if (msg.id !== null) {
      // Enqueue the message for processing
      await this.messageQueue.add('process-message', { messageId: msg.id });
    }
    return msg;
  }

  async findAllByUser(
    user: AuthUser,
    status?: Message['status'],
    page?: number,
    limit?: number,
  ): Promise<PaginatedMessagesOutputDTO> {
    return this.listMessagesUseCase.execute(user, status, page, limit);
  }

  async updateStatus(messageId: string, status: string, user?: AuthUser): Promise<void> {
    return this.updateMessageStatusUseCase.execute(messageId, status, user);
  }

  async getById(id: string): Promise<Message | null> {
    return this.getMessageByIdUseCase.execute(id);
  }
}
