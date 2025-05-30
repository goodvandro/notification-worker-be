/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthPayload } from 'src/domain/auth/entities/auth-payload.entity';
import { UserRepository } from 'src/domain/user/repositories/user.repository';
import { LoginDto } from '../dto/login.dto';
import { JwtPayload } from '../dto/jwt-payload';

export class LoginUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(input: LoginDto): Promise<AuthPayload> {
    const user = await this.userRepo.findByUsername(input.username);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordMatches = await bcrypt.compare(input.password, user.password);
    if (!passwordMatches) throw new UnauthorizedException('Invalid credentials');

    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return new AuthPayload(user.id, user.username, String(accessToken), String(refreshToken));
  }
}
