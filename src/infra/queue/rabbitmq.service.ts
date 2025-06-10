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
      this.logger.log(`📤 Publicando mensagem: ${messageId}`);

      await this.client.emit('process_message_queue', { messageId }).toPromise();

      this.logger.log(`✅ Mensagem publicada: ${messageId}`);
    } catch (error) {
      this.logger.error(`❌ Erro ao publicar: ${messageId}`, error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.client.close();
      this.logger.log('🔌 Cliente RabbitMQ desconectado');
    } catch (error) {
      this.logger.error('Erro ao fechar conexão RabbitMQ:', error);
    }
  }
}
