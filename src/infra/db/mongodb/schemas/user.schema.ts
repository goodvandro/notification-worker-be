import { Document, Schema } from 'mongoose';

export interface UserDocument extends Document {
  _id: string;
  username: string;
  password: string;
}

export const UserSchema = new Schema<UserDocument>({
  username: { type: String, required: true },
  password: { type: String, required: true },
});
