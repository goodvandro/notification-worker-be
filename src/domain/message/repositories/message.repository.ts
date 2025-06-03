import { Message, MessageStatus } from '../entities/message.entity';

export interface MessageRepository {
  create(message: Message): Promise<Message>;
  findByUser(
    userId: string,
    status?: Message['status'],
    page?: number,
    limit?: number,
  ): Promise<Message[]>;
  updateStatus(id: string, status: MessageStatus): Promise<void>;
  countByUser(userId: string, status?: Message['status']): Promise<number>;
}
