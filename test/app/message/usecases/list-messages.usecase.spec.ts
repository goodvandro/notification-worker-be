import { PaginatedMessagesOutputDTO } from 'src/app/message/dtos/paginated-messages.output.dto';
import { ListMessagesUseCase } from 'src/app/message/use-cases/list-messages.usecase';
import { AuthUser } from 'src/domain/auth/types/auth-user.interface';
import { Message, MessageStatus } from 'src/domain/message/entities/message.entity';
import { MessageRepository } from 'src/domain/message/repositories/message.repository';

describe('ListMessagesUseCase', () => {
  let useCase: ListMessagesUseCase;
  let user: AuthUser;
  let mockRepo: jest.Mocked<
    Pick<MessageRepository, 'create' | 'findByUser' | 'countByUser' | 'updateStatus' | 'findById'>
  >;

  beforeEach(() => {
    mockRepo = {
      create: jest.fn<Promise<Message>, [Message]>(),
      findByUser: jest.fn<Promise<Message[]>, [string, Message['status'], number, number]>(),
      countByUser: jest.fn<Promise<number>, [string, Message['status']]>(),
      updateStatus: jest.fn<Promise<void>, [string, MessageStatus]>(),
      findById: jest.fn<Promise<Message | null>, [string]>(),
    };
    useCase = new ListMessagesUseCase(mockRepo);
    user = { userId: 'user1', username: 'user1' };
  });

  it('should return items and meta attributes without filter of status', async () => {
    const dummyMessages: Message[] = [
      new Message('id1', 'user1', 'T1', 'C1', 'PENDING', new Date(), new Date()),
      new Message('id2', 'user1', 'T2', 'C2', 'PENDING', new Date(), new Date()),
    ];
    // Suponhamos que o total de mensagens seja 2 (no filtro “undefined”)
    mockRepo.countByUser.mockResolvedValueOnce(2);
    // findByUser deve retornar o array dummy, ignorando skip/limit
    mockRepo.findByUser.mockResolvedValueOnce(dummyMessages);

    const result = await useCase.execute(user, undefined, 1, 10);

    // Verifica chamadas
    expect(mockRepo.countByUser).toHaveBeenCalledWith('user1', undefined);
    expect(mockRepo.findByUser).toHaveBeenCalledWith('user1', undefined, 1, 10);

    // Verifica o formato de retorno
    const expected: PaginatedMessagesOutputDTO = {
      items: dummyMessages,
      meta: {
        total: 2,
        page: 1,
        limit: 10,
        totalPages: Math.ceil(2 / 10),
      },
    };
    expect(result).toEqual(expected);
  });
});
