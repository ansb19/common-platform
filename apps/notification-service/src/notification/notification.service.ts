import {
    BadRequestException,
    Injectable,
} from '@nestjs/common';

import { EmailService } from '../email/email.service';
import { SmsService } from '../sms/sms.service';

import { NotificationChannel } from './enum/notification-channel.enum';

import type { SendNotificationParams } from './interface/send-notification-params.interface';


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
        private readonly emailService: EmailService,
        private readonly smsService: SmsService,
    ) { }

    async sendNotification(
        params: SendNotificationParams,
    ): Promise<void> {
        if (!params.channels.length) {
            throw new BadRequestException('알림 채널이 필요합니다.');
        }

        const tasks: Promise<unknown>[] = [];

        for (const channel of params.channels) {
            switch (channel) {
                case NotificationChannel.EMAIL:
                    this.validateEmailParams(params);

                    tasks.push(
                        this.emailService.sendEmail({
                            to: params.email!.to,
                            subject: params.email!.subject,
                            html: params.email!.html,
                            text: params.email!.text,
                            cc: params.email!.cc,
                            bcc: params.email!.bcc,
                        }),
                    );
                    break;

                case NotificationChannel.SMS:
                    this.validateSmsParams(params);

                    tasks.push(
                        this.smsService.sendSms({
                            to: params.sms!.to,
                            from: params.sms!.from,
                            text: params.sms!.text,
                        }),
                    );
                    break;

                case NotificationChannel.PUSH:
                    throw new BadRequestException(
                        'PUSH 채널은 아직 구현되지 않았습니다.',
                    );

                default:
                    throw new BadRequestException(
                        '지원하지 않는 알림 채널입니다.',
                    );
            }
        }

        await Promise.all(tasks);
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
}