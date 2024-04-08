import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';

import { Logger } from '@/shared/logger';
import { UnCaughtExceptionFilter } from '@/filters';

import { AppModule } from './app.module';
import { TimeoutInterceptor } from '@/interceptor';

/**
 *
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new Logger(),
  });
  app.use(helmet());
  app.useGlobalFilters(new UnCaughtExceptionFilter());
  app.useGlobalInterceptors(new TimeoutInterceptor());
  app.useGlobalPipes(new ValidationPipe({ stopAtFirstError: true }));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Instagram Clone')
    .setDescription('Instagram Clone API description')
    .setVersion('1.0')
    .addTag('instagram-clone')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}
bootstrap();
