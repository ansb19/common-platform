// apps/notification-service/src/log/dto/request/notification-delivery-log-idx.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import {
    IsDefined,
    IsInt,
    Min,
} from 'class-validator';

import { DefaultValue } from 'libs/common/const/default-value.const';
import { TransNumber } from 'libs/common/decorator/trans-number.decorator';

export class NotificationDeliveryLogIdxDto {
    @ApiProperty({
        description: '알림 수신 결과 로그 IDX',
        example: DefaultValue.IDX,
        minimum: DefaultValue.IDX,
        type: Number,
    })
    @IsInt({ message: '알림 수신 결과 로그 IDX는 숫자여야 합니다.' })
    @TransNumber()
    @Min(DefaultValue.IDX, {
        message: `알림 수신 결과 로그 IDX는 ${DefaultValue.IDX} 이상의 숫자여야 합니다.`,
    })
    @IsDefined({ message: '알림 수신 결과 로그 IDX는 필수입니다.' })
    idx!: number;
}