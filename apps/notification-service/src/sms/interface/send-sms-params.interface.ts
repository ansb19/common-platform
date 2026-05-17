import { SmsMessageType } from '../enum/sms-message-type.enum';

export interface SendSmsParams {
    to: string[];
    from: string;
    text: string;

    type?: SmsMessageType;
    subject?: string;

    // MMS용
    imageFilePaths?: string[];

    // 추적용
    requestId?: string;
}