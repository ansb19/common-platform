import { NotificationChannel } from '../enum/notification-channel.enum';

export interface SendNotificationParams {
    channels: NotificationChannel[];

    requestId?: string;

    templateCode?: string;
    variables?: Record<
        string,
        string | number | boolean | null | undefined
    >;

    // EMAIL
    email?: {
        to: string[];
        subject: string;
        html?: string;
        text?: string;

        cc?: string[];
        bcc?: string[];
    };

    // SMS
    sms?: {
        to: string[];
        from: string;
        text: string;
    };

    // PUSH
    push?: {
        deviceTokens: string[];

        title: string;
        body: string;

        data?: Record<string, string>;
    };
}