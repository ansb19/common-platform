import { Test, TestingModule } from '@nestjs/testing';

import { SMS_PROVIDER } from './sms.const';
import { SmsService } from './sms.service';

import type { SmsProvider } from './interface/sms-provider.interface';
import type { SendSmsParams } from './interface/send-sms-params.interface';
import { SmsMessageType } from './enum/sms-message-type.enum';

describe('SmsService', () => {
    let smsService: SmsService;

    const sendSmsMock = jest.fn();

    const mockSmsProvider: SmsProvider = {
        sendSms: sendSmsMock,
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SmsService,
                {
                    provide: SMS_PROVIDER,
                    useValue: mockSmsProvider,
                },
            ],
        }).compile();

        smsService = module.get<SmsService>(SmsService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('SmsProvider.sendSms를 호출해야 한다', async () => {
        const params: SendSmsParams = {
            to: ['01012345678'],
            from: '0212345678',
            text: '문자 테스트',
            type: SmsMessageType.SMS,
        };

        sendSmsMock.mockResolvedValueOnce({
            successCount: 1,
            failedCount: 0,
            providerMessageId: 'test-id',
        });

        await smsService.sendSms(params);

        expect(sendSmsMock).toHaveBeenCalledTimes(1);
        expect(sendSmsMock).toHaveBeenCalledWith(params);
    });

    it('SmsProvider에서 에러가 발생하면 그대로 예외를 던져야 한다', async () => {
        const params: SendSmsParams = {
            to: ['01012345678'],
            from: '0212345678',
            text: '문자 테스트',
            type: SmsMessageType.SMS,
        };

        sendSmsMock.mockRejectedValueOnce(new Error('SMS 발송 실패'));

        await expect(smsService.sendSms(params)).rejects.toThrow(
            'SMS 발송 실패',
        );
    });
});