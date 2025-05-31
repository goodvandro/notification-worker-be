import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from 'src/app/user/dtos/user.dto';
import { CreateUserUseCase } from 'src/app/user/use-cases/create-user.usecase';

@Injectable()
export class UserService {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  async create(data: CreateUserDTO) {
    return this.createUserUseCase.execute(data);
  }
}
