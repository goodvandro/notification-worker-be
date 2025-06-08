import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { MessageService } from 'src/modules/message/message.service';

@Controller()
export class RabbitMqConsumer {
  private readonly logger = new Logger(RabbitMqConsumer.name);

  constructor(private readonly messageService: MessageService) {
    console.log('Instanciando RabbitMqConsumer');
    this.logger.log('RabbitMqConsumer instanciado');
  }

  /**
   * Este método será chamado sempre que uma mensagem com pattern 'process_message'
   * for recebida na fila RabbitMQ.
   */
  @EventPattern('process_message')
  async handleProcessMessage(@Payload() data: { messageId: string }) {
    const { messageId } = data;
    this.logger.log(
      `[RabbitMqConsumer] Consumindo evento process_message → messageId=${messageId}`,
    );

    // 1. Atualiza status para SENDING
    // const current = await this.messageService.findById(messageId);

    // if (current.status !== 'PENDING') {
    await this.messageService.updateStatus(messageId, 'SENDING');
    this.logger.log(`[RabbitMqConsumer] Mensagem ${messageId} como SENDING`);
    // return;
    // }

    // 2. Simula delay de envio (2 segundos)
    await new Promise((res) => setTimeout(res, 2000));

    // 3. Atualiza status para SENT
    await this.messageService.updateStatus(messageId, 'SENT');
    this.logger.log(`[RabbitMqConsumer] Mensagem ${messageId} como SENT`);
  }
}
