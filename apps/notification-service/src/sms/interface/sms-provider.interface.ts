import { SendSmsParams } from './send-sms-params.interface';
import { SmsSendResult } from './sms-send-result.interface';

export interface SmsProvider {
    sendSms(params: SendSmsParams): Promise<SmsSendResult>;
}