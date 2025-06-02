import { AuthUser } from 'src/domain/auth/types/auth-user.interface';
import { MessageStatus } from 'src/domain/message/entities/message.entity';
import { MessageRepository } from 'src/domain/message/repositories/message.repository';

export class UpdateMessageStatusUseCase {
  constructor(private readonly messageRepository: MessageRepository) {}

  async execute(messageId: string, status: string, user?: AuthUser): Promise<void> {
    if (user) console.log(user);
    await this.messageRepository.updateStatus(messageId, status as MessageStatus);
  }
}
