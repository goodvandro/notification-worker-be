import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { PaginatedMessagesOutputDTO } from 'src/app/message/dtos/paginated-messages.output.dto';
import { AuthUser } from 'src/domain/auth/types/auth-user.interface';
import { JwtAuthGuard } from 'src/modules/auth/auth.guard';
import { CurrentUser } from 'src/modules/auth/current-user.decorator';
import { MessageService } from 'src/modules/message/message.service';
import { CreateMessageDTOValidation } from '../validations/create-message.dto.validation';
import { ListMessagesQueryDtoValidation } from '../validations/list-messages-query.dto.validation';
import { UpdateMessageStatusDTOValidation } from '../validations/update-message-status.dto.validation';

@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessageController {
  constructor(private readonly service: MessageService) {}

  @Post()
  async create(@CurrentUser() user: AuthUser, @Body() dto: CreateMessageDTOValidation) {
    return this.service.create(dto, user);
  }

  @Get()
  async findAll(
    @CurrentUser() user: AuthUser,
    @Query() query: ListMessagesQueryDtoValidation,
  ): Promise<PaginatedMessagesOutputDTO> {
    const { page, limit, status } = query;
    return this.service.findAllByUser(user, status, page, limit);
  }

  @Get(':id/status')
  async updateStatus(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateMessageStatusDTOValidation,
  ) {
    return this.service.updateStatus(id, dto.status, user);
  }
}
