import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { MessageService } from 'src/modules/message/message.service';
import { Channel as AmqpChannel } from 'amqplib';

@Controller()
export class RabbitMqConsumer {
  private readonly logger = new Logger(RabbitMqConsumer.name);

  constructor(private readonly messageService: MessageService) {
    this.logger.log('🔧 RabbitMqConsumer registado');
  }

  /**
   * Este método será chamado sempre que uma mensagem com pattern 'process_message_queue'
   * for recebida na fila RabbitMQ.
   */
  @EventPattern('process_message_queue')
  async handleProcessMessage(
    @Payload() payload: { messageId: string },
    @Ctx() context: RmqContext,
  ) {
    const { messageId } = payload;
    console.log('Received event:', payload);
    const channel = context.getChannelRef() as AmqpChannel;
    const originalMsg = context.getMessage();

    this.logger.log(`🎯 Processando mensagem: ${messageId}`);

    try {
      await this.messageService.updateStatus(messageId, 'SENDING');
      this.logger.log(`📤 Status SENDING: ${messageId}`);

      await new Promise((res) => setTimeout(res, 2000));

      await this.messageService.updateStatus(messageId, 'SENT');
      this.logger.log(`✅ Status SENT: ${messageId}`);

      // 4. Confirma processamento (ACK)
      channel.ack(originalMsg);
      this.logger.log(`✅ Mensagem confirmada: ${messageId}`);
    } catch (error) {
      this.logger.error(`❌ Erro ao processar ${messageId}:`, error);

      // Rejeita a mensagem (NACK) - pode reprocessar ou descartar
      channel.nack(originalMsg, false, false); // false, false = descarta
      throw error;
    }
  }

  @EventPattern('#')
  catchAll(@Payload() data: any) {
    this.logger.log('Received event: ' + JSON.stringify(data));
  }
}
