import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EmailProvider } from '../interface/email-provider.interface';
import { SendEmailParams } from '../interface/send-email-params.interface';
import { PROJECT_NAME } from 'libs/common/const/project.const';

@Injectable()
export class SmtpEmailProvider implements EmailProvider {
    constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,
    ) { }

    async sendEmail(params: SendEmailParams): Promise<void> {
        const smtpUser = this.configService.getOrThrow<string>('EMAIL_SMTP_USER');

        const defaultFromName =
            this.configService.get<string>('EMAIL_DEFAULT_FROM_NAME') ??
            PROJECT_NAME.COMMON_PLATFORM;

        await this.mailerService.sendMail({
            to: params.to,
            subject: params.subject,

            from: {
                name: params.fromName ?? defaultFromName,
                address: smtpUser,
            },

            ...(params.html && {
                html: params.html,
            }),

            ...(params.template && {
                template: params.template,
            }),

            ...(params.context && {
                context: params.context,
            }),

            ...(params.bcc?.length && {
                bcc: params.bcc,
            }),

            ...(params.attachments?.length && {
                attachments: params.attachments,
            }),
        });
    }
}