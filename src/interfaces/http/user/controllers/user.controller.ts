import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { CreateUserDtoValidation } from '../validations/create-user.dto.validation';

// @UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post()
  async create(@Body() dto: CreateUserDtoValidation) {
    console.log(dto);
    return this.service.create(dto);
  }
}
