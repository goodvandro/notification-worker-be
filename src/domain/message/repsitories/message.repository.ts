import { Message, MessageStatus } from '../entities/message.entity';

export interface MessageRepository {
  create(message: Message): Promise<Message>;
  findByUser(userId: string): Promise<Message[]>;
  updateStatus(id: string, status: MessageStatus): Promise<void>;
}
