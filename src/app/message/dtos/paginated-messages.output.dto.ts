import { Message } from 'src/domain/message/entities/message.entity';

export interface PaginatedMessagesOutputDTO {
  items: Message[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
