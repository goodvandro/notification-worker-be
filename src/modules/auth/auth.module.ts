import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { LoginUseCase } from 'src/app/auth/use-cases/login.usecase';
import { UserRepository } from 'src/domain/user/repositories/user.repository';
import { UserMongoRepository } from 'src/infra/db/mongodb/repositories/user-mongo.repository';
import { UserSchema } from 'src/infra/db/mongodb/schemas/user.schema';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from 'src/interfaces/http/auth/controllers/auth.controller';
import { RegisterUseCase } from 'src/app/auth/use-cases/register.usecase';
import { JwtAuthGuard } from './auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: 'UserRepository',
      useClass: UserMongoRepository,
    },
    {
      provide: LoginUseCase,
      useFactory: (repo: UserRepository, jwt: JwtService) => {
        return new LoginUseCase(repo, jwt);
      },
      inject: ['UserRepository', JwtService],
    },
    {
      provide: RegisterUseCase,
      useFactory: (repo: UserRepository) => {
        return new RegisterUseCase(repo);
      },
      inject: ['UserRepository', JwtService],
    },
  ],
})
export class AuthModule {}
