import { Injectable } from '@nestjs/common';

import type { SmsProvider } from '../interface/sms-provider.interface';
import type { SendSmsParams } from '../interface/send-sms-params.interface';
import type { SmsSendResult } from '../interface/sms-send-result.interface';


// TODO 아직 구현 안함. 일단 MockSmsProvider로 대체
@Injectable()
export class CoolsmsSmsProvider implements SmsProvider {
    sendSms(params: SendSmsParams): Promise<SmsSendResult> {
        return Promise.resolve({
            successCount: params.to.length,
            failedCount: 0,
            providerMessageId: 'mock-message-id',
        });
    }
}