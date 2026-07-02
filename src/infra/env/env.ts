import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().optional().default(3333),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  CLOUDFLARE_ACCOUNT_ID: z.string(),
  CLOUDFLARE_PUBLIC_URL: z.string().url(),
  AWS_BUCKET_NAME: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  REDIS_HOST: z.string().optional().default('127.0.0.1'),
  REDIS_PORT: z.coerce.number().optional().default(6379),
  REDIS_DB: z.coerce.number().optional().default(0),
});

export type Env = z.infer<typeof envSchema>;

export const validateEnv: (config: Record<string, unknown>) => Env = (
  config,
) => {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    throw new Error(fromZodError(result.error).message);
  }

  return result.data;
};
