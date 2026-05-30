import { io, Socket } from 'socket.io-client';
import api from '@/lib/api';
import { API_URL } from '@/lib/env';
import { AppNotification } from '../types/notification';

const SOCKET_URL = API_URL.replace(/\/api\/?$/, '');

export async function fetchNotifications(): Promise<AppNotification[]> {
  const response = await api.get('/notifications');
  return response.data;
}

export async function markAllNotificationsRead(): Promise<void> {
  await api.patch('/notifications/read-all');
}

export async function markNotificationRead(id: string): Promise<void> {
  await api.patch(`/notifications/${id}/read`);
}

export function createNotificationSocket(token: string): Socket {
  return io(`${SOCKET_URL}/notifications`, {
    auth: { token },
    transports: ['websocket'],
  });
}
