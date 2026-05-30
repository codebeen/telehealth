import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
  namespace: 'notifications',
})
export class NotificationsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    const token =
      client.handshake.auth?.token ||
      client.handshake.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      client.disconnect();
      return;
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || 'fallbackSecret',
      });
      client.data.userId = payload.sub;
      client.join(this.userRoom(payload.sub));
    } catch {
      client.disconnect();
    }
  }

  @SubscribeMessage('notifications:join')
  joinUserRoom(@ConnectedSocket() client: Socket, @MessageBody() body: { userId?: string }) {
    if (!client.data.userId || body?.userId !== client.data.userId) {
      return { ok: false };
    }
    client.join(this.userRoom(client.data.userId));
    return { ok: true };
  }

  emitToUser(userId: string, notification: unknown) {
    this.server?.to(this.userRoom(userId)).emit('notifications:new', notification);
  }

  emitUnreadCount(userId: string, count: number) {
    this.server?.to(this.userRoom(userId)).emit('notifications:unread-count', { count });
  }

  private userRoom(userId: string) {
    return `user:${userId}`;
  }
}
