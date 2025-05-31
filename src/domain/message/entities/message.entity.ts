export type MessageStatus = 'PENDING' | 'SENDING' | 'SENT';

export class Message {
  constructor(
    public readonly id: string | null,
    public readonly userId: string,
    public readonly title: string,
    public readonly content: string,
    public readonly status: MessageStatus = 'PENDING',
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}
}
