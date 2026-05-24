// apps/notification-service/src/notification/interface/send-notification-params.interface.ts

import { NotificationChannel } from '../enum/notification-channel.enum';

export interface SendEmailNotificationParams {
    to: string[];
    subject?: string;
    html?: string;
    text?: string;
    cc?: string[];
    bcc?: string[];
}

export interface SendSmsNotificationParams {
    to: string[];
    from: string;
    text?: string;
}

export interface SendPushNotificationParams {
    deviceTokens: string[];
    title?: string;
    body?: string;
    data?: Record<string, string>;
}

export interface SendNotificationParams {
    projectName: string;
    requestId?: string | null;

    channels: NotificationChannel[];

    templateCode?: string;
    templateIdx?: number | null;
    variables?: Record<string, string | number | boolean | null | undefined>;

    senderRefType?: string | null;
    senderRefIdx?: number | null;

    receiverRefType?: string | null;
    receiverRefIdxs?: number[] | null;

    title?: string | null;
    content?: string | null;

    fileUuids?: string[] | null;
    linkUrl?: string | null;
    priority?: number;
    isSystem?: boolean;
    metadata?: Record<string, unknown> | null;

    email?: SendEmailNotificationParams;
    sms?: SendSmsNotificationParams;
    push?: SendPushNotificationParams;
}