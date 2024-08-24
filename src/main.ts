import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { envs } from './config';

async function bootstrap() {
  const logger = new Logger('Auth-Api');

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  await app.listen(envs.PORT);
  logger.log(`Server running on port: ${envs.PORT}`);
}
bootstrap();
