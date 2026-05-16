import { Inject, Injectable } from '@nestjs/common';

import { EMAIL_PROVIDER } from './email.const';

import type { EmailProvider } from './interface/email-provider.interface';
import { SendEmailParams } from './interface/send-email-params.interface';

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