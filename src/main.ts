import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = process.env.WEB_SERVER_PORT || 3000;
  console.log(`🚀 Starting app on port ${port}`);
  await app.listen(port);
}
bootstrap();
