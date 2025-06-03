// src/interfaces/workers/auth.ts

import { Request } from 'express';

export function isValidAdminToken(req: Request): boolean {
  const expected = process.env.ADMIN_BULL_BOARD_TOKEN;
  if (!expected) return false;

  // 1. Tenta ler header "Authorization: Bearer <token>"
  const authHeader = req.headers['authorization']?.trim();
  let token: string | undefined;

  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.slice(7).trim();
  }

  // 2. Se não veio no Authorization, tenta header "x-admin-token"
  if (!token) {
    token = (req.headers['x-admin-token'] as string | undefined)?.trim();
  }

  // 3. Se não veio em headers, tenta query param "token"
  if (!token) {
    token = (req.query?.token as string | undefined)?.trim();
  }

  // 4. Se não veio em headers ou query, tenta cookie "admin_bull_token"
  if (!token && req.cookies) {
    token = req.cookies['admin_bull_token'];
  }

  // 5. Retorna true se bate com a variável de ambiente
  return token === expected;
}
