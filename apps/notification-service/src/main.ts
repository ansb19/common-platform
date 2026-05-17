import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
import { NotificationServiceModule } from './notification-service.module';


async function bootstrap() {
  const app = await NestFactory.create(NotificationServiceModule);

  const reflector = app.get(Reflector);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Notification Service API Docs')
    .setDescription(
      `Notification Service API 문서입니다.

- Email, Push, SMS 발송을 담당하는 내부 플랫폼 서비스입니다.
- 사용자 access-token이 아닌 내부 service api key 기반 인증을 사용합니다.
- 브라우저 직접 호출용 서비스가 아니므로 CORS는 설정하지 않습니다.`,
    )
    .setVersion('1.0')
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-service-api-key',
        in: 'header',
        description: '내부 서비스 인증용 API Key',
      },
      'service-api-key',
    )
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api-docs', app, swaggerDocument);

  const port = Number(process.env.NOTIFICATION_SERVICE_PORT ?? 3001);

  await app.listen(port, '0.0.0.0');

  const url = await app.getUrl();

  console.log(`Notification Service is running on ${url}`);
  console.log(`Swagger Docs: ${url}/api-docs`);
}

void bootstrap();