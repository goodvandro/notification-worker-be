import { AuthUser } from 'src/domain/auth/types/auth-user.interface';
import { Message } from 'src/domain/message/entities/message.entity';
import { MessageRepository } from 'src/domain/message/repositories/message.repository';

export class ListMessagesUseCase {
  constructor(private readonly messageRepository: MessageRepository) {}

  async execute(user: AuthUser): Promise<Message[]> {
    return this.messageRepository.findByUser(user.userId);
  }
}
