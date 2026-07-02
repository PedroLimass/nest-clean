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
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question';
import { AnswerQuestionBodyDto } from '../swagger/dtos/http.dto';

const answerQuestionBodySchema = z.object({
  content: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(answerQuestionBodySchema);

type AnswerQuestionBodySchema = z.infer<typeof answerQuestionBodySchema>;

@ApiTags('Respostas')
@ApiBearerAuth('access-token')
@Controller('/questions/:questionId/answers')
export class AnswerQuestionController {
  constructor(private answerQuestion: AnswerQuestionUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Responder pergunta' })
  @ApiParam({ name: 'questionId', description: 'ID da pergunta' })
  @ApiBody({ type: AnswerQuestionBodyDto })
  @ApiResponse({ status: 201, description: 'Resposta criada' })
  async handle(
    @Body(bodyValidationPipe) body: AnswerQuestionBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('questionId') questionId: string,
  ) {
    const { content } = body;
    const userId = user.sub;

    const result = await this.answerQuestion.execute({
      content,
      questionId,
      authorId: userId,
      attachmentsIds: [],
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
