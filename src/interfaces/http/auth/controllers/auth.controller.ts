import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDtoValidation } from '../validations/login.dto.validation';
import { AuthService } from 'src/modules/auth/auth.service';
import { JwtPayload } from 'src/app/auth/dto/jwt-payload';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly service: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  async login(@Body() dto: LoginDtoValidation) {
    return this.service.login({ username: dto.username, password: dto.password });
  }

  @Post('refresh')
  refresh(@Body('refreshToken') refreshToken: string) {
    try {
      const payload: JwtPayload = this.jwtService.verify(refreshToken);
      const accessToken = this.jwtService.sign(
        {
          sub: payload.userId,
          username: payload.username,
        },
        { expiresIn: '15m' },
      );

      return {
        accessToken,
      };
    } catch (err) {
      throw new UnauthorizedException(err, 'Invalid refresh token');
    }
  }
}
