import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvService } from './env/env.service';
import { setupSwagger } from './http/swagger/setup-swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: false,
    // cors: true,
  });

  setupSwagger(app);

  const envService = app.get(EnvService);
  const port = envService.get('PORT');

  await app.listen(port);
  console.log(`Server is running on port ${port}`);
  console.log(`API docs available at http://localhost:${port}/docs`);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
