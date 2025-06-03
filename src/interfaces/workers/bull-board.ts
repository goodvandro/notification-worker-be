import { createBullBoard } from '@bull-board/api';
import { ExpressAdapter } from '@bull-board/express';
import { getQueueToken } from '@nestjs/bull';
import { INestApplication, InternalServerErrorException } from '@nestjs/common';
import { Queue } from 'bull';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { NextFunction, Request, Response } from 'express';
import { isValidAdminToken } from './auth';
import { Express } from 'express';

/**
 * Configure the Bull Board (UI) for the queue "messages".
 *
 * @param app - Nest instance (with module QueueModule already registered).
 */
export function setupBullBoard(app: INestApplication) {
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
      if (!isValidAdminToken(req)) {
        res.status(401).send('Unauthorized');
        return;
      }
      next();
    },
    serverAdapter.getRouter(),
  );
}
