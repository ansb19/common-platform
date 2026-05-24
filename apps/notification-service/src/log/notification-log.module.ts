// apps/notification-service/src/log/notification-log.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';


import { NotificationLogController } from './notification-log.controller';
import { NotificationLogService } from './notification-log.service';
import { NotificationLog } from './entity/notification-log.entity';
import { NotificationDeliveryLog } from './entity/notification-delivery-log.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            NotificationLog,
            NotificationDeliveryLog,
        ]),
    ],
    controllers: [
        NotificationLogController,
    ],
    providers: [
        NotificationLogService,
    ],
    exports: [
        NotificationLogService,
    ],
})
export class NotificationLogModule { }