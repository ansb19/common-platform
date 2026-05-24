import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@common-platform/database';
import { DATABASE_SERVICE } from 'libs/common/const/database.const';
import { NotificationModule } from './notification/notification.module';
import { NotificationLogModule } from './log/notification-log.module';
import { NotificationTemplateModule } from './template/notification-template.module';
import { join } from 'path/win32';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        join(process.cwd(), '.env.development'),
        join(process.cwd(), '.env'),
      ],
    }),

    DatabaseModule.forRoot(DATABASE_SERVICE.NOTIFICATION),
    NotificationModule,
    NotificationLogModule,
    NotificationTemplateModule,
  ],
})
export class NotificationServiceModule {}
