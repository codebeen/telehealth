import { Injectable } from '@nestjs/common';
import { NotificationType } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { NotificationsGateway } from './notifications.gateway';

type CreateNotificationInput = {
  userId: string;
  appointmentId?: string | null;
  title: string;
  message: string;
  type: NotificationType;
};

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: NotificationsGateway,
  ) {}

  async findAll(userId: string) {
    const notifications = await this.prisma.notification.findMany({
      where: { userId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return notifications.map((notification) => this.mapNotification(notification));
  }

  async create(input: CreateNotificationInput) {
    const notification = await this.prisma.notification.create({
      data: {
        userId: input.userId,
        appointmentId: input.appointmentId ?? null,
        title: input.title,
        message: input.message,
        type: input.type,
      },
    });

    const dto = this.mapNotification(notification);
    this.gateway.emitToUser(input.userId, dto);
    this.gateway.emitUnreadCount(input.userId, await this.countUnread(input.userId));

    return dto;
  }

  async markAllRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { userId, deletedAt: null, isRead: false },
      data: { isRead: true },
    });

    this.gateway.emitUnreadCount(userId, 0);
    return { success: true };
  }

  async markRead(userId: string, notificationId: string) {
    await this.prisma.notification.updateMany({
      where: { id: notificationId, userId, deletedAt: null },
      data: { isRead: true },
    });

    this.gateway.emitUnreadCount(userId, await this.countUnread(userId));
    return { success: true };
  }

  async countUnread(userId: string) {
    return this.prisma.notification.count({
      where: { userId, deletedAt: null, isRead: false },
    });
  }

  private mapNotification(notification: {
    id: string;
    appointmentId: string | null;
    title: string;
    message: string;
    type: NotificationType;
    isRead: boolean;
    createdAt: Date;
  }) {
    return {
      id: notification.id,
      appointmentId: notification.appointmentId,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
    };
  }
}
