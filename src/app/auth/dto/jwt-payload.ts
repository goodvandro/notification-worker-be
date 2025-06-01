import { Request } from 'express';

export interface JwtPayload {
  userId: string | null;
  username: string;
}

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
