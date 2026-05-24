// apps/notification-service/src/log/dto/request/search-notification-delivery-log.dto.ts

import { ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsDateString,
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    MaxLength,
    Min,
} from 'class-validator';

import { CommonLength } from 'libs/common/const/common-length.const';
import { DefaultValue } from 'libs/common/const/default-value.const';
import { TransNumber } from 'libs/common/decorator/trans-number.decorator';
import { PaginationSearchDto } from 'libs/common/dto/pagination-search.dto';

import { NotificationChannel } from '../../../notification/enum/notification-channel.enum';
import { NotificationDeliveryStatus } from '../../../notification/enum/notification-delivery-status.enum';
import {
    NotificationDeliveryLogOrderByColumn,
    NotificationDeliveryLogSearchableColumn,
} from '../../notification-log-search.enum';

export class SearchNotificationDeliveryLogDto extends PaginationSearchDto<
    NotificationDeliveryLogSearchableColumn,
    NotificationDeliveryLogOrderByColumn
> {
    @ApiPropertyOptional({
        description: '검색할 컬럼',
        enum: NotificationDeliveryLogSearchableColumn,
    })
    @IsOptional()
    @IsEnum(NotificationDeliveryLogSearchableColumn)
    declare type?: NotificationDeliveryLogSearchableColumn;

    @ApiPropertyOptional({
        description: '정렬 기준 컬럼',
        enum: NotificationDeliveryLogOrderByColumn,
        default: NotificationDeliveryLogOrderByColumn.CREATED_AT,
    })
    @IsOptional()
    @IsEnum(NotificationDeliveryLogOrderByColumn)
    declare orderBy?: NotificationDeliveryLogOrderByColumn;

    @ApiPropertyOptional({
        description: '프로젝트 이름',
        example: 'MIND_PUSH',
        maxLength: CommonLength.CODE,
    })
    @IsOptional()
    @IsString({ message: 'projectName은 문자열이어야 합니다.' })
    @MaxLength(CommonLength.CODE)
    projectName?: string;

    @ApiPropertyOptional({
        description: '알림 요청 로그 IDX',
        minimum: DefaultValue.IDX,
        type: Number,
    })
    @IsOptional()
    @TransNumber()
    @IsInt({ message: 'notificationLogIdx는 숫자여야 합니다.' })
    @Min(DefaultValue.IDX)
    notificationLogIdx?: number;

    @ApiPropertyOptional({
        description: '수신자 타입',
        example: 'USER',
        maxLength: CommonLength.JSON_KEY,
    })
    @IsOptional()
    @IsString({ message: 'receiverRefType은 문자열이어야 합니다.' })
    @MaxLength(CommonLength.JSON_KEY)
    receiverRefType?: string;

    @ApiPropertyOptional({
        description: '수신자 외부 식별자',
        minimum: DefaultValue.IDX,
        type: Number,
    })
    @IsOptional()
    @TransNumber()
    @IsInt({ message: 'receiverRefIdx는 숫자여야 합니다.' })
    @Min(DefaultValue.IDX)
    receiverRefIdx?: number;

    @ApiPropertyOptional({
        description: '알림 채널',
        enum: NotificationChannel,
    })
    @IsOptional()
    @IsEnum(NotificationChannel)
    channel?: NotificationChannel;

    @ApiPropertyOptional({
        description: '발송 상태',
        enum: NotificationDeliveryStatus,
    })
    @IsOptional()
    @IsEnum(NotificationDeliveryStatus)
    status?: NotificationDeliveryStatus;

    @ApiPropertyOptional({
        description: '검색 시작일',
        example: '2026-05-01',
    })
    @IsOptional()
    @IsDateString({}, { message: 'startDate는 올바른 날짜 형식이어야 합니다.' })
    startDate?: string;

    @ApiPropertyOptional({
        description: '검색 종료일',
        example: '2026-05-31',
    })
    @IsOptional()
    @IsDateString({}, { message: 'endDate는 올바른 날짜 형식이어야 합니다.' })
    endDate?: string;
}