import { Module } from '@nestjs/common';
import { SmsModule } from '../sms/sms.module';
import { EmailModule } from '../email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationTemplate } from '../template/entity/notification-template.entity';
import { NotificationLog } from '../log/entity/notification-log.entity';
import { NotificationDeviceToken } from './entity/notification-device-token.entity';
import { NotificationDeliveryLog } from '../log/entity/notification-delivery-log.entity';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { NotificationLogModule } from '../log/notification-log.module';
import { NotificationTemplateModule } from '../template/notification-template.module';


@Module({
    imports: [
        SmsModule,
        EmailModule,
        TypeOrmModule.forFeature([
            NotificationTemplate,
            NotificationLog,
            NotificationDeviceToken,
            NotificationDeliveryLog,
        ]),
        NotificationLogModule,
        NotificationTemplateModule,
    ],
    providers: [NotificationService],
    controllers: [NotificationController],
})
export class NotificationModule { }
