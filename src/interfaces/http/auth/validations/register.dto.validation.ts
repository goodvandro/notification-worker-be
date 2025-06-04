import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterDtoValidation {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
