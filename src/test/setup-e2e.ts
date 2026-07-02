import { DomainEvents } from '@/core/events/domain-events';
import { envSchema } from '@/infra/env/env';
import { config } from 'dotenv';
import { PrismaPg } from '@prisma/adapter-pg';
import { execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { Redis } from 'ioredis';
import { PrismaClient } from '../generated/prisma/client';

config({ path: '.env', override: true });
config({ path: '.env.test', override: true });

const env = envSchema.parse(process.env);

let prisma: PrismaClient;

const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  db: env.REDIS_DB,
});

function generateUniqueDatabaseURL(schemaId: string) {
  if (!env.DATABASE_URL) {
    throw new Error('Please provider a DATABASE_URL environment variable');
  }

  const url = new URL(env.DATABASE_URL);

  url.searchParams.set('schema', schemaId);

  return url.toString();
}

const schemaId = randomUUID();

beforeAll(async () => {
  const databaseURL = generateUniqueDatabaseURL(schemaId);

  process.env.DATABASE_URL = databaseURL;

  DomainEvents.shouldRun = false;

  await redis.flushdb();

  prisma = new PrismaClient({
    adapter: new PrismaPg({
      connectionString: databaseURL,
    }),
  });

  execSync('npx prisma migrate deploy');
});

beforeEach(async () => {
  await prisma.attachment.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.answer.deleteMany();
  await prisma.question.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
  await prisma.$disconnect();
  await redis.quit();
});
