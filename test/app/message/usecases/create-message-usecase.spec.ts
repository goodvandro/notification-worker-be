import { CreateMessageUseCase } from 'src/app/message/use-cases/create-message.usecase';
import { AuthUser } from 'src/domain/auth/types/auth-user.interface';
import { Message, MessageStatus } from 'src/domain/message/entities/message.entity';
import { MessageRepository } from 'src/domain/message/repositories/message.repository';

describe('CreateMessageUseCase', () => {
  let useCase: CreateMessageUseCase;
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
    useCase = new CreateMessageUseCase(mockRepo);
    user = { userId: 'user1', username: 'user1' };
  });

  it('should instance a new Message, create a message and return it', async () => {
    const returnedMessage = new Message(
      'abc123',
      'user1',
      'Título teste',
      'Conteúdo teste',
      'PENDING',
      new Date('2025-06-01T00:00:00Z'),
      new Date('2025-06-01T00:00:00Z'),
    );
    mockRepo.create.mockResolvedValueOnce(returnedMessage);

    const result = await useCase.execute(
      { content: 'Conteúdo teste', title: 'Título teste' },
      user,
    );

    expect(mockRepo.create).toHaveBeenCalledTimes(1);
    const msgArg = mockRepo.create.mock.calls[0][0];
    expect(msgArg.userId).toBe(user.userId);
    expect(msgArg.title).toBe('Título teste');
    expect(msgArg.content).toBe('Conteúdo teste');
    expect(msgArg.status).toBe('PENDING');
    expect(result).toBe(returnedMessage);
  });
});
