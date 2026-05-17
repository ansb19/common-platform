import { Module } from '@nestjs/common';
import { SmsModule } from '../sms/sms.module';
import { EmailModule } from '../email/email.module';


@Module({
    imports: [
        SmsModule,
        EmailModule,


    ],

})
export class NotificationModule { }
