import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvService } from './env/env.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: false,
    // cors: true,
  });

  const envService = app.get(EnvService);
  const port = envService.get('PORT');

  await app.listen(port);
  console.log(`Server is running on port ${port}`);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
