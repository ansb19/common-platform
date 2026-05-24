// apps/notification-service/src/queue/notification-queue.producer.ts

import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

import { NotificationChannel } from '../notification/enum/notification-channel.enum';

import {
  NotificationPriority,
  NotificationQueueJobName,
  NotificationQueueName,
} from './const/notification-queue.const';
import { AddSendNotificationJobsParams, NotificationQueueJobData } from './interface/notification-queue-job.interface';



@Injectable()
export class NotificationQueueProducer {
  constructor(
    @InjectQueue(NotificationQueueName.SMS)
    private readonly smsQueue: Queue<NotificationQueueJobData>,

    @InjectQueue(NotificationQueueName.EMAIL)
    private readonly emailQueue: Queue<NotificationQueueJobData>,

    @InjectQueue(NotificationQueueName.PUSH)
    private readonly pushQueue: Queue<NotificationQueueJobData>,
  ) {}

  /**
   * 수신자별 delivery log를 채널별 Queue에 적재합니다.
   */
  async addSendNotificationJobs(
    params: AddSendNotificationJobsParams,
  ): Promise<void> {
    if (!params.deliveryLogs.length) {
      return;
    }

    const smsJobs = params.deliveryLogs
      .filter((log) => log.channel === NotificationChannel.SMS)
      .map((log) =>
        this.createJobPayload({
          jobName: NotificationQueueJobName.SEND_SMS,
          notificationLogIdx: params.notificationLogIdx,
          deliveryLogIdx: log.idx,
          priority: log.priority,
        }),
      );

    const emailJobs = params.deliveryLogs
      .filter((log) => log.channel === NotificationChannel.EMAIL)
      .map((log) =>
        this.createJobPayload({
          jobName: NotificationQueueJobName.SEND_EMAIL,
          notificationLogIdx: params.notificationLogIdx,
          deliveryLogIdx: log.idx,
          priority: log.priority,
        }),
      );

    const pushJobs = params.deliveryLogs
      .filter((log) => log.channel === NotificationChannel.PUSH)
      .map((log) =>
        this.createJobPayload({
          jobName: NotificationQueueJobName.SEND_PUSH,
          notificationLogIdx: params.notificationLogIdx,
          deliveryLogIdx: log.idx,
          priority: log.priority,
        }),
      );

    await Promise.all([
      smsJobs.length ? this.smsQueue.addBulk(smsJobs) : Promise.resolve(),

      emailJobs.length ? this.emailQueue.addBulk(emailJobs) : Promise.resolve(),

      pushJobs.length ? this.pushQueue.addBulk(pushJobs) : Promise.resolve(),
    ]);
  }

  private createJobPayload(params: {
    jobName: string;
    notificationLogIdx: number;
    deliveryLogIdx: number;
    priority?: number;
  }) {
    const priority =
      typeof params.priority === 'number'
        ? params.priority
        : NotificationPriority.DEFAULT;

    return {
      name: params.jobName,
      data: {
        notificationLogIdx: params.notificationLogIdx,
        deliveryLogIdx: params.deliveryLogIdx,
        priority,
      },
      opts: {
        priority,
      },
    };
  }

}
