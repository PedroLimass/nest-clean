import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug';
import { QuestionDetailsPresenter } from '../presenters/question-details-presenter';

@ApiTags('Perguntas')
@ApiBearerAuth('access-token')
@Controller('/questions/:slug')
export class GetQuestionBySlugController {
  constructor(private getQuestionBySlug: GetQuestionBySlugUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Buscar detalhes da pergunta pelo slug' })
  @ApiParam({ name: 'slug', example: 'como-usar-nestjs' })
  @ApiResponse({ status: 200, description: 'Detalhes da pergunta com autor e anexos' })
  @ApiResponse({ status: 400, description: 'Pergunta não encontrada' })
  async handle(@Param('slug') slug: string) {
    const result = await this.getQuestionBySlug.execute({
      slug,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    return { question: QuestionDetailsPresenter.toHTTP(result.value.question) };
  }
}
