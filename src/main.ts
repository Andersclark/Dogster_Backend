import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import * as config from 'config';

async function bootstrap() {
  const logger = new Logger('Main');
  const app = await NestFactory.create(AppModule);

  const serverConfig = config.get('server');

  if (process.env.NODE_ENV === 'development') {
    logger.log(`CORS: enabled`);
    app.enableCors();
  }
  const port = process.env.PORT || serverConfig.port;
  await app.listen(port);
  logger.log(`Dogster listening on port ${port}...`);
}
// noinspection JSIgnoredPromiseFromCall
bootstrap();
