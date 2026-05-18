import { Inject, Injectable } from '@nestjs/common';

import { EMAIL_PROVIDER } from './email.const';

import type { EmailProvider } from './interface/email-provider.interface';
import { SendEmailParams } from './interface/send-email-params.interface';

// - Email provider 추상화
// - SMTP/SES/SendGrid 등 발송
// - HTML/TEXT 메일 처리
// - 첨부파일 처리
// - email queue processor 처리
// - delivery log 상태 업데이트

@Injectable()
export class EmailService {
    constructor(
        @Inject(EMAIL_PROVIDER)
        private readonly emailProvider: EmailProvider,
    ) { }

    async sendEmail(
        params: SendEmailParams,
    ): Promise<void> {
        await this.emailProvider.sendEmail(params);
    }
}