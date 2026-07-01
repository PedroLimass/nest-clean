import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().optional().default(3333),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
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
