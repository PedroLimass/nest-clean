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
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question';

@ApiTags('Perguntas')
@ApiBearerAuth('access-token')
@Controller('/questions/:id')
export class DeleteQuestionController {
  constructor(private deleteQuestion: DeleteQuestionUseCase) {}

  @Delete()
  @HttpCode(204)
  @ApiOperation({ summary: 'Excluir pergunta' })
  @ApiParam({ name: 'id', description: 'ID da pergunta' })
  @ApiResponse({ status: 204, description: 'Pergunta excluída' })
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') questionId: string,
  ) {
    const userId = user.sub;

    const result = await this.deleteQuestion.execute({
      questionId,
      authorId: userId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
