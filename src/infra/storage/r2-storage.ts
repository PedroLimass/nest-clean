import {
  UploadParams,
  Uploader,
} from '@/domain/forum/application/storage/uploader';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { EnvService } from '../env/env.service';
import type { R2Client } from './r2-client.types';

@Injectable()
export class R2Storage implements Uploader {
  constructor(
    private envService: EnvService,
    private client: R2Client,
  ) {}

  async upload({
    fileName,
    fileType,
    body,
  }: UploadParams): Promise<{ url: string }> {
    const uploadId = randomUUID();
    const uniqueFileName = `${uploadId}-${fileName}`;

    await this.client.putObject({
      Bucket: this.envService.get('AWS_BUCKET_NAME'),
      Key: uniqueFileName,
      ContentType: fileType,
      Body: body,
    });

    return {
      url: `${this.envService.get('CLOUDFLARE_PUBLIC_URL')}/${uniqueFileName}`,
    };
  }
}
