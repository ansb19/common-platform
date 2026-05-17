import { Module } from '@nestjs/common';
import { NotificationServiceController } from './notification-service.controller';
import { NotificationServiceService } from './notification-service.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@common-platform/database';
import { DATABASE_SERVICE } from 'libs/common/const/database.const';
import { EmailModule } from './email/email.module';
import { SmsModule } from './sms/sms.module';

@Module({
  imports: [
    EmailModule,
    SmsModule,
    
    
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule.forRoot(DATABASE_SERVICE.NOTIFICATION),
  ],

  controllers: [NotificationServiceController],
  providers: [NotificationServiceService],
})
export class NotificationServiceModule { }
