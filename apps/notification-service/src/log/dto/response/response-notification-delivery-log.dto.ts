// apps/notification-service/src/log/dto/response/response-notification-delivery-log.dto.ts

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
import { NotificationDeliveryStatus } from '../../../notification/enum/notification-delivery-status.enum';

@Exclude()
export class ResponseNotificationDeliveryLogDto {
    @ApiProperty({ description: '알림 수신 결과 로그 IDX', example: 1 })
    @Expose()
    idx!: number;

    @ApiProperty({ description: '알림 요청 로그 IDX', example: 1 })
    @Expose()
    notificationLogIdx!: number;

    @ApiProperty({ description: '알림 요청 로그 생성일' })
    @Expose()
    notificationLogCreatedAt!: Date;

    @ApiProperty({ description: '프로젝트 이름', example: 'MIND_PUSH' })
    @Expose()
    projectName!: string;

    @ApiProperty({ description: '수신자 타입', example: 'USER' })
    @Expose()
    receiverRefType!: string;

    @ApiPropertyOptional({ description: '수신자 외부 식별자', nullable: true })
    @Expose()
    receiverRefIdx!: number | null;

    @ApiPropertyOptional({ description: '수신 주소', nullable: true })
    @Expose()
    receiverContact!: string | null;

    @ApiProperty({ description: '알림 채널', enum: NotificationChannel })
    @Expose()
    channel!: NotificationChannel;

    @ApiProperty({ description: '발송 상태', enum: NotificationDeliveryStatus })
    @Expose()
    status!: NotificationDeliveryStatus;

    @ApiPropertyOptional({ description: '외부 provider 메시지 ID', nullable: true })
    @Expose()
    providerMessageId!: string | null;

    @ApiPropertyOptional({ description: '실패 코드', nullable: true })
    @Expose()
    failureCode!: string | null;

    @ApiPropertyOptional({ description: '실패 사유', nullable: true })
    @Expose()
    failureReason!: string | null;

    @ApiProperty({ description: '재시도 횟수', example: 0 })
    @Expose()
    retryCount!: number;

    @ApiPropertyOptional({ description: '발송 완료일', nullable: true })
    @Expose()
    sentAt!: Date | null;

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
export class PaginatedNotificationDeliveryLogResponse
    extends PaginatedResult<ResponseNotificationDeliveryLogDto> {
    @ApiProperty({ description: '전체 데이터 개수', example: 120 })
    @Expose()
    declare totalCount: number;

    @ApiProperty({
        description: '현재 페이지 데이터',
        type: () => [ResponseNotificationDeliveryLogDto],
    })
    @Expose()
    @Type(() => ResponseNotificationDeliveryLogDto)
    declare items: ResponseNotificationDeliveryLogDto[];
}