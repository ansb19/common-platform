// apps/notification-service/src/notification-template/notification-template.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';



import { NotificationTemplateController } from './notification-template.controller';
import { NotificationTemplateService } from './notification-template.service';
import { NotificationTemplate } from './entity/notification-template.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            NotificationTemplate,
        ]),
    ],
    controllers: [
        NotificationTemplateController,
    ],
    providers: [
        NotificationTemplateService,
    ],
    exports: [
        NotificationTemplateService,
    ],
})
export class NotificationTemplateModule { }