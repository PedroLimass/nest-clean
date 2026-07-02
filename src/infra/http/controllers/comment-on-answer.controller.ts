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
import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer';
import { CommentBodyDto } from '../swagger/dtos/http.dto';

const commentOnAnswerBodySchema = z.object({
  content: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(commentOnAnswerBodySchema);

type CommentOnAnswerBodySchema = z.infer<typeof commentOnAnswerBodySchema>;

@ApiTags('Comentários')
@ApiBearerAuth('access-token')
@Controller('/answers/:answerId/comments')
export class CommentOnAnswerController {
  constructor(private commentOnAnswer: CommentOnAnswerUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Comentar em uma resposta' })
  @ApiParam({ name: 'answerId', description: 'ID da resposta' })
  @ApiBody({ type: CommentBodyDto })
  @ApiResponse({ status: 201, description: 'Comentário criado' })
  async handle(
    @Body(bodyValidationPipe) body: CommentOnAnswerBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('answerId') answerId: string,
  ) {
    const { content } = body;
    const userId = user.sub;

    const result = await this.commentOnAnswer.execute({
      content,
      answerId,
      authorId: userId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
