import { Process, Processor } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { MessageService } from 'src/modules/message/message.service';

@Processor('messages')
@Injectable()
export class MessageProcessor {
  private readonly logger = new Logger(MessageProcessor.name);

  constructor(private readonly messageService: MessageService) {
    this.logger.log('MessageProcessor initialized');
  }

  @Process('process-message')
  async handleProcessMessage(job: Job<{ messageId: string }>) {
    console.log('🐇 Processando mensagem...');
    const { messageId } = job.data;

    // 1. Update the message status to 'SENDING'
    await this.messageService.updateStatus(messageId, 'SENDING');
    this.logger.log(`Job ${job.id} - Message ${messageId} updated to SENDING`);

    // 2. Simulate delay for sending the message (2 seconds)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 3. Update the message status to 'SENT'
    await this.messageService.updateStatus(messageId, 'SENT');
    this.logger.log(`Job ${job.id} - Message ${messageId} updated to SENT`);
  }
}
