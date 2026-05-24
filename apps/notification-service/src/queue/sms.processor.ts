// apps/notification-service/src/queue/sms.processor.ts

import { Injectable } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, UnrecoverableError } from 'bullmq';

import { SmsService } from '../sms/sms.service';
import { NotificationLogService } from '../log/notification-log.service';
import { NotificationDeliveryStatus } from '../notification/enum/notification-delivery-status.enum';

import {
  NotificationQueueConfig,
  NotificationQueueName,
} from './const/notification-queue.const';
import { NotificationQueueJobData } from './interface/notification-queue-job.interface';

@Processor(NotificationQueueName.SMS, {
  concurrency: NotificationQueueConfig.SMS.BATCH_SIZE,
  limiter: {
    max: NotificationQueueConfig.SMS.LIMITER_MAX,
    duration: NotificationQueueConfig.SMS.LIMITER_DURATION,
  },
})
@Injectable()
export class SmsProcessor extends WorkerHost {
  constructor(
    private readonly notificationLogService: NotificationLogService,
    private readonly smsService: SmsService,
  ) {
    super();
  }

  /**
   * SMS 발송 Job 처리
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
        throw new UnrecoverableError('문자 수신 번호가 없습니다.');
      }

      const smsFrom = notificationLog.metadata?.smsFrom;

      if (typeof smsFrom !== 'string' || !smsFrom) {
        throw new UnrecoverableError('문자 발신번호가 없습니다.');
      }

      await this.smsService.sendSms({
        to: [deliveryLog.receiverContact],
        from: smsFrom,
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

    return '알 수 없는 SMS 발송 오류입니다.';
  }

  private isLastAttempt(job: Job<NotificationQueueJobData>): boolean {
    return job.attemptsMade + 1 >= (job.opts.attempts ?? 1);
  }
}
