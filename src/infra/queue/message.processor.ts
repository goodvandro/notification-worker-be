import { Process, Processor } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { MessageService } from 'src/modules/message/message.service';

@Processor('messages')
@Injectable()
export class MessageProcessor {
  private readonly logger = new Logger(MessageProcessor.name);

  constructor(private readonly messageService: MessageService) {}

  @Process('process-message')
  async handleProcessMessage(job: Job<{ messageId: string }>) {
    const { messageId } = job.data;

    await this.messageService.updateStatus(messageId, 'SENDING');
    this.logger.log(`Job ${job.id} - Message ${messageId} updated to SENDING`);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    await this.messageService.updateStatus(messageId, 'SENT');
    this.logger.log(`Job ${job.id} - Message ${messageId} updated to SENT`);
  }
}
