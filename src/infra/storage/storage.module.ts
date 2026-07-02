import { Uploader } from '@/domain/forum/application/storage/uploader';
import { Module } from '@nestjs/common';
import { R2Storage } from './r2-storage';
import { EnvModule } from '../env/env.module';
import { EnvService } from '../env/env.service';
import { createR2Client } from './r2-client';
import { R2Client } from './r2-client.types';

export const R2_CLIENT = Symbol('R2_CLIENT');

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: R2_CLIENT,
      useFactory: (envService: EnvService): R2Client =>
        createR2Client(envService),
      inject: [EnvService],
    },
    {
      provide: Uploader,
      useFactory: (envService: EnvService, client: R2Client) =>
        new R2Storage(envService, client),
      inject: [EnvService, R2_CLIENT],
    },
  ],
  exports: [Uploader],
})
export class StorageModule {}
