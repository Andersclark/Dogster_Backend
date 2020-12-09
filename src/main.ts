import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import * as config from 'config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('Dogster API v1')
    .setDescription('NOTE: This is strictly for documentation. The routes themselves require proper authentication.')
    .setVersion('1.0')
    .addTag('dogs')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  logger.log(`Swagger initialized on  /api`);

  const serverConfig = config.get('server');
  if (process.env.NODE_ENV === 'development') {
    logger.log(`CORS: enabled`);
    app.enableCors();
  }
  const port = process.env.PORT || serverConfig.port;
  await app.listen(port);
  logger.log(`Application listening on port ${port}...`);
}
bootstrap();
