import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/infra/db/mongodb/schemas/user.schema';
import { UserController } from 'src/interfaces/http/user/controllers/user.controller';
import { UserService } from './user.service';
import { UserMongoRepository } from 'src/infra/db/mongodb/repositories/user-mongo.repository';
import { CreateUserUseCase } from 'src/app/user/use-cases/create-user.usecase';
import { UserRepository } from 'src/domain/user/repositories/user.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: 'UserRepository',
      useClass: UserMongoRepository,
    },
    {
      provide: CreateUserUseCase,
      useFactory: (repo: UserRepository) => new CreateUserUseCase(repo),
      inject: ['UserRepository'],
    },
    // {
    //   provide: ListUsersUseCase,
    //   useFactory: (repo: UserRepository) => new ListUsersUseCase(repo),
    //   inject: ['UserRepository'],
    // },
  ],
})
export class UserModule {}
