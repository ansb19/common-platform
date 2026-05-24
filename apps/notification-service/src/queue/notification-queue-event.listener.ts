// apps/notification-service/src/queue/notification-queue-event.listener.ts

import {
  InjectQueue,
  OnQueueEvent,
  QueueEventsHost,
  QueueEventsListener,
} from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Job, Queue } from 'bullmq';

import {
  NotificationQueueName,
} from './const/notification-queue.const';
import { NotificationQueueJobData } from './interface/notification-queue-job.interface';
import { logger } from 'libs/common/logger/winston-logger';

abstract class BaseNotificationQueueEventListener extends QueueEventsHost {
  protected constructor(
    private readonly queue: Queue<NotificationQueueJobData>,
    private readonly queueName: string,
  ) {
    super();
  }

  protected async findJob(
    jobId: string,
  ): Promise<Job<NotificationQueueJobData> | undefined> {
    const job = await this.queue.getJob(jobId);

    return job ?? undefined;
  }

  protected async logCompleted(jobId: string): Promise<void> {
    const job = await this.findJob(jobId);

    logger.info('[NotificationQueue] Job completed', {
      queueName: this.queueName,
      jobId,
      jobName: job?.name,
      deliveryLogIdx: job?.data.deliveryLogIdx,
      notificationLogIdx: job?.data.notificationLogIdx,
    });
  }

  protected async logFailed(
    jobId: string,
    failedReason?: string,
  ): Promise<void> {
    const job = await this.findJob(jobId);

    logger.error('[NotificationQueue] Job failed', {
      queueName: this.queueName,
      jobId,
      jobName: job?.name,
      deliveryLogIdx: job?.data.deliveryLogIdx,
      notificationLogIdx: job?.data.notificationLogIdx,
      attemptsMade: job?.attemptsMade,
      failedReason,
    });
  }

  protected async logStalled(jobId: string): Promise<void> {
    const job = await this.findJob(jobId);

    logger.warn('[NotificationQueue] Job stalled', {
      queueName: this.queueName,
      jobId,
      jobName: job?.name,
      deliveryLogIdx: job?.data.deliveryLogIdx,
      notificationLogIdx: job?.data.notificationLogIdx,
      attemptsMade: job?.attemptsMade,
    });
  }
}

@Injectable()
@QueueEventsListener(NotificationQueueName.SMS)
export class SmsQueueEventListener extends BaseNotificationQueueEventListener {
  constructor(
    @InjectQueue(NotificationQueueName.SMS)
    queue: Queue<NotificationQueueJobData>,
  ) {
    super(queue, NotificationQueueName.SMS);
  }

  @OnQueueEvent('completed')
  async onCompleted(event: {
    jobId: string;
    returnvalue: unknown;
    prev?: string;
  }): Promise<void> {
    await this.logCompleted(event.jobId);
  }

  @OnQueueEvent('failed')
  async onFailed(event: {
    jobId: string;
    failedReason: string;
    prev?: string;
  }): Promise<void> {
    await this.logFailed(event.jobId, event.failedReason);
  }

  @OnQueueEvent('stalled')
  async onStalled(event: { jobId: string; prev?: string }): Promise<void> {
    await this.logStalled(event.jobId);
  }
}

@Injectable()
@QueueEventsListener(NotificationQueueName.EMAIL)
export class EmailQueueEventListener extends BaseNotificationQueueEventListener {
  constructor(
    @InjectQueue(NotificationQueueName.EMAIL)
    queue: Queue<NotificationQueueJobData>,
  ) {
    super(queue, NotificationQueueName.EMAIL);
  }

  @OnQueueEvent('completed')
  async onCompleted(event: {
    jobId: string;
    returnvalue: unknown;
    prev?: string;
  }): Promise<void> {
    await this.logCompleted(event.jobId);
  }

  @OnQueueEvent('failed')
  async onFailed(event: {
    jobId: string;
    failedReason: string;
    prev?: string;
  }): Promise<void> {
    await this.logFailed(event.jobId, event.failedReason);
  }

  @OnQueueEvent('stalled')
  async onStalled(event: { jobId: string; prev?: string }): Promise<void> {
    await this.logStalled(event.jobId);
  }
}

@Injectable()
@QueueEventsListener(NotificationQueueName.PUSH)
export class PushQueueEventListener extends BaseNotificationQueueEventListener {
  constructor(
    @InjectQueue(NotificationQueueName.PUSH)
    queue: Queue<NotificationQueueJobData>,
  ) {
    super(queue, NotificationQueueName.PUSH);
  }

  @OnQueueEvent('completed')
  async onCompleted(event: {
    jobId: string;
    returnvalue: unknown;
    prev?: string;
  }): Promise<void> {
    await this.logCompleted(event.jobId);
  }

  @OnQueueEvent('failed')
  async onFailed(event: {
    jobId: string;
    failedReason: string;
    prev?: string;
  }): Promise<void> {
    await this.logFailed(event.jobId, event.failedReason);
  }

  @OnQueueEvent('stalled')
  async onStalled(event: { jobId: string; prev?: string }): Promise<void> {
    await this.logStalled(event.jobId);
  }
}
