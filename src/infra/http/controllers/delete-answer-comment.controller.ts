import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { type UserPayload } from '@/infra/auth/jwt.strategy';
import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment';

@ApiTags('Comentários')
@ApiBearerAuth('access-token')
@Controller('/answers/comments/:id')
export class DeleteAnswerCommentController {
  constructor(private deleteAnswerComment: DeleteAnswerCommentUseCase) {}

  @Delete()
  @HttpCode(204)
  @ApiOperation({ summary: 'Excluir comentário de resposta' })
  @ApiParam({ name: 'id', description: 'ID do comentário' })
  @ApiResponse({ status: 204, description: 'Comentário excluído' })
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') answerCommentId: string,
  ) {
    const userId = user.sub;

    const result = await this.deleteAnswerComment.execute({
      answerCommentId,
      authorId: userId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
