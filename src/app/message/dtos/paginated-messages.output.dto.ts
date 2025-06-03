import { Message } from 'src/domain/message/entities/message.entity';

export interface PaginatedMessagesOutputDTO {
  items: Message[];
  meta: {
    total: number; // total de itens que batem no filtro
    page: number; // página atual (1-based)
    limit: number; // itens por página
    totalPages: number; // cálculo: ceil(total / limit)
  };
}
