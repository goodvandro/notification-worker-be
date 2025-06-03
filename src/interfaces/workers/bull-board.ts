import { createBullBoard } from '@bull-board/api';
import { ExpressAdapter } from '@bull-board/express';
import { getQueueToken } from '@nestjs/bull';
import { INestApplication, InternalServerErrorException } from '@nestjs/common';
import { Queue } from 'bull';
import { BullAdapter } from '@bull-board/api/bullAdapter';
// import { NextFunction, Request, RequestHandler, Response } from 'express';
import { isValidAdminToken } from './auth';
import { Express } from 'express';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ParamsDictionary, Query } from 'express-serve-static-core';
/**
 * Configure the Bull Board (UI) for the queue "messages".
 *
 * @param app - Nest instance (with module QueueModule already registered).
 */
export function setupBullBoard(app: INestApplication) {
  type ParsedQs = Query;

  // 1. Create the Express adapter
  const serverAdapter = new ExpressAdapter();
  // Optional: add basePath for UI of the Bull Board
  serverAdapter.setBasePath('/admin/queues');

  // 2. Get the queue instance "messages" of the Nest
  // getQueueToken('messages') is a helper of @nestjs/bull that return a intern token
  const messageQueue: Queue = app.get<Queue>(getQueueToken('messages'));

  // 3. Create the Bull Board pointing to the queue "messages"
  createBullBoard({
    queues: [
      new BullAdapter(messageQueue),
      // It can add new queues by new BullAdapter(otherQueue),
    ],
    serverAdapter,
  });

  // 4. Run a express server "under" the Nest instance
  const httpAdapter = app.getHttpAdapter();
  const expressInstance = httpAdapter.getInstance() as Express | null; // Like express.Application

  if (!expressInstance) {
    throw new InternalServerErrorException('Failed to get Express instance');
  }

  // 5. Add the Bull Board UI to the express instance
  expressInstance.use(
    '/admin/queues',
    (req: Request, res: Response, next: NextFunction) => {
      const expectedToken = process.env.ADMIN_BULL_BOARD_TOKEN;

      // 5.1. Se for requisição dos arquivos estáticos ("/static/..."), deixa passar
      if (req.path.startsWith('/static/')) {
        return next();
      }

      // 5.2. Se estiver vindo ?token=<token> na URL, grava cookie e redireciona sem o ?token
      const queryToken = (req.query?.token as string | undefined)?.trim();
      if (queryToken && queryToken === expectedToken) {
        // Grava o cookie válido para chamadas subsequentes
        res.cookie('admin_bull_token', queryToken, {
          httpOnly: true,
          // opcional: secure: true, sameSite: 'strict' se for HTTPS em produção
        });
        // Redireciona para a mesma rota sem query string
        const baseUrl = req.baseUrl + req.path; // ex: "/admin/queues" ou "/admin/queues/api/..."
        return res.redirect(baseUrl);
      }

      // 5.3. Se houver cookie válido ou header válido, permite
      if (isValidAdminToken(req)) {
        return next();
      }

      // 5.4. Caso contrário, bloqueia
      res.status(403).send('Forbidden');
    },
    serverAdapter.getRouter() as RequestHandler<
      ParamsDictionary,
      any,
      any,
      ParsedQs,
      Record<string, any>
    >,
    // serverAdapter.getRouter(),
  );
}
