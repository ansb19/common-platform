// apps/notification-service/src/notification/notification.service.ts

import { BadRequestException, Injectable } from '@nestjs/common';

import { NotificationChannel } from './enum/notification-channel.enum';
import { NotificationDeliveryStatus } from './enum/notification-delivery-status.enum';
import { NotificationLogStatus } from './enum/notification-log-status.enum';

import type { SendNotificationParams } from './interface/send-notification-params.interface';

import { NotificationQueueProducer } from '../queue/notification-queue.producer';
import { NotificationLogService } from '../log/notification-log.service';
import { NotificationTemplateService } from '../template/notification-template.service';
import { NotificationLog } from '../log/entity/notification-log.entity';
import { CreateNotificationDeliveryLogParams } from '../log/notification-log.interface';

type ResolvedNotificationParams = SendNotificationParams & {
  channels: [NotificationChannel];
  title: string | null;
  content: string;
};

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationTemplateService: NotificationTemplateService,
    private readonly notificationLogService: NotificationLogService,
    private readonly notificationQueueProducer: NotificationQueueProducer,
  ) {}

  /**
   * 알림 발송 요청 처리
   *
   * - 다중 채널 요청은 채널별 요청으로 분리한다.
   * - notification_logs는 채널당 1개 생성한다.
   * - notification_delivery_logs는 수신자당 1개 생성한다.
   * - Queue Job은 deliveryLog 단위로 적재한다.
   */
  async sendNotification(params: SendNotificationParams): Promise<void> {
    this.validateBaseParams(params);

    const resolvedParamsList = params.templateCode
      ? await this.resolveTemplateParams(params)
      : this.resolveDirectParams(params);

    for (const resolvedParams of resolvedParamsList) {
      this.validateResolvedParams(resolvedParams);

      const channel = resolvedParams.channels[0];

      const notificationLog =
        await this.notificationLogService.createNotificationLog({
          projectName: resolvedParams.projectName,
          requestId: resolvedParams.requestId ?? null,
          templateIdx: resolvedParams.templateIdx ?? null,
          senderRefType: resolvedParams.senderRefType ?? null,
          senderRefIdx: resolvedParams.senderRefIdx ?? null,
          channel,
          title: resolvedParams.title,
          content: resolvedParams.content,
          templateVariables: resolvedParams.variables ?? null,
          receiverRefIdxs: resolvedParams.receiverRefIdxs ?? null,
          fileUuids: resolvedParams.fileUuids ?? null,
          linkUrl: resolvedParams.linkUrl ?? null,
          priority: resolvedParams.priority,
          isSystem: resolvedParams.isSystem ?? false,
          status: NotificationLogStatus.PENDING,
          targetCount: this.getTargetCount(resolvedParams),
          metadata: this.createNotificationMetadata(resolvedParams),
        });

      const deliveryLogs = await this.notificationLogService.createDeliveryLogs(
        this.createDeliveryLogParams(notificationLog, resolvedParams),
      );

      await this.notificationQueueProducer.addSendNotificationJobs({
        notificationLogIdx: notificationLog.idx,
        deliveryLogs: deliveryLogs.map((deliveryLog) => ({
          idx: deliveryLog.idx,
          channel: deliveryLog.channel,
          priority: resolvedParams.priority,
        })),
      });

      await this.notificationLogService.updateNotificationLogStatus(
        notificationLog.idx,
        NotificationLogStatus.PROCESSING,
      );
    }
  }

  private validateBaseParams(params: SendNotificationParams): void {
    if (!params.projectName) {
      throw new BadRequestException('프로젝트 이름이 필요합니다.');
    }

    if (!params.channels.length) {
      throw new BadRequestException('알림 채널이 필요합니다.');
    }

    const uniqueChannels = new Set(params.channels);

    if (uniqueChannels.size !== params.channels.length) {
      throw new BadRequestException('알림 채널이 중복되었습니다.');
    }

    if (!params.templateCode && !params.email && !params.sms && !params.push) {
      throw new BadRequestException(
        '템플릿 코드 또는 채널별 발송 데이터가 필요합니다.',
      );
    }
  }

  private validateResolvedParams(params: ResolvedNotificationParams): void {
    const channel = params.channels[0];

    switch (channel) {
      case NotificationChannel.EMAIL:
        this.validateEmailParams(params);
        break;

      case NotificationChannel.SMS:
        this.validateSmsParams(params);
        break;

      case NotificationChannel.PUSH:
        this.validatePushParams(params);
        break;

      default:
        throw new BadRequestException('지원하지 않는 알림 채널입니다.');
    }
  }

  private validateEmailParams(params: ResolvedNotificationParams): void {
    if (!params.email) {
      throw new BadRequestException('EMAIL 데이터가 필요합니다.');
    }

    if (!params.email.to.length) {
      throw new BadRequestException('이메일 수신자가 필요합니다.');
    }

    if (!params.title) {
      throw new BadRequestException('이메일 제목이 필요합니다.');
    }

    if (!params.content) {
      throw new BadRequestException('이메일 본문이 필요합니다.');
    }
  }

  private validateSmsParams(params: ResolvedNotificationParams): void {
    if (!params.sms) {
      throw new BadRequestException('SMS 데이터가 필요합니다.');
    }

    if (!params.sms.to.length) {
      throw new BadRequestException('문자 수신자가 필요합니다.');
    }

    if (!params.sms.from) {
      throw new BadRequestException('문자 발신번호가 필요합니다.');
    }

    if (!params.content) {
      throw new BadRequestException('문자 내용이 필요합니다.');
    }
  }

  private validatePushParams(params: ResolvedNotificationParams): void {
    if (!params.push) {
      throw new BadRequestException('PUSH 데이터가 필요합니다.');
    }

    if (!params.push.deviceTokens.length) {
      throw new BadRequestException('푸시 수신 토큰이 필요합니다.');
    }

    if (!params.title) {
      throw new BadRequestException('푸시 제목이 필요합니다.');
    }

    if (!params.content) {
      throw new BadRequestException('푸시 내용이 필요합니다.');
    }
  }

  /**
   * 템플릿 기반 요청을 채널별 resolved params로 변환한다.
   */
  private async resolveTemplateParams(
    params: SendNotificationParams,
  ): Promise<ResolvedNotificationParams[]> {
    if (!params.templateCode) {
      throw new BadRequestException('템플릿 코드가 필요합니다.');
    }

    return Promise.all(
      params.channels.map(async (channel) => {
        const template =
          await this.notificationTemplateService.getTemplateByCode({
            projectName: params.projectName,
            code: params.templateCode!,
            channel,
          });

        this.notificationTemplateService.validateTemplateVariables({
          template,
          variables: params.variables ?? {},
        });

        const title = this.notificationTemplateService.replaceVariables(
          template.title ?? '',
          params.variables ?? {},
        );

        const content = this.notificationTemplateService.replaceVariables(
          template.content,
          params.variables ?? {},
        );

        return {
          ...params,
          channels: [channel],
          templateIdx: template.idx,
          title,
          content,
        };
      }),
    );
  }

  /**
   * 직접 발송 요청을 채널별 resolved params로 변환한다.
   */
  private resolveDirectParams(
    params: SendNotificationParams,
  ): ResolvedNotificationParams[] {
    return params.channels.map((channel) => {
      switch (channel) {
        case NotificationChannel.EMAIL:
          return {
            ...params,
            channels: [channel],
            title: params.email?.subject ?? params.title ?? null,
            content:
              params.email?.html ?? params.email?.text ?? params.content ?? '',
          };

        case NotificationChannel.SMS:
          return {
            ...params,
            channels: [channel],
            title: params.title ?? null,
            content: params.sms?.text ?? params.content ?? '',
          };

        case NotificationChannel.PUSH:
          return {
            ...params,
            channels: [channel],
            title: params.push?.title ?? params.title ?? null,
            content: params.push?.body ?? params.content ?? '',
          };

        default:
          throw new BadRequestException('지원하지 않는 알림 채널입니다.');
      }
    });
  }

  /**
   * 수신자별 delivery log 생성 파라미터를 만든다.
   */
  private createDeliveryLogParams(
    notificationLog: NotificationLog,
    params: ResolvedNotificationParams,
  ): CreateNotificationDeliveryLogParams[] {
    const channel = params.channels[0];

    if (channel === NotificationChannel.EMAIL) {
      return (params.email?.to ?? []).map((to, index) => ({
        notificationLogIdx: notificationLog.idx,
        notificationLogCreatedAt: notificationLog.createdAt,
        projectName: params.projectName,
        receiverRefType: params.receiverRefType ?? 'EMAIL',
        receiverRefIdx: this.getReceiverRefIdx(params, index),
        receiverContact: to,
        channel,
        status: NotificationDeliveryStatus.PENDING,
        metadata: params.metadata ?? null,
      }));
    }

    if (channel === NotificationChannel.SMS) {
      return (params.sms?.to ?? []).map((to, index) => ({
        notificationLogIdx: notificationLog.idx,
        notificationLogCreatedAt: notificationLog.createdAt,
        projectName: params.projectName,
        receiverRefType: params.receiverRefType ?? 'PHONE',
        receiverRefIdx: this.getReceiverRefIdx(params, index),
        receiverContact: to,
        channel,
        status: NotificationDeliveryStatus.PENDING,
        metadata: params.metadata ?? null,
      }));
    }

    if (channel === NotificationChannel.PUSH) {
      return (params.push?.deviceTokens ?? []).map((deviceToken, index) => ({
        notificationLogIdx: notificationLog.idx,
        notificationLogCreatedAt: notificationLog.createdAt,
        projectName: params.projectName,
        receiverRefType: params.receiverRefType ?? 'DEVICE_TOKEN',
        receiverRefIdx: this.getReceiverRefIdx(params, index),
        receiverContact: deviceToken,
        channel,
        status: NotificationDeliveryStatus.PENDING,
        metadata: params.metadata ?? null,
      }));
    }

    throw new BadRequestException('지원하지 않는 알림 채널입니다.');
  }

  private getTargetCount(params: ResolvedNotificationParams): number {
    const channel = params.channels[0];

    if (channel === NotificationChannel.EMAIL) {
      return params.email?.to.length ?? 0;
    }

    if (channel === NotificationChannel.SMS) {
      return params.sms?.to.length ?? 0;
    }

    if (channel === NotificationChannel.PUSH) {
      return params.push?.deviceTokens.length ?? 0;
    }

    return 0;
  }

  private getReceiverRefIdx(
    params: ResolvedNotificationParams,
    index: number,
  ): number | null {
    return params.receiverRefIdxs?.[index] ?? null;
  }

  private createNotificationMetadata(
    params: ResolvedNotificationParams,
  ): Record<string, unknown> | null {
    const channel = params.channels[0];

    return {
      ...(params.metadata ?? {}),

      ...(channel === NotificationChannel.EMAIL
        ? {
            emailCc: params.email?.cc ?? [],
            emailBcc: params.email?.bcc ?? [],
          }
        : {}),

      ...(channel === NotificationChannel.SMS
        ? {
            smsFrom: params.sms?.from,
          }
        : {}),

      ...(channel === NotificationChannel.PUSH
        ? {
            pushData: params.push?.data ?? {},
          }
        : {}),
    };
  }
}
