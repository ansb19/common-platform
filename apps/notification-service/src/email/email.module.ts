import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';
import { join } from 'path';

import { EMAIL_PROVIDER } from './email.const';
import { EmailService } from './email.service';
import { SmtpEmailProvider } from './provider/smtp-email.provider';

@Module({
    imports: [
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                transport: {
                    host: configService.getOrThrow<string>('EMAIL_SMTP_HOST'),
                    port: configService.getOrThrow<number>('EMAIL_SMTP_PORT'),
                    secure: configService.get<string>('EMAIL_SMTP_SECURE') === 'true',
                    auth: {
                        user: configService.getOrThrow<string>('EMAIL_SMTP_USER'),
                        pass: configService.getOrThrow<string>('EMAIL_SMTP_PASSWORD'),
                    },
                },
                defaults: {
                    from: `"${configService.get<string>('EMAIL_DEFAULT_FROM_NAME') ?? 'Notification'}" <${configService.getOrThrow<string>('EMAIL_SMTP_USER')}>`,
                },
                template: {
                    dir:
                        configService.get<string>('NODE_ENV') === 'production'
                            ? join(__dirname, 'template')
                            : join(
                                process.cwd(),
                                'apps',
                                'notification-service',
                                'src',
                                'email',
                                'template',
                            ),
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true,
                    },
                },
            }),
        }),
    ],
    providers: [
        EmailService,
        {
            provide: EMAIL_PROVIDER,
            useClass: SmtpEmailProvider,
        },
    ],
    exports: [EmailService],
})
export class EmailModule { }