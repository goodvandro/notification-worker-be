import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDtoValidation {
  @IsEmail()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
