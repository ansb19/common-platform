// apps/notification-service/src/log/dto/request/receiver-ref-idx.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import {
    IsDefined,
    IsInt,
    Min,
} from 'class-validator';

import { DefaultValue } from 'libs/common/const/default-value.const';
import { TransNumber } from 'libs/common/decorator/trans-number.decorator';

export class ReceiverRefIdxDto {
    @ApiProperty({
        description: '수신자 외부 식별자',
        example: DefaultValue.IDX,
        minimum: DefaultValue.IDX,
        type: Number,
    })
    @IsInt({ message: 'receiverRefIdx는 숫자여야 합니다.' })
    @TransNumber()
    @Min(DefaultValue.IDX, {
        message: `receiverRefIdx는 ${DefaultValue.IDX} 이상의 숫자여야 합니다.`,
    })
    @IsDefined({ message: 'receiverRefIdx는 필수입니다.' })
    receiverRefIdx!: number;
}