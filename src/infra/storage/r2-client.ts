/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  PutObjectCommand,
  S3Client,
  type S3ClientConfig,
} from '@aws-sdk/client-s3';
import { EnvService } from '../env/env.service';
import { R2Client, R2PutObjectParams } from './r2-client.types';

export function createR2Client(envService: EnvService): R2Client {
  const accountId = envService.get('CLOUDFLARE_ACCOUNT_ID');

  const config: S3ClientConfig = {
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    region: 'auto',
    credentials: {
      accessKeyId: envService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: envService.get('AWS_SECRET_ACCESS_KEY'),
    },
  };

  const client = new S3Client(config);

  return {
    async putObject(params: R2PutObjectParams) {
      await client.send(new PutObjectCommand(params));
    },
  };
}
