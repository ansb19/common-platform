import { NotificationChannel } from "../notification/enum/notification-channel.enum";
import { NotificationDeliveryStatus } from "../notification/enum/notification-delivery-status.enum";
import { NotificationLogStatus } from "../notification/enum/notification-log-status.enum";

export interface CreateNotificationLogParams {
  projectName: string;
  requestId?: string | null;
  templateIdx?: number | null;
  senderRefType?: string | null;
  senderRefIdx?: number | null;
  channel: NotificationChannel;
  title?: string | null;
  content: string;
  templateVariables?: Record<string, unknown> | null;
  receiverRefIdxs?: number[] | null;
  fileUuids?: string[] | null;
  linkUrl?: string | null;
  priority?: number;
  isSystem?: boolean;
  status?: NotificationLogStatus;
  targetCount?: number;
  metadata?: Record<string, unknown> | null;
}

export interface CreateNotificationDeliveryLogParams {
  notificationLogIdx: number;
  notificationLogCreatedAt: Date;
  projectName: string;
  receiverRefType: string;
  receiverRefIdx?: number | null;
  receiverContact?: string | null;
  channel: NotificationChannel;
  status?: NotificationDeliveryStatus;
  metadata?: Record<string, unknown> | null;
}

export interface UpdateDeliveryLogStatusParams {
  idx: number;
  status: NotificationDeliveryStatus;
  providerMessageId?: string | null;
  failureCode?: string | null;
  failureReason?: string | null;
  sentAt?: Date | null;
  metadata?: Record<string, unknown> | null;
}
