import { NotificationChannel } from "../notification/enum/notification-channel.enum";

export interface CreateNotificationTemplateParams {
    projectName: string;
    code: string;
    channel: NotificationChannel;
    title?: string | null;
    content: string;
    variables?: string[] | null;
    isActive?: boolean;
}

export interface UpdateNotificationTemplateParams {
    title?: string | null;
    content?: string;
    variables?: string[] | null;
    isActive?: boolean;
}

export interface SearchNotificationTemplateParams {
    projectName?: string;
    keyword?: string;
    channel?: NotificationChannel;
    isActive?: boolean;
    page?: number;
    limit?: number;
}