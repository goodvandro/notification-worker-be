import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDtoValidation {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
