import { Request as NestRequest } from '@nestjs/common';

declare module '@nestjs/common' {
  export interface Request extends NestRequest {
    user: AuthUser;
  }
}
