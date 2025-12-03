import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { CorsConfig } from '@config/cors.config';
import { RootConfig } from '@config';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { CorrelationIdMiddleware } from './middleware/correlation-id.middleware';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import basicAuth from 'express-basic-auth';
import helmet from 'helmet';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { version } from '../package.json';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // Get Env
  const { ALLOW_ORIGIN } = await app.resolve(CorsConfig);
  const { PORT, API_DOC } = await app.resolve(RootConfig);

  // Logger Pino
  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  // Register Middleware
  app.use(helmet());
  app.use(CorrelationIdMiddleware());

  // Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'vn',
  });

  // CORS
  app.enableCors({
    exposedHeaders: ['x-correlation-id', 'content-disposition'],
    origin: ALLOW_ORIGIN,
  });

  // Swagger
  app.use(
    ['/api-docs', '/api-docs-json'],
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    basicAuth({
      challenge: true,
      users: {
        [API_DOC.username]: API_DOC.password,
      },
    }),
  );

  const title = 'Nestjs Encrypt Tool';
  const config = new DocumentBuilder()
    .setTitle(title)
    .setDescription(title)
    .setVersion(version)
    .addBearerAuth()
    .build();
  const customSwaggerOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: title,
  };
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, customSwaggerOptions);

  // Auto-validation
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  await app.listen(PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
