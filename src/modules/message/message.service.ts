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
import { NotificationsGateway } from 'src/infra/websocket/notifications.gateway';

@Injectable()
export class MessageService {
  constructor(
    private readonly createMessageUseCase: CreateMessageUseCase,
    private readonly listMessagesUseCase: ListMessagesUseCase,
    private readonly updateMessageStatusUseCase: UpdateMessageStatusUseCase,
    private readonly getMessageByIdUseCase: GetMessageByIdUseCase,
    @InjectQueue('messages') private readonly messageQueue: Queue,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async create(data: CreateMessageDTO, user: AuthUser): Promise<Message> {
    const msg = await this.createMessageUseCase.execute(data, user);

    if (msg.id !== null) {
      // Enqueue the message for processing
      console.log('Enqueueing message...');
      await this.messageQueue.add('process-message', { messageId: msg.id });
      console.log('Message enqueued.');
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
    await this.updateMessageStatusUseCase.execute(messageId, status, user);
    const updatedMessage = await this.getMessageByIdUseCase.execute(messageId);
    if (updatedMessage) this.notificationsGateway.notifyStatusUpdate(updatedMessage);
  }

  async getById(id: string): Promise<Message | null> {
    return this.getMessageByIdUseCase.execute(id);
  }
}
