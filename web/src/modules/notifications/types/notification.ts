export type AppNotificationType = 'BOOKED' | 'UPCOMING' | 'CANCELLED' | 'RESCHEDULED';

export interface AppNotification {
  id: string;
  appointmentId?: string | null;
  title: string;
  message: string;
  type: AppNotificationType;
  isRead: boolean;
  createdAt: string;
}
