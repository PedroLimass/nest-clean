import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import { execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { PrismaClient } from '../generated/prisma/client';

let prisma: PrismaClient;

function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provider a DATABASE_URL environment variable');
  }

  const url = new URL(process.env.DATABASE_URL);

  url.searchParams.set('schema', schemaId);

  return url.toString();
}

const schemaId = randomUUID();

beforeAll(() => {
  const databaseURL = generateUniqueDatabaseURL(schemaId);

  process.env.DATABASE_URL = databaseURL;

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
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
  await prisma.$disconnect();
});
