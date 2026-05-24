// apps/notification-service/src/queue/const/notification-queue.const.ts

export const NotificationQueueName = {
    SMS: 'smsQueue',
    EMAIL: 'emailQueue',
    PUSH: 'pushQueue',
} as const;

export const NotificationQueueJobName = {
    SEND_SMS: 'sendSms',
    SEND_EMAIL: 'sendEmail',
    SEND_PUSH: 'sendPush',
} as const;

export const NotificationQueueConfig = {
    SMS: {
        RETRY: 3, // 재시도 횟수
        RETRY_TERM: 5000, // 재시도 간격 (ms)
        BATCH_SIZE: 10, // 동시에 처리할 Job 수
        LIMITER_MAX: 40, // 단위 시간당 최대 처리할 Job 수
        LIMITER_DURATION: 1000, // 단위 시간 (ms)
        IS_REMOVE_ON_COMPLETE: true, // 완료된 Job 자동 삭제 여부
        // REMOVE_ON_COMPLETE_COUNT: 1000, // 완료된 Job 중 보관할 최대 개수
        // REMOVE_ON_COMPLETE_AGE: 60 * 60, // 완료된 Job 중 보관할 최대 기간 (초)
        REMOVE_ON_FAIL_COUNT: 1000, // 실패한 Job 중 보관할 최대 개수
        REMOVE_ON_FAIL_AGE: 60 * 60 * 24 * 3, // 실패한 Job 중 보관할 최대 기간 (초)
    },

    EMAIL: {
        RETRY: 3,
        RETRY_TERM: 5000,
        BATCH_SIZE: 10,
        LIMITER_MAX: 50,
        LIMITER_DURATION: 1000,
        IS_REMOVE_ON_COMPLETE: true, // 완료된 Job 자동 삭제 여부
        // REMOVE_ON_COMPLETE_COUNT: 1000,
        // REMOVE_ON_COMPLETE_AGE: 60 * 60,
        REMOVE_ON_FAIL_COUNT: 1000,
        REMOVE_ON_FAIL_AGE: 60 * 60 * 24 * 3,
    },

    PUSH: {
        RETRY: 3,
        RETRY_TERM: 5000,
        BATCH_SIZE: 20,
        LIMITER_MAX: 300,
        LIMITER_DURATION: 1000,
        IS_REMOVE_ON_COMPLETE: true, // 완료된 Job 자동 삭제 여부
        // REMOVE_ON_COMPLETE_COUNT: 3000,
        // REMOVE_ON_COMPLETE_AGE: 60 * 60,
        REMOVE_ON_FAIL_COUNT: 3000,
        REMOVE_ON_FAIL_AGE: 60 * 60 * 24 * 3,
    },
} as const;

export const NotificationPriority = {
    MIN: 1,
    MAX: 999,
    DEFAULT: 5,
    SYSTEM: 2,
} as const;