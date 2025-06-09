import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { MessageService } from 'src/modules/message/message.service';

@Controller()
export class RabbitMqConsumer {
  private readonly logger = new Logger(RabbitMqConsumer.name);

  constructor(private readonly messageService: MessageService) {
    console.log('🔧 RabbitMqConsumer instanciado');
    this.logger.log('🔧 RabbitMqConsumer registrado');
  }

  /**
   * Este método será chamado sempre que uma mensagem com pattern 'process_message'
   * for recebida na fila RabbitMQ.
   */
  @EventPattern('process_message')
  async handleProcessMessage(@Payload() data: { messageId: string }, @Ctx() context: RmqContext) {
    const { messageId } = data;
    const channel = context.getChannelRef();
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
}
