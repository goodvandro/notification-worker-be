import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDtoValidation } from '../validations/login.dto.validation';
import { AuthService } from 'src/modules/auth/auth.service';
import { CustomJwtPayload } from 'src/app/auth/dto/jwt-payload';
import { Public } from 'src/modules/auth/decorators/public.decorator';
import { RegisterDtoValidation } from '../validations/register.dto.validation';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly service: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Public()
  @Post('login')
  async login(@Body() dto: LoginDtoValidation) {
    return this.service.login({ username: dto.username, password: dto.password });
  }

  @Public()
  @Post('register')
  async create(@Body() dto: RegisterDtoValidation) {
    return this.service.register(dto);
  }

  @Post('refresh')
  refresh(@Body('refreshToken') refreshToken: string) {
    try {
      const payload: CustomJwtPayload = this.jwtService.verify(refreshToken);
      const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });

      return {
        accessToken,
      };
    } catch (err) {
      throw new UnauthorizedException(err, 'Invalid refresh token');
    }
  }
}
