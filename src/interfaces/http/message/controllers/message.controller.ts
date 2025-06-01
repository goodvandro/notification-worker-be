import { Body, Controller, Get, Post, Req, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/auth.guard';
import { MessageService } from 'src/modules/message/message.service';
import { CreateMessageDTOValidation } from '../validations/create-message.dto.validation';
import { AuthUser } from 'src/domain/auth/types/auth-user.interface';
import { Message } from 'src/domain/message/entities/message.entity';
import { AuthenticatedRequest } from 'src/app/auth/dto/jwt-payload';

@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessageController {
  constructor(private readonly service: MessageService) {}

  @Post()
  async create(@Req() req: AuthenticatedRequest, @Body() dto: CreateMessageDTOValidation) {
    const user = req.user as AuthUser;
    return this.service.create(dto, user);
  }

  @Get()
  async findAll(@Request() req: AuthenticatedRequest): Promise<Message[]> {
    const user = req.user as AuthUser;
    return this.service.findAllByUser(user);
  }
}
