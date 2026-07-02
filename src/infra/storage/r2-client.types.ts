export interface R2PutObjectParams {
  Bucket: string;
  Key: string;
  ContentType: string;
  Body: Buffer;
}

export interface R2Client {
  putObject(params: R2PutObjectParams): Promise<void>;
}
