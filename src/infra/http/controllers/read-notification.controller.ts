import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { type UserPayload } from '@/infra/auth/jwt.strategy';

@ApiTags('Notificações')
@ApiBearerAuth('access-token')
@Controller('/notifications/:notificationId/read')
export class ReadNotificationController {
  constructor(private readNotification: ReadNotificationUseCase) {}

  @Patch()
  @HttpCode(204)
  @ApiOperation({ summary: 'Marcar notificação como lida' })
  @ApiParam({ name: 'notificationId', description: 'ID da notificação' })
  @ApiResponse({ status: 204, description: 'Notificação marcada como lida' })
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('notificationId') notificationId: string,
  ) {
    const result = await this.readNotification.execute({
      notificationId,
      recipientId: user.sub,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
