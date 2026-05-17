import { Module } from '@nestjs/common';

import { SMS_PROVIDER } from './sms.const';
import { SmsService } from './sms.service';
import { MockSmsProvider } from './provider/mock-sms.provider';
import { CoolsmsSmsProvider } from './provider/coolsms-sms.provider';
import { AligoSmsProvider } from './provider/aligo-sms.provider';

const smsProviderClass = (() => {
    switch (process.env.SMS_PROVIDER) {
        case 'coolsms':
            return CoolsmsSmsProvider;

        case 'aligo':
            return AligoSmsProvider;

        case 'mock':
        default:
            return MockSmsProvider;
    }
})();

@Module({
    providers: [
        SmsService,
        MockSmsProvider,
        CoolsmsSmsProvider,
        AligoSmsProvider,
        {
            provide: SMS_PROVIDER,
            useClass: smsProviderClass,
        },
    ],
    exports: [SmsService],
})
export class SmsModule { }