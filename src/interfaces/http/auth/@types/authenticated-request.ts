import { Request } from 'express';
import { CustomJwtPayload } from 'src/app/auth/dto/jwt-payload';

export interface AuthenticatedRequest extends Request {
  user: CustomJwtPayload;
}
