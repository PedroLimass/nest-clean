import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
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
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question';
import { EditQuestionBodyDto } from '../swagger/dtos/http.dto';

const editQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
  attachments: z.array(z.string().uuid()),
});

const bodyValidationPipe = new ZodValidationPipe(editQuestionBodySchema);

type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>;

@ApiTags('Perguntas')
@ApiBearerAuth('access-token')
@Controller('/questions/:id')
export class EditQuestionController {
  constructor(private editQuestion: EditQuestionUseCase) {}

  @Put()
  @HttpCode(204)
  @ApiOperation({ summary: 'Editar pergunta' })
  @ApiParam({ name: 'id', description: 'ID da pergunta' })
  @ApiBody({ type: EditQuestionBodyDto })
  @ApiResponse({ status: 204, description: 'Pergunta atualizada' })
  async handle(
    @Body(bodyValidationPipe) body: EditQuestionBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('id') questionId: string,
  ) {
    const { title, content, attachments } = body;
    const userId = user.sub;

    const result = await this.editQuestion.execute({
      title,
      content,
      authorId: userId,
      attachmentsIds: attachments,
      questionId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
