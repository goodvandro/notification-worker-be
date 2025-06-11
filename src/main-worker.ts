import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './infra/queue/worker.module';

async function bootstrapWorker() {
  const app = await NestFactory.createApplicationContext(WorkerModule);
  await app.init();
  console.log('🐇 Worker Bull iniciado (process-message)');
}

bootstrapWorker().catch((err) => {
  console.error('Erro ao iniciar worker:', err);
  process.exit(1);
});
