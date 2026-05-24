// apps/notification-service/src/queue/push.processor.ts

import { Injectable } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, UnrecoverableError } from 'bullmq';

import { NotificationLogService } from '../log/notification-log.service';
import { NotificationDeliveryStatus } from '../notification/enum/notification-delivery-status.enum';

import {
  NotificationQueueConfig,
  NotificationQueueName,
} from './const/notification-queue.const';
import { NotificationQueueJobData } from './interface/notification-queue-job.interface';

@Processor(NotificationQueueName.PUSH, {
  concurrency: NotificationQueueConfig.PUSH.BATCH_SIZE,
  limiter: {
    max: NotificationQueueConfig.PUSH.LIMITER_MAX,
    duration: NotificationQueueConfig.PUSH.LIMITER_DURATION,
  },
})
@Injectable()
export class PushProcessor extends WorkerHost {
  constructor(private readonly notificationLogService: NotificationLogService) {
    super();
  }

  /**
   * PUSH 발송 Job 처리
   *
   * TODO:
   * PushService 구현 후 실제 FCM 발송 로직으로 교체합니다.
   */
  async process(job: Job<NotificationQueueJobData>): Promise<void> {
    const { notificationLogIdx, deliveryLogIdx } = job.data;

    const deliveryLog =
      await this.notificationLogService.getDeliveryLogByIdx(deliveryLogIdx);

    try {
      if (deliveryLog.status === NotificationDeliveryStatus.PENDING) {
        await this.notificationLogService.updateDeliveryLogStatus({
          idx: deliveryLog.idx,
          status: NotificationDeliveryStatus.PROCESSING,
        });
      }

      throw new UnrecoverableError('PUSH 채널은 아직 구현되지 않았습니다.');
    } catch (error) {
      const failureCode = this.getErrorCode(error);
      const failureReason = this.getErrorMessage(error);

      if (this.isLastAttempt(job) || error instanceof UnrecoverableError) {
        await this.notificationLogService.markDeliveryAsFailed({
          idx: deliveryLog.idx,
          failureCode,
          failureReason,
        });
      } else {
        await this.notificationLogService.markDeliveryAsRetrying({
          idx: deliveryLog.idx,
          failureCode,
          failureReason,
          retryCount: job.attemptsMade + 1,
        });
      }

      throw error;
    } finally {
      if (
        this.isLastAttempt(job) ||
        deliveryLog.status === NotificationDeliveryStatus.SENT
      ) {
        await this.notificationLogService.refreshNotificationLogSummary(
          notificationLogIdx,
        );
      }
    }
  }

  private getErrorCode(error: unknown): string {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      typeof error.code === 'string'
    ) {
      return error.code;
    }

    return 'PUSH_NOT_IMPLEMENTED';
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    return 'PUSH 발송 기능이 아직 구현되지 않았습니다.';
  }

  private isLastAttempt(job: Job<NotificationQueueJobData>): boolean {
    return job.attemptsMade + 1 >= (job.opts.attempts ?? 1);
  }
}
