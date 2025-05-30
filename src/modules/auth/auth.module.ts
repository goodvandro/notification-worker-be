import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { LoginUseCase } from 'src/app/auth/use-cases/login.usecase';
import { UserRepository } from 'src/domain/user/repositories/user.repository';
import { UserMongoRepository } from 'src/infra/db/mongodb/repositories/user-mongo.repository';
import { UserSchema } from 'src/infra/db/mongodb/schemas/user.schema';
import { AuthController } from 'src/interfaces/http/controllers/auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

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
  ],
})
export class AuthModule {}
