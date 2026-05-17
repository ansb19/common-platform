import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { EmailService } from '../email/email.service';
import { SmsService } from '../sms/sms.service';

import { NotificationChannel } from './enum/notification-channel.enum';
import { NotificationService } from './notification.service';

import type { SendNotificationParams } from './interface/send-notification-params.interface';

describe('NotificationService', () => {
    let notificationService: NotificationService;

    const sendEmailMock = jest.fn();
    const sendSmsMock = jest.fn();

    const mockEmailService = {
        sendEmail: sendEmailMock,
    };

    const mockSmsService = {
        sendSms: sendSmsMock,
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                NotificationService,
                {
                    provide: EmailService,
                    useValue: mockEmailService,
                },
                {
                    provide: SmsService,
                    useValue: mockSmsService,
                },
            ],
        }).compile();

        notificationService =
            module.get<NotificationService>(NotificationService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('EMAIL 채널만 발송해야 한다', async () => {
        const params: SendNotificationParams = {
            channels: [NotificationChannel.EMAIL],
            email: {
                to: ['test@example.com'],
                subject: '이메일 테스트',
                html: '<h1>테스트</h1>',
                cc: ['cc@example.com'],
                bcc: ['bcc@example.com'],
            },
        };

        sendEmailMock.mockResolvedValueOnce(undefined);

        await notificationService.sendNotification(params);

        expect(sendEmailMock).toHaveBeenCalledTimes(1);
        expect(sendEmailMock).toHaveBeenCalledWith({
            to: params.email!.to,
            subject: params.email!.subject,
            html: params.email!.html,
            text: params.email!.text,
            cc: params.email!.cc,
            bcc: params.email!.bcc,
        });

        expect(sendSmsMock).not.toHaveBeenCalled();
    });

    it('SMS 채널만 발송해야 한다', async () => {
        const params: SendNotificationParams = {
            channels: [NotificationChannel.SMS],
            sms: {
                to: ['01012345678'],
                from: '0212345678',
                text: '문자 테스트',
            },
        };

        sendSmsMock.mockResolvedValueOnce({
            successCount: 1,
            failedCount: 0,
            providerMessageId: 'sms-test-id',
        });

        await notificationService.sendNotification(params);

        expect(sendSmsMock).toHaveBeenCalledTimes(1);
        expect(sendSmsMock).toHaveBeenCalledWith({
            to: params.sms!.to,
            from: params.sms!.from,
            text: params.sms!.text,
        });

        expect(sendEmailMock).not.toHaveBeenCalled();
    });

    it('EMAIL + SMS 채널을 함께 발송해야 한다', async () => {
        const params: SendNotificationParams = {
            channels: [NotificationChannel.EMAIL, NotificationChannel.SMS],
            email: {
                to: ['test@example.com'],
                subject: '이메일 테스트',
                text: '이메일 본문',
            },
            sms: {
                to: ['01012345678'],
                from: '0212345678',
                text: '문자 테스트',
            },
        };

        sendEmailMock.mockResolvedValueOnce(undefined);
        sendSmsMock.mockResolvedValueOnce({
            successCount: 1,
            failedCount: 0,
            providerMessageId: 'sms-test-id',
        });

        await notificationService.sendNotification(params);

        expect(sendEmailMock).toHaveBeenCalledTimes(1);
        expect(sendSmsMock).toHaveBeenCalledTimes(1);
    });

    it('channels가 비어 있으면 예외를 던져야 한다', async () => {
        const params: SendNotificationParams = {
            channels: [],
        };

        await expect(
            notificationService.sendNotification(params),
        ).rejects.toThrow(BadRequestException);

        expect(sendEmailMock).not.toHaveBeenCalled();
        expect(sendSmsMock).not.toHaveBeenCalled();
    });

    it('EMAIL 채널인데 email 데이터가 없으면 예외를 던져야 한다', async () => {
        const params: SendNotificationParams = {
            channels: [NotificationChannel.EMAIL],
        };

        await expect(
            notificationService.sendNotification(params),
        ).rejects.toThrow(BadRequestException);

        expect(sendEmailMock).not.toHaveBeenCalled();
    });

    it('EMAIL 제목이 없으면 예외를 던져야 한다', async () => {
        const params = {
            channels: [NotificationChannel.EMAIL],
            email: {
                to: ['test@example.com'],
                subject: '',
                html: '<h1>테스트</h1>',
            },
        } satisfies SendNotificationParams;

        await expect(
            notificationService.sendNotification(params),
        ).rejects.toThrow(BadRequestException);

        expect(sendEmailMock).not.toHaveBeenCalled();
    });

    it('EMAIL 본문이 없으면 예외를 던져야 한다', async () => {
        const params = {
            channels: [NotificationChannel.EMAIL],
            email: {
                to: ['test@example.com'],
                subject: '이메일 테스트',
            },
        } satisfies SendNotificationParams;

        await expect(
            notificationService.sendNotification(params),
        ).rejects.toThrow(BadRequestException);

        expect(sendEmailMock).not.toHaveBeenCalled();
    });

    it('SMS 채널인데 sms 데이터가 없으면 예외를 던져야 한다', async () => {
        const params: SendNotificationParams = {
            channels: [NotificationChannel.SMS],
        };

        await expect(
            notificationService.sendNotification(params),
        ).rejects.toThrow(BadRequestException);

        expect(sendSmsMock).not.toHaveBeenCalled();
    });

    it('SMS 내용이 없으면 예외를 던져야 한다', async () => {
        const params = {
            channels: [NotificationChannel.SMS],
            sms: {
                to: ['01012345678'],
                from: '0212345678',
                text: '',
            },
        } satisfies SendNotificationParams;

        await expect(
            notificationService.sendNotification(params),
        ).rejects.toThrow(BadRequestException);

        expect(sendSmsMock).not.toHaveBeenCalled();
    });

    it('PUSH 채널은 아직 구현되지 않았으므로 예외를 던져야 한다', async () => {
        const params: SendNotificationParams = {
            channels: [NotificationChannel.PUSH],
            push: {
                deviceTokens: ['device-token'],
                title: '푸시 제목',
                body: '푸시 내용',
            },
        };

        await expect(
            notificationService.sendNotification(params),
        ).rejects.toThrow(BadRequestException);
    });
});