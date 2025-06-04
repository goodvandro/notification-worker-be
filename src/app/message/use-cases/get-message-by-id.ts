import { Message } from 'src/domain/message/entities/message.entity';
import { MessageRepository } from 'src/domain/message/repositories/message.repository';

export class GetMessageByIdUseCase {
  constructor(private readonly messageRepository: MessageRepository) {}

  async execute(id: string): Promise<Message | null> {
    return this.messageRepository.findById(id);
  }
}
