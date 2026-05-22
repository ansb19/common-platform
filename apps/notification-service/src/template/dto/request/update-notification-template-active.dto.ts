// apps/notification-service/src/notification-template/dto/update-notification-template-active.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

import { TransBoolean } from 'libs/common/decorator/trans-boolean.decorator';

export class UpdateNotificationTemplateActiveDto {
    @ApiProperty({
        description: '활성 여부',
        example: true,
        type: Boolean,
    })
    @TransBoolean()
    @IsBoolean({ message: 'isActive는 boolean이어야 합니다.' })
    isActive!: boolean;
}