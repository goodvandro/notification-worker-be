import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Message } from 'src/domain/message/entities/message.entity';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173'],
    credentials: true,
  },
})
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  /**
   * Emite para todos os clientes conectados a atualização de status de uma mensagem.
   */
  notifyStatusUpdate(message: Message) {
    this.server.emit('messageStatusUpdated', message);
  }
}
