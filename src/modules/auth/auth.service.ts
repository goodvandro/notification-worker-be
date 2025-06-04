import { Injectable } from '@nestjs/common';
import { LoginDto } from 'src/app/auth/dto/login.dto';
import { RegisterDTO } from 'src/app/auth/dto/register.dto';
import { LoginUseCase } from 'src/app/auth/use-cases/login.usecase';
import { RegisterUseCase } from 'src/app/auth/use-cases/register.usecase';
import { AuthPayload } from 'src/domain/auth/entities/auth-payload.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
  ) {}

  async login(input: LoginDto): Promise<AuthPayload> {
    return this.loginUseCase.execute({ username: input.username, password: input.password });
  }

  async register(input: RegisterDTO) {
    return this.registerUseCase.execute(input);
  }
}
