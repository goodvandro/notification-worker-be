import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDtoValidation } from '../validations/login.dto.validation';
import { AuthService } from 'src/modules/auth/auth.service';
import { CustomJwtPayload } from 'src/app/auth/dto/jwt-payload';
import { Public } from 'src/modules/auth/decorators/public.decorator';
import { RegisterDtoValidation } from '../validations/register.dto.validation';

@Public()
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

  @Post('register')
  async create(@Body() dto: RegisterDtoValidation) {
    return this.service.register(dto);
  }

  @Post('refresh')
  refresh(@Body('refreshToken') refreshToken: string) {
    try {
      const customJwtPayload: CustomJwtPayload = this.jwtService.verify(refreshToken);

      const payload: CustomJwtPayload = {
        sub: customJwtPayload.sub ?? '',
        username: customJwtPayload.username,
      };

      const accessExpiresIn = process.env.JWT_EXPIRES_IN ?? '15m';
      const accessToken = this.jwtService.sign(payload, { expiresIn: accessExpiresIn });

      return { accessToken };
    } catch (err) {
      throw new UnauthorizedException(err, 'Invalid refresh token');
    }
  }
}
