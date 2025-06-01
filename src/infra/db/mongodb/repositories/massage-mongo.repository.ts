import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessageRepository } from 'src/domain/message/repositories/message.repository';
import { MessageDocument } from '../schemas/message.schema';
import { Message } from 'src/domain/message/entities/message.entity';

@Injectable()
export class MessageMongoRepository implements MessageRepository {
  constructor(@InjectModel('Message') private readonly model: Model<MessageDocument>) {}

  async create(message: Message): Promise<Message> {
    const createdMessage = new this.model({
      userId: message.userId,
      title: message.title,
      content: message.content,
      status: message.status,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    });
    await createdMessage.save();
    return new Message(
      createdMessage.id as string | null,
      createdMessage.userId,
      createdMessage.title,
      createdMessage.content,
      createdMessage.status,
      createdMessage.createdAt,
      createdMessage.updatedAt,
    );
  }

  async findByUser(userId: string): Promise<Message[]> {
    const docks = await this.model.find({ userId }).exec();
    return docks.map(
      (dock) =>
        new Message(
          dock.id as string | null,
          dock.userId,
          dock.title,
          dock.content,
          dock.status,
          dock.createdAt,
          dock.updatedAt,
        ),
    );
  }

  async updateStatus(id: string, status: string): Promise<void> {
    await this.model.findByIdAndUpdate(id, { status, updatedAt: new Date() }).exec();
  }
}
