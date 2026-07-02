/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Uploader } from '@/domain/forum/application/storage/uploader';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import path from 'node:path';
import request from 'supertest';
import { FakeUploader } from 'test/storage/fake-uploader';
import { QuestionFactory } from 'test/factories/make-question';
import { StudentFactory } from 'test/factories/make-student';

const sampleUpload = path.join(
  __dirname,
  '../../../test/e2e/sample-upload.png',
);

describe('Upload attachment (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let studentFactory: StudentFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    })
      .overrideProvider(Uploader)
      .useClass(FakeUploader)
      .compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    studentFactory = moduleRef.get(StudentFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[POST] /attachments', async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const response = await request(app.getHttpServer())
      .post('/attachments')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', sampleUpload);

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      attachmentId: expect.any(String),
    });

    const attachmentOnDatabase = await prisma.attachment.findFirst();

    expect(attachmentOnDatabase).toBeTruthy();
  });
});
