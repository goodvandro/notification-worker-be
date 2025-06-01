import { MessageRepository } from 'src/domain/message/repositories/message.repository';
import { CreateMessageDTO } from '../dtos/create-message.dto';
import { AuthUser } from 'src/domain/auth/types/auth-user.interface';
import { Message } from 'src/domain/message/entities/message.entity';
import { randomUUID } from 'crypto';

export class CreateMessageUseCase {
  constructor(private readonly messageRepository: MessageRepository) {}

  async execute({ content, title }: CreateMessageDTO, user: AuthUser): Promise<Message> {
    const message = new Message(
      randomUUID(),
      user.userId,
      title,
      content,
      'PENDING',
      new Date(),
      new Date(),
    );

    return this.messageRepository.create(message);
  }
}
