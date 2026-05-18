import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@common-platform/database';
import { DATABASE_SERVICE } from 'libs/common/const/database.const';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    DatabaseModule.forRoot(DATABASE_SERVICE.NOTIFICATION),
    NotificationModule,
  ],

})
export class NotificationServiceModule { }
