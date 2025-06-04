import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUser } from 'src/domain/auth/types/auth-user.interface';
import { AuthenticatedRequest } from 'src/interfaces/http/auth/@types/authenticated-request';

/**
 * @CurrentUser()
 *
 * Extract from req.user (already populated by JwtStrategy) the payload JWT
 * transforming in AuthUser ({ userId, username }).
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthUser => {
    const req: AuthenticatedRequest = ctx.switchToHttp().getRequest();
    const payload = req.user;
    return { userId: payload.sub ?? '', username: payload.username };
  },
);
