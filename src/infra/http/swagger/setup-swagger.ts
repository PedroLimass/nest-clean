import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Nest Clean API')
    .setDescription(
      'API de fórum construída com NestJS e Clean Architecture. ' +
        'Autentique-se em POST /sessions e use o token Bearer nas demais rotas protegidas.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token obtido em POST /sessions',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const httpAdapter = app.getHttpAdapter();

  httpAdapter.get('/openapi.json', (_req, res) => {
    res.json(document);
  });

  SwaggerModule.setup('api', app, document, {
    jsonDocumentUrl: 'openapi.json',
    swaggerUiEnabled: false,
  });

  app.use(
    '/docs',
    apiReference({
      theme: 'purple',
      content: document,
    }),
  );
}
