import { AuthUser } from 'src/domain/auth/types/auth-user.interface';
import { Message } from 'src/domain/message/entities/message.entity';
import { MessageRepository } from 'src/domain/message/repositories/message.repository';
import { PaginatedMessagesOutputDTO } from '../dtos/paginated-messages.output.dto';

export class ListMessagesUseCase {
  constructor(private readonly messageRepository: MessageRepository) {}

  /**
   * Retorna mensagens de um usuário, filtradas por status (se informado),
   * e paginadas conforme page/limit.
   *
   * @param user ID do usuário
   * @param status Se informado, filtra apenas por esse status
   * @param page Número da página (começa em 1)
   * @param limit Itens por página
   */
  async execute(
    user: AuthUser,
    status?: Message['status'],
    page = 1,
    limit = 10,
  ): Promise<PaginatedMessagesOutputDTO> {
    const total = await this.messageRepository.countByUser(user.userId, status);
    const items = await this.messageRepository.findByUser(user.userId, status, page, limit);
    const totalPages = Math.ceil(total / limit);
    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }
}
