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
import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer';

@ApiTags('Respostas')
@ApiBearerAuth('access-token')
@Controller('/answers/:id')
export class DeleteAnswerController {
  constructor(private deleteAnswer: DeleteAnswerUseCase) {}

  @Delete()
  @HttpCode(204)
  @ApiOperation({ summary: 'Excluir resposta' })
  @ApiParam({ name: 'id', description: 'ID da resposta' })
  @ApiResponse({ status: 204, description: 'Resposta excluída' })
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') answerId: string,
  ) {
    const userId = user.sub;

    const result = await this.deleteAnswer.execute({
      answerId,
      authorId: userId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
