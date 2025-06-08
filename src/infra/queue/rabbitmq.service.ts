// src/infra/queue/rabbitmq.service.ts

import { Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RabbitMqService implements OnModuleDestroy {
  private readonly logger = new Logger(RabbitMqService.name);

  constructor(@Inject('MESSAGES_RMQ_CLIENT') private readonly client: ClientProxy) {}

  /**
   * Publica uma mensagem (job) na fila "messages" do RabbitMQ.
   * O padrão do Nest é: client.emit(pattern, payload) para fire‐and‐forget.
   */
  async publishMessage(messageId: string): Promise<void> {
    // Força conexão caso ainda não esteja pronta:
    try {
      // aguarda a conexão se necessário
      console.log('Vamos conectar ao RabbitMQ...');

      if (this.client && typeof this.client.connect === 'function') {
        console.log('Conectando ao RabbitMQ...');
        await this.client.connect();
      }

      // Emite o evento
      await this.client.emit('process_message', { messageId }).toPromise();
    } catch (e) {
      this.logger.error('Falha no connect do RMQ:', e);
    }
  }

  async onModuleDestroy() {
    await this.client.close();
  }
}
