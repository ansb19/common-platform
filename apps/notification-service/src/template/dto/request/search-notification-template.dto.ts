// apps/notification-service/src/notification-template/dto/search-notification-template.dto.ts

import { ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsBoolean,
    IsEnum,
    IsOptional,
    IsString,
    MaxLength,
} from 'class-validator';

import { CommonLength } from 'libs/common/const/common-length.const';
import { TransBoolean } from 'libs/common/decorator/trans-boolean.decorator';
import { PaginationSearchDto } from 'libs/common/dto/pagination-search.dto';
import { NotificationTemplateOrderByColumn, NotificationTemplateSearchableColumn } from '../../notification-template-search.enum';
import { NotificationChannel } from 'apps/notification-service/src/notification/enum/notification-channel.enum';



export class SearchNotificationTemplateDto extends PaginationSearchDto<
    NotificationTemplateSearchableColumn,
    NotificationTemplateOrderByColumn
> {
    @ApiPropertyOptional({
        description: '검색할 컬럼',
        enum: NotificationTemplateSearchableColumn,
    })
    @IsOptional()
    @IsEnum(NotificationTemplateSearchableColumn)
    declare type?: NotificationTemplateSearchableColumn;

    @ApiPropertyOptional({
        description: '정렬 기준 컬럼',
        enum: NotificationTemplateOrderByColumn,
        default: NotificationTemplateOrderByColumn.CREATED_AT,
    })
    @IsOptional()
    @IsEnum(NotificationTemplateOrderByColumn)
    declare orderBy?: NotificationTemplateOrderByColumn;

    @ApiPropertyOptional({
        description: '프로젝트 이름',
        example: 'MIND_PUSH',
        maxLength: CommonLength.CODE,
    })
    @IsOptional()
    @IsString({ message: 'projectName은 문자열이어야 합니다.' })
    @MaxLength(CommonLength.CODE, {
        message: `projectName은 최대 ${CommonLength.CODE}자 이하이어야 합니다.`,
    })
    projectName?: string;

    @ApiPropertyOptional({
        description: '알림 채널',
        enum: NotificationChannel,
    })
    @IsOptional()
    @IsEnum(NotificationChannel, {
        message: '유효하지 않은 알림 채널입니다.',
    })
    channel?: NotificationChannel;

    @ApiPropertyOptional({
        description: '활성 여부',
        type: Boolean,
    })
    @IsOptional()
    @TransBoolean()
    @IsBoolean({ message: 'isActive는 boolean이어야 합니다.' })
    isActive?: boolean;
}