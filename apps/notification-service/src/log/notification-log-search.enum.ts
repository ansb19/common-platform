// apps/notification-service/src/log/notification-log-search.enum.ts

export enum NotificationLogSearchableColumn {
    TITLE = 'notificationLog.title',
    CONTENT = 'notificationLog.content',
    FAILURE_REASON = 'notificationLog.failureReason',
}

export const NOTIFICATION_LOG_SEARCHABLE_COLUMNS = [
    NotificationLogSearchableColumn.TITLE,
    NotificationLogSearchableColumn.CONTENT,
    NotificationLogSearchableColumn.FAILURE_REASON,
];

export enum NotificationLogOrderByColumn {
    CREATED_AT = 'createdAt',
    PRIORITY = 'priority',
    TARGET_COUNT = 'targetCount',
    SUCCESS_COUNT = 'successCount',
    FAILURE_COUNT = 'failureCount',
}

export enum NotificationDeliveryLogSearchableColumn {
    RECEIVER_CONTACT = 'deliveryLog.receiverContact',
    FAILURE_CODE = 'deliveryLog.failureCode',
    FAILURE_REASON = 'deliveryLog.failureReason',
    PROVIDER_MESSAGE_ID = 'deliveryLog.providerMessageId',
}

export const NOTIFICATION_DELIVERY_LOG_SEARCHABLE_COLUMNS = [
    NotificationDeliveryLogSearchableColumn.RECEIVER_CONTACT,
    NotificationDeliveryLogSearchableColumn.FAILURE_CODE,
    NotificationDeliveryLogSearchableColumn.FAILURE_REASON,
    NotificationDeliveryLogSearchableColumn.PROVIDER_MESSAGE_ID,
];

export enum NotificationDeliveryLogOrderByColumn {
    CREATED_AT = 'createdAt',
    SENT_AT = 'sentAt',
    RETRY_COUNT = 'retryCount',
}