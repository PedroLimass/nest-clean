import { Module } from '@nestjs/common';
import { ConfigModule, type ConfigModuleOptions } from '@nestjs/config';
import { validateEnv } from './env/env';
import { AuthModule } from './auth/auth.module';
import { HttpModule } from './http/http.module';
import { EnvModule } from './env/env.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: validateEnv as NonNullable<ConfigModuleOptions['validate']>,
      isGlobal: true,
    }),
    AuthModule,
    HttpModule,
    EnvModule,
  ],
})
export class AppModule {}
