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

  async findByUser(
    userId: string,
    status?: Message['status'],
    page?: number,
    limit?: number,
  ): Promise<Message[]> {
    const skip = ((page || 1) - 1) * (limit || 10);

    const filter = { userId };

    if (status) {
      filter['status'] = status;
    }

    const docks = await this.model
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip || 0)
      .limit(limit || 10)
      .exec();
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

  async countByUser(userId: string, status?: Message['status']): Promise<number> {
    const filter = { userId };
    if (status) {
      filter['status'] = status;
    }
    return this.model.countDocuments(filter).exec();
  }

  async findById(id: string): Promise<Message | null> {
    const dock = await this.model.findById(id).exec();
    if (!dock) return null;
    return new Message(
      dock.id as string | null,
      dock.userId,
      dock.title,
      dock.content,
      dock.status,
      dock.createdAt,
      dock.updatedAt,
    );
  }
}
