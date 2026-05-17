import { Test, TestingModule } from '@nestjs/testing';

import { EMAIL_PROVIDER } from './email.const';
import { EmailService } from './email.service';

import type { EmailProvider } from './interface/email-provider.interface';
import type { SendEmailParams } from './interface/send-email-params.interface';

describe('EmailService', () => {
    let emailService: EmailService;

    const sendEmailMock = jest.fn<Promise<void>, [SendEmailParams]>();

    const mockEmailProvider: EmailProvider = {
        sendEmail: sendEmailMock,
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EmailService,
                {
                    provide: EMAIL_PROVIDER,
                    useValue: mockEmailProvider,
                },
            ],
        }).compile();

        emailService = module.get<EmailService>(EmailService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('EmailProvider.sendEmail을 호출해야 한다', async () => {
        const params: SendEmailParams = {
            to: ['test@example.com'],
            subject: '테스트 제목',
            html: '테스트 내용',
        };

        await emailService.sendEmail(params);

        expect(sendEmailMock).toHaveBeenCalledTimes(1);
        expect(sendEmailMock).toHaveBeenCalledWith(params);
    });

    it('EmailProvider에서 에러가 발생하면 그대로 예외를 던져야 한다', async () => {
        const params: SendEmailParams = {
            to: ['test@example.com'],
            subject: '테스트 제목',
            html: '테스트 내용',
        };

        sendEmailMock.mockRejectedValueOnce(new Error('SMTP 발송 실패'));

        await expect(emailService.sendEmail(params)).rejects.toThrow(
            'SMTP 발송 실패',
        );
    });
});