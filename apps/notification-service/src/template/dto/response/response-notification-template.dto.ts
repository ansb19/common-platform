// apps/notification-service/src/notification-template/dto/response-notification-template.dto.ts

import {
    Exclude,
    Expose,
    Type,
} from 'class-transformer';
import {
    ApiProperty,
    ApiPropertyOptional,
} from '@nestjs/swagger';

import { PaginatedResult } from 'libs/common/dto/paginated-result';
import { NotificationChannel } from 'apps/notification-service/src/notification/enum/notification-channel.enum';


@Exclude()
export class ResponseNotificationTemplateDto {
    @ApiProperty({
        description: '알림 템플릿 IDX',
        example: 1,
    })
    @Expose()
    idx!: number;

    @ApiProperty({
        description: '프로젝트 이름',
        example: 'MIND_PUSH',
    })
    @Expose()
    projectName!: string;

    @ApiProperty({
        description: '템플릿 코드',
        example: 'DAILY_QUOTE',
    })
    @Expose()
    code!: string;

    @ApiProperty({
        description: '알림 채널',
        enum: NotificationChannel,
        example: NotificationChannel.PUSH,
    })
    @Expose()
    channel!: NotificationChannel;

    @ApiPropertyOptional({
        description: '템플릿 제목',
        example: '오늘의 격언',
        nullable: true,
    })
    @Expose()
    title!: string | null;

    @ApiProperty({
        description: '템플릿 내용',
        example: '안녕하세요 {name}님. 오늘의 격언은 {quote}입니다.',
    })
    @Expose()
    content!: string;

    @ApiPropertyOptional({
        description: '템플릿 변수 목록',
        example: ['name', 'quote'],
        type: () => [String],
        nullable: true,
    })
    @Expose()
    variables!: string[] | null;

    @ApiProperty({
        description: '활성 여부',
        example: true,
    })
    @Expose()
    isActive!: boolean;

    @ApiProperty({
        description: '생성일시',
        example: '2026-05-22T00:00:00.000Z',
    })
    @Expose()
    createdAt!: Date;

    @ApiProperty({
        description: '수정일시',
        example: '2026-05-22T00:00:00.000Z',
    })
    @Expose()
    updatedAt!: Date;
}

@Exclude()
export class PaginatedNotificationTemplateResponse
    extends PaginatedResult<ResponseNotificationTemplateDto> {
    @ApiProperty({
        description: '전체 데이터 개수',
        example: 120,
    })
    @Expose()
    declare totalCount: number;

    @ApiProperty({
        description: '현재 페이지 데이터',
        type: () => [ResponseNotificationTemplateDto],
    })
    @Expose()
    @Type(() => ResponseNotificationTemplateDto)
    declare items: ResponseNotificationTemplateDto[];
}