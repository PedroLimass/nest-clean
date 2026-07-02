import { ApiProperty } from '@nestjs/swagger';

export class AuthenticateBodyDto {
  @ApiProperty({ example: 'john@example.com' })
  email!: string;

  @ApiProperty({ example: '123456' })
  password!: string;
}

export class CreateAccountBodyDto {
  @ApiProperty({ example: 'John Doe' })
  name!: string;

  @ApiProperty({ example: 'john@example.com' })
  email!: string;

  @ApiProperty({ example: '123456' })
  password!: string;
}

export class CreateQuestionBodyDto {
  @ApiProperty({ example: 'Como usar NestJS?' })
  title!: string;

  @ApiProperty({ example: 'Gostaria de entender os módulos do Nest.' })
  content!: string;

  @ApiProperty({
    type: [String],
    example: ['550e8400-e29b-41d4-a716-446655440000'],
    description: 'IDs dos anexos previamente enviados em POST /attachments',
  })
  attachments!: string[];
}

export class EditQuestionBodyDto {
  @ApiProperty({ example: 'Como usar NestJS? (atualizado)' })
  title!: string;

  @ApiProperty({ example: 'Conteúdo atualizado da pergunta.' })
  content!: string;

  @ApiProperty({ type: [String], example: [] })
  attachments!: string[];
}

export class AnswerQuestionBodyDto {
  @ApiProperty({ example: 'Você pode começar pelos módulos e providers.' })
  content!: string;
}

export class EditAnswerBodyDto {
  @ApiProperty({ example: 'Resposta atualizada.' })
  content!: string;
}

export class CommentBodyDto {
  @ApiProperty({ example: 'Ótima pergunta!' })
  content!: string;
}

export class AccessTokenResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token!: string;
}

export class AttachmentUploadResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  attachmentId!: string;
}
