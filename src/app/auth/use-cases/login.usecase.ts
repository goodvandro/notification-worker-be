import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthPayload } from 'src/domain/auth/entities/auth-payload.entity';
import { UserRepository } from 'src/domain/user/repositories/user.repository';
import { CustomJwtPayload } from '../dto/jwt-payload';
import { LoginDto } from '../dto/login.dto';

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

    const payload: CustomJwtPayload = {
      sub: user.id ?? '',
      username: user.username,
    };

    const accessExpiresIn = process.env.JWT_EXPIRES_IN ?? '15m';
    const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN ?? '7d';

    const accessToken = this.jwtService.sign(payload, { expiresIn: accessExpiresIn });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: refreshExpiresIn });

    return new AuthPayload(user.id, user.username, String(accessToken), String(refreshToken));
  }
}
