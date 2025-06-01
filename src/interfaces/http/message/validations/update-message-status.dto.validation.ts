import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class UpdateMessageStatusDTOValidation {
  @IsString()
  @IsNotEmpty()
  messageId: string;

  @IsEnum(['PENDING', 'SENDING', 'SENT'])
  status: string;
}
