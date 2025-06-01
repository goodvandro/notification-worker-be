import { MessageStatus } from 'src/domain/message/entities/message.entity';

export class UpdateMessageStatusDTO {
  messageId: string;
  status: MessageStatus;
}
