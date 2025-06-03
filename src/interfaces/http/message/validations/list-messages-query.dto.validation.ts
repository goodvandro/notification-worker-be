import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Min } from 'class-validator';
import { MessageStatus } from 'src/domain/message/entities/message.entity';

export class ListMessagesQueryDtoValidation {
  @IsOptional()
  @IsIn(['PENDING', 'SENDING', 'SENT'])
  status?: MessageStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
