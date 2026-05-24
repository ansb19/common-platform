// apps/notification-service/src/log/dto/request/search-notification-log.dto.ts

import { ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsBoolean,
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
import { TransBoolean } from 'libs/common/decorator/trans-boolean.decorator';
import { TransNumber } from 'libs/common/decorator/trans-number.decorator';
import { PaginationSearchDto } from 'libs/common/dto/pagination-search.dto';

import { NotificationChannel } from '../../../notification/enum/notification-channel.enum';
import { NotificationLogStatus } from '../../../notification/enum/notification-log-status.enum';
import {
    NotificationLogOrderByColumn,
    NotificationLogSearchableColumn,
} from '../../notification-log-search.enum';

export class SearchNotificationLogDto extends PaginationSearchDto<
    NotificationLogSearchableColumn,
    NotificationLogOrderByColumn
> {
    @ApiPropertyOptional({
        description: '검색할 컬럼',
        enum: NotificationLogSearchableColumn,
    })
    @IsOptional()
    @IsEnum(NotificationLogSearchableColumn)
    declare type?: NotificationLogSearchableColumn;

    @ApiPropertyOptional({
        description: '정렬 기준 컬럼',
        enum: NotificationLogOrderByColumn,
        default: NotificationLogOrderByColumn.CREATED_AT,
    })
    @IsOptional()
    @IsEnum(NotificationLogOrderByColumn)
    declare orderBy?: NotificationLogOrderByColumn;

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
        description: '템플릿 IDX',
        minimum: DefaultValue.IDX,
        type: Number,
    })
    @IsOptional()
    @TransNumber()
    @IsInt({ message: 'templateIdx는 숫자여야 합니다.' })
    @Min(DefaultValue.IDX)
    templateIdx?: number;

    @ApiPropertyOptional({
        description: '발신 주체 타입',
        example: 'SYSTEM',
        maxLength: CommonLength.JSON_KEY,
    })
    @IsOptional()
    @IsString({ message: 'senderRefType은 문자열이어야 합니다.' })
    @MaxLength(CommonLength.JSON_KEY)
    senderRefType?: string;

    @ApiPropertyOptional({
        description: '발신 주체 외부 식별자',
        minimum: DefaultValue.IDX,
        type: Number,
    })
    @IsOptional()
    @TransNumber()
    @IsInt({ message: 'senderRefIdx는 숫자여야 합니다.' })
    @Min(DefaultValue.IDX)
    senderRefIdx?: number;

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
        description: '처리 상태',
        enum: NotificationLogStatus,
    })
    @IsOptional()
    @IsEnum(NotificationLogStatus)
    status?: NotificationLogStatus;

    @ApiPropertyOptional({
        description: '시스템 알림 여부',
        type: Boolean,
    })
    @IsOptional()
    @TransBoolean()
    @IsBoolean()
    isSystem?: boolean;

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