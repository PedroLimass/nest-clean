import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { type UserPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { z } from 'zod';
import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question';
import { CommentBodyDto } from '../swagger/dtos/http.dto';

const commentOnQuestionBodySchema = z.object({
  content: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(commentOnQuestionBodySchema);

type CommentOnQuestionBodySchema = z.infer<typeof commentOnQuestionBodySchema>;

@ApiTags('Comentários')
@ApiBearerAuth('access-token')
@Controller('/questions/:questionId/comments')
export class CommentOnQuestionController {
  constructor(private commentOnQuestion: CommentOnQuestionUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Comentar em uma pergunta' })
  @ApiParam({ name: 'questionId', description: 'ID da pergunta' })
  @ApiBody({ type: CommentBodyDto })
  @ApiResponse({ status: 201, description: 'Comentário criado' })
  async handle(
    @Body(bodyValidationPipe) body: CommentOnQuestionBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('questionId') questionId: string,
  ) {
    const { content } = body;
    const userId = user.sub;

    const result = await this.commentOnQuestion.execute({
      content,
      questionId,
      authorId: userId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
