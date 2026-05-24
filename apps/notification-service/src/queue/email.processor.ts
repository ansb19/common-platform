// apps/notification-service/src/queue/email.processor.ts

import { Injectable } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, UnrecoverableError } from 'bullmq';

import { EmailService } from '../email/email.service';
import { NotificationLogService } from '../log/notification-log.service';
import { NotificationDeliveryStatus } from '../notification/enum/notification-delivery-status.enum';

import {
  NotificationQueueConfig,
  NotificationQueueName,
} from './const/notification-queue.const';
import { NotificationQueueJobData } from './interface/notification-queue-job.interface';

@Processor(NotificationQueueName.EMAIL, {
  concurrency: NotificationQueueConfig.EMAIL.BATCH_SIZE,
  limiter: {
    max: NotificationQueueConfig.EMAIL.LIMITER_MAX,
    duration: NotificationQueueConfig.EMAIL.LIMITER_DURATION,
  },
})
@Injectable()
export class EmailProcessor extends WorkerHost {
  constructor(
    private readonly notificationLogService: NotificationLogService,
    private readonly emailService: EmailService,
  ) {
    super();
  }

  /**
   * EMAIL 발송 Job 처리
   */
  async process(job: Job<NotificationQueueJobData>): Promise<void> {
    const { notificationLogIdx, deliveryLogIdx } = job.data;

    const notificationLog =
      await this.notificationLogService.getNotificationLogByIdx(
        notificationLogIdx,
      );

    const deliveryLog =
      await this.notificationLogService.getDeliveryLogByIdx(deliveryLogIdx);

    try {
      if (deliveryLog.status === NotificationDeliveryStatus.PENDING) {
        await this.notificationLogService.updateDeliveryLogStatus({
          idx: deliveryLog.idx,
          status: NotificationDeliveryStatus.PROCESSING,
        });
      }

      if (!deliveryLog.receiverContact) {
        throw new UnrecoverableError('이메일 수신 주소가 없습니다.');
      }

      if (!notificationLog.title) {
        throw new UnrecoverableError('이메일 제목이 없습니다.');
      }

      await this.emailService.sendEmail({
        to: [deliveryLog.receiverContact],
        subject: notificationLog.title,
        html: notificationLog.content,
        text: notificationLog.content,
      });

      await this.notificationLogService.markDeliveryAsSent(deliveryLog.idx);
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

    return 'UNKNOWN_ERROR';
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    return '알 수 없는 EMAIL 발송 오류입니다.';
  }

  private isLastAttempt(job: Job<NotificationQueueJobData>): boolean {
    return job.attemptsMade + 1 >= (job.opts.attempts ?? 1);
  }
}
