// apps/notification-service/src/queue/interface/notification-queue-job.interface.ts

import { NotificationChannel } from "../../notification/enum/notification-channel.enum";

export interface NotificationQueueJobData {
  notificationLogIdx: number;
  deliveryLogIdx: number;
  priority?: number;
}

export interface AddSendNotificationJobsParams {
  notificationLogIdx: number;
  deliveryLogs: {
    idx: number;
    channel: NotificationChannel;
    priority?: number;
  }[];
}
