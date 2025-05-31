import { Document, Schema } from 'mongoose';
import { MessageStatus } from 'src/domain/message/entities/message.entity';

export interface MessageDocument extends Document {
  userId: string;
  title: string;
  content: string;
  status: MessageStatus;
  createdAt: Date;
  updatedAt: Date;
}

export const MessageSchema = new Schema<MessageDocument>({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  status: { type: String, enum: ['PENDING', 'SENDING', 'SENT'], default: 'PENDING', index: true },
  createdAt: { type: Date, default: () => new Date() },
  updatedAt: { type: Date, default: () => new Date() },
});
