import {
  UploadParams,
  Uploader,
} from '@/domain/forum/application/storage/uploader';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

interface Upload {
  fileName: string;
  url: string;
}

@Injectable()
export class FakeUploader implements Uploader {
  public uploads: Upload[] = [];

  // eslint-disable-next-line @typescript-eslint/require-await
  async upload({ fileName }: UploadParams): Promise<{ url: string }> {
    const url = randomUUID();

    this.uploads.push({
      fileName,
      url,
    });

    return { url };
  }
}
