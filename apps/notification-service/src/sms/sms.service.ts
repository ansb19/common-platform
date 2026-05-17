import { Inject, Injectable } from '@nestjs/common';

import { SMS_PROVIDER } from './sms.const';
import type { SmsProvider } from './interface/sms-provider.interface';
import type { SendSmsParams } from './interface/send-sms-params.interface';
import type { SmsSendResult } from './interface/sms-send-result.interface';

@Injectable()
export class SmsService {
    constructor(
        @Inject(SMS_PROVIDER)
        private readonly smsProvider: SmsProvider,
    ) { }

    async sendSms(params: SendSmsParams): Promise<SmsSendResult> {
        return this.smsProvider.sendSms(params);
    }
}