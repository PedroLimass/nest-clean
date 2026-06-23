import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { Env } from './env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: false,
    // cors: true,
  });

  const configService = app.get<ConfigService<Env, true>>(ConfigService);
  const port = configService.get('PORT', { infer: true });

  await app.listen(port);
  console.log(`Server is running on port ${port}`);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
