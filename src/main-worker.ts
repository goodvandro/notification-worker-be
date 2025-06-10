import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './infra/queue/worker.module';

async function bootstrapWorker() {
  await NestFactory.createApplicationContext(WorkerModule);
  console.log('🐇 Worker Bull iniciado (process-message)');
}

bootstrapWorker().catch((err) => {
  console.error('Erro ao iniciar worker:', err);
  process.exit(1);
});
