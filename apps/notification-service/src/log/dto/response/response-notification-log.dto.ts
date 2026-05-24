// apps/notification-service/src/log/dto/response/response-notification-log.dto.ts

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

import { NotificationChannel } from '../../../notification/enum/notification-channel.enum';
import { NotificationLogStatus } from '../../../notification/enum/notification-log-status.enum';

@Exclude()
export class ResponseNotificationLogDto {
    @ApiProperty({ description: '알림 요청 로그 IDX', example: 1 })
    @Expose()
    idx!: number;

    @ApiProperty({ description: '프로젝트 이름', example: 'MIND_PUSH' })
    @Expose()
    projectName!: string;

    @ApiPropertyOptional({ description: '템플릿 IDX', nullable: true })
    @Expose()
    templateIdx!: number | null;

    @ApiPropertyOptional({ description: '발신 주체 타입', nullable: true })
    @Expose()
    senderRefType!: string | null;

    @ApiPropertyOptional({ description: '발신 주체 외부 식별자', nullable: true })
    @Expose()
    senderRefIdx!: number | null;

    @ApiProperty({ description: '알림 채널', enum: NotificationChannel })
    @Expose()
    channel!: NotificationChannel;

    @ApiPropertyOptional({ description: '알림 제목', nullable: true })
    @Expose()
    title!: string | null;

    @ApiProperty({ description: '알림 내용' })
    @Expose()
    content!: string;

    @ApiPropertyOptional({
        description: '템플릿 치환 변수 값',
        nullable: true,
        type: Object,
    })
    @Expose()
    templateVariables!: Record<string, unknown> | null;

    @ApiPropertyOptional({
        description: '수신자 외부 식별자 목록',
        type: () => [Number],
        nullable: true,
    })
    @Expose()
    receiverRefIdxs!: number[] | null;

    @ApiPropertyOptional({
        description: '첨부 파일 UUID 목록',
        type: () => [String],
        nullable: true,
    })
    @Expose()
    fileUuids!: string[] | null;

    @ApiPropertyOptional({ description: '링크 URL', nullable: true })
    @Expose()
    linkUrl!: string | null;

    @ApiProperty({ description: '우선순위', example: 100 })
    @Expose()
    priority!: number;

    @ApiProperty({ description: '시스템 알림 여부', example: false })
    @Expose()
    isSystem!: boolean;

    @ApiProperty({ description: '처리 상태', enum: NotificationLogStatus })
    @Expose()
    status!: NotificationLogStatus;

    @ApiProperty({ description: '발송 대상 수', example: 10 })
    @Expose()
    targetCount!: number;

    @ApiProperty({ description: '발송 성공 수', example: 9 })
    @Expose()
    successCount!: number;

    @ApiProperty({ description: '발송 실패 수', example: 1 })
    @Expose()
    failureCount!: number;

    @ApiPropertyOptional({ description: '실패 사유 요약', nullable: true })
    @Expose()
    failureReason!: string | null;

    @ApiPropertyOptional({
        description: '메타데이터',
        nullable: true,
        type: Object,
    })
    @Expose()
    metadata!: Record<string, unknown> | null;

    @ApiProperty({ description: '생성일시' })
    @Expose()
    createdAt!: Date;
}

@Exclude()
export class PaginatedNotificationLogResponse
    extends PaginatedResult<ResponseNotificationLogDto> {
    @ApiProperty({ description: '전체 데이터 개수', example: 120 })
    @Expose()
    declare totalCount: number;

    @ApiProperty({
        description: '현재 페이지 데이터',
        type: () => [ResponseNotificationLogDto],
    })
    @Expose()
    @Type(() => ResponseNotificationLogDto)
    declare items: ResponseNotificationLogDto[];
}