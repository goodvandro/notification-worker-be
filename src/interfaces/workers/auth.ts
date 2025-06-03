import { Request } from 'express';

export function isValidAdminToken(req: Request): boolean {
  const authHeader = req.headers['authorization'];
  const customHeader = req.headers['x-admin-token'] as string | undefined;
  const queryToken = (req.query?.token as string) ?? undefined;

  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (customHeader) {
    token = customHeader.trim();
  } else if (queryToken) {
    token = queryToken.trim();
  }

  return token !== undefined && token === process.env.ADMIN_BULL_BOARD_TOKEN;
}
