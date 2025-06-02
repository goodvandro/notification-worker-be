import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDtoValidation {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
