// apps/notification-service/src/queue/notification-queue.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';

import { EmailModule } from '../email/email.module';
import { SmsModule } from '../sms/sms.module';
import { NotificationLogModule } from '../log/notification-log.module';

import { EmailProcessor } from './email.processor';
import { SmsProcessor } from './sms.processor';
import { PushProcessor } from './push.processor';
import { NotificationQueueProducer } from './notification-queue.producer';
import {
  NotificationQueueConfig,
  NotificationQueueName,
} from './const/notification-queue.const';
import {
  EmailQueueEventListener,
  PushQueueEventListener,
  SmsQueueEventListener,
} from './notification-queue-event.listener';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.getOrThrow<string>('NOTIFICATION_REDIS_HOST'),
          port: configService.getOrThrow<number>('NOTIFICATION_REDIS_PORT'),
          password:
            configService.get<string>('NOTIFICATION_REDIS_PASSWORD') ||
            undefined,
        },
        prefix: 'notification',
      }),
    }),

    BullModule.registerQueue(
      {
        name: NotificationQueueName.SMS,
        defaultJobOptions: {
          attempts: NotificationQueueConfig.SMS.RETRY,
          backoff: {
            type: 'exponential',
            delay: NotificationQueueConfig.SMS.RETRY_TERM,
          },
          removeOnComplete: NotificationQueueConfig.SMS.IS_REMOVE_ON_COMPLETE,
          removeOnFail: {
            age: NotificationQueueConfig.SMS.REMOVE_ON_FAIL_AGE,
            count: NotificationQueueConfig.SMS.REMOVE_ON_FAIL_COUNT,
          },
        },
      },
      {
        name: NotificationQueueName.EMAIL,
        defaultJobOptions: {
          attempts: NotificationQueueConfig.EMAIL.RETRY,
          backoff: {
            type: 'exponential',
            delay: NotificationQueueConfig.EMAIL.RETRY_TERM,
          },
          removeOnComplete: NotificationQueueConfig.EMAIL.IS_REMOVE_ON_COMPLETE,
          removeOnFail: {
            age: NotificationQueueConfig.EMAIL.REMOVE_ON_FAIL_AGE,
            count: NotificationQueueConfig.EMAIL.REMOVE_ON_FAIL_COUNT,
          },
        },
      },
      {
        name: NotificationQueueName.PUSH,
        defaultJobOptions: {
          attempts: NotificationQueueConfig.PUSH.RETRY,
          backoff: {
            type: 'exponential',
            delay: NotificationQueueConfig.PUSH.RETRY_TERM,
          },
          removeOnComplete: NotificationQueueConfig.PUSH.IS_REMOVE_ON_COMPLETE,
          removeOnFail: {
            age: NotificationQueueConfig.PUSH.REMOVE_ON_FAIL_AGE,
            count: NotificationQueueConfig.PUSH.REMOVE_ON_FAIL_COUNT,
          },
        },
      },
    ),

    NotificationLogModule,
    SmsModule,
    EmailModule,
  ],
  providers: [
    NotificationQueueProducer,
    SmsProcessor,
    EmailProcessor,
    PushProcessor,

    SmsQueueEventListener,
    EmailQueueEventListener,
    PushQueueEventListener,
  ],
  exports: [NotificationQueueProducer],
})
export class NotificationQueueModule {}
