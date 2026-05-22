// apps/notification-service/src/notification-template/enum/notification-template-search.enum.ts

export enum NotificationTemplateSearchableColumn {
    CODE = 'template.code',
    TITLE = 'template.title',
    CONTENT = 'template.content',
}

export const NOTIFICATION_TEMPLATE_SEARCHABLE_COLUMNS = [
    NotificationTemplateSearchableColumn.CODE,
    NotificationTemplateSearchableColumn.TITLE,
    NotificationTemplateSearchableColumn.CONTENT,
];

export enum NotificationTemplateOrderByColumn {
    CREATED_AT = 'createdAt',
    UPDATED_AT = 'updatedAt',
    CODE = 'code',
    CHANNEL = 'channel',
}