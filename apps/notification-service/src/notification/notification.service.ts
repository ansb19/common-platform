import {
    BadRequestException,
    Injectable,
} from '@nestjs/common';

import { NotificationChannel } from './enum/notification-channel.enum';
import { NotificationDeliveryStatus } from './enum/notification-delivery-status.enum';
import { NotificationLogStatus } from './enum/notification-log-status.enum';

import type { SendNotificationParams } from './interface/send-notification-params.interface';

import { NotificationLogService } from '../notification-log/notification-log.service';
import { NotificationTemplateService } from '../notification-template/notification-template.service';
import { NotificationQueueProducer } from '../queue/notification-queue.producer';

// - 알림 발송 요청 처리
// - templateCode가 있으면 템플릿 조회
// - 템플릿 변수 검증
// - 템플릿 변수 치환
// - notification_logs 생성
// - 수신자별 notification_delivery_logs 생성
// - 채널별 Queue 적재
// - 발송 요청 상태 관리
@Injectable()
export class NotificationService {
    constructor(
        private readonly notificationTemplateService: NotificationTemplateService,
        private readonly notificationLogService: NotificationLogService,
        private readonly notificationQueueProducer: NotificationQueueProducer,
    ) { }

    async sendNotification(
        params: SendNotificationParams,
    ): Promise<void> {
        this.validateBaseParams(params);

        const resolvedParams = params.templateCode
            ? await this.resolveTemplateParams(params)
            : params;

        this.validateChannelParams(resolvedParams);

        const notificationLog =
            await this.notificationLogService.createNotificationLog({
                requestId: resolvedParams.requestId ?? null,
                channels: resolvedParams.channels,
                templateCode: resolvedParams.templateCode ?? null,
                status: NotificationLogStatus.PENDING,
            });

        const deliveryLogs =
            await this.notificationLogService.createDeliveryLogs(
                this.createDeliveryLogParams(
                    notificationLog.idx,
                    resolvedParams,
                ),
            );

        await this.notificationQueueProducer.addSendNotificationJobs({
            notificationLogIdx: notificationLog.idx,
            deliveryLogIdxs: deliveryLogs.map((log) => log.idx),
            channels: resolvedParams.channels,
        });

        await this.notificationLogService.updateNotificationLogStatus(
            notificationLog.idx,
            NotificationLogStatus.PROCESSING,
        );
    }

    private validateBaseParams(
        params: SendNotificationParams,
    ): void {
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

    private validateChannelParams(
        params: SendNotificationParams,
    ): void {
        for (const channel of params.channels) {
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
                    throw new BadRequestException(
                        '지원하지 않는 알림 채널입니다.',
                    );
            }
        }
    }

    private validateEmailParams(
        params: SendNotificationParams,
    ): void {
        if (!params.email) {
            throw new BadRequestException(
                'EMAIL 데이터가 필요합니다.',
            );
        }

        if (!params.email.to.length) {
            throw new BadRequestException(
                '이메일 수신자가 필요합니다.',
            );
        }

        if (!params.email.subject) {
            throw new BadRequestException(
                '이메일 제목이 필요합니다.',
            );
        }

        if (!params.email.html && !params.email.text) {
            throw new BadRequestException(
                '이메일 본문이 필요합니다.',
            );
        }
    }

    private validateSmsParams(
        params: SendNotificationParams,
    ): void {
        if (!params.sms) {
            throw new BadRequestException(
                'SMS 데이터가 필요합니다.',
            );
        }

        if (!params.sms.to.length) {
            throw new BadRequestException(
                '문자 수신자가 필요합니다.',
            );
        }

        if (!params.sms.from) {
            throw new BadRequestException(
                '문자 발신번호가 필요합니다.',
            );
        }

        if (!params.sms.text) {
            throw new BadRequestException(
                '문자 내용이 필요합니다.',
            );
        }
    }

    private validatePushParams(
        params: SendNotificationParams,
    ): void {
        if (!params.push) {
            throw new BadRequestException(
                'PUSH 데이터가 필요합니다.',
            );
        }

        if (!params.push.deviceTokens.length) {
            throw new BadRequestException(
                '푸시 수신 토큰이 필요합니다.',
            );
        }

        if (!params.push.title) {
            throw new BadRequestException(
                '푸시 제목이 필요합니다.',
            );
        }

        if (!params.push.body) {
            throw new BadRequestException(
                '푸시 내용이 필요합니다.',
            );
        }
    }

    private async resolveTemplateParams(
        params: SendNotificationParams,
    ): Promise<SendNotificationParams> {
        const template =
            await this.notificationTemplateService.getTemplateByCode(
                params.templateCode!,
            );

        this.notificationTemplateService.validateTemplateVariables({
            template,
            variables: params.variables ?? {},
        });

        const title = this.notificationTemplateService.replaceVariables(
            template.title,
            params.variables ?? {},
        );

        const content = this.notificationTemplateService.replaceVariables(
            template.content,
            params.variables ?? {},
        );

        return {
            ...params,

            email: params.email
                ? {
                    ...params.email,
                    subject: params.email.subject || title,
                    html: params.email.html
                        ? this.notificationTemplateService.replaceVariables(
                            params.email.html,
                            params.variables ?? {},
                        )
                        : content,
                    text: params.email.text
                        ? this.notificationTemplateService.replaceVariables(
                            params.email.text,
                            params.variables ?? {},
                        )
                        : content,
                }
                : undefined,

            sms: params.sms
                ? {
                    ...params.sms,
                    text: params.sms.text
                        ? this.notificationTemplateService.replaceVariables(
                            params.sms.text,
                            params.variables ?? {},
                        )
                        : content,
                }
                : undefined,

            push: params.push
                ? {
                    ...params.push,
                    title: params.push.title || title,
                    body: params.push.body || content,
                }
                : undefined,
        };
    }

    private createDeliveryLogParams(
        notificationLogIdx: number,
        params: SendNotificationParams,
    ) {
        const deliveryLogs: {
            notificationLogIdx: number;
            channel: NotificationChannel;
            receiver: string;
            status: NotificationDeliveryStatus;
        }[] = [];

        if (params.channels.includes(NotificationChannel.EMAIL) && params.email) {
            for (const to of params.email.to) {
                deliveryLogs.push({
                    notificationLogIdx,
                    channel: NotificationChannel.EMAIL,
                    receiver: to,
                    status: NotificationDeliveryStatus.PENDING,
                });
            }
        }

        if (params.channels.includes(NotificationChannel.SMS) && params.sms) {
            for (const to of params.sms.to) {
                deliveryLogs.push({
                    notificationLogIdx,
                    channel: NotificationChannel.SMS,
                    receiver: to,
                    status: NotificationDeliveryStatus.PENDING,
                });
            }
        }

        if (params.channels.includes(NotificationChannel.PUSH) && params.push) {
            for (const deviceToken of params.push.deviceTokens) {
                deliveryLogs.push({
                    notificationLogIdx,
                    channel: NotificationChannel.PUSH,
                    receiver: deviceToken,
                    status: NotificationDeliveryStatus.PENDING,
                });
            }
        }

        return deliveryLogs;
    }
}