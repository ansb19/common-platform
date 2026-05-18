import {
    Column,
    Entity,
    Generated,
    Index,
    PrimaryColumn,
} from 'typeorm';

import { DATABASE_SCHEMA } from 'libs/common/const/database.const';

import { NotificationChannel } from '../enum/notification-channel.enum';
import { NotificationLogStatus } from '../enum/notification-log-status.enum';

/**
 * ! PostgreSQL 파티셔닝 설정
 * ! 실제 파티션 생성은 migration raw SQL에서 진행
 */
@Index('idx_notification_logs_created_at', ['createdAt'])
@Index('idx_notification_logs_project_name_created_at', [
    'projectName',
    'createdAt',
])
@Index('idx_notification_logs_status_created_at', [
    'status',
    'createdAt',
])
@Index('idx_notification_logs_channel_created_at', [
    'channel',
    'createdAt',
])
@Entity({
    schema: DATABASE_SCHEMA.NOTIFICATION,
    name: 'notification_logs',
    comment: '알림 발송 요청 로그 테이블',
})
export class NotificationLog {
    /**
     * 알림 로그 고유번호
     */
    @PrimaryColumn({
        type: 'bigint',
        comment: '알림 로그 고유번호',
    })
    @Generated('increment')
    readonly idx!: number;

    /**
     * 프로젝트 이름
     */
    @Column({
        name: 'project_name',
        type: 'varchar',
        length: 50,
        comment: '프로젝트 이름',
    })
    projectName!: string;

    /**
     * 템플릿 idx
     * 템플릿 없이 직접 발송한 경우 null
     */
    @Column({
        name: 'template_idx',
        type: 'integer',
        nullable: true,
        comment: '템플릿 idx',
    })
    templateIdx!: number | null;

    /**
     * 발신 주체 타입
     * ex)
     * ADMIN
     * COMPANY
     * SYSTEM
     */
    @Column({
        name: 'sender_ref_type',
        type: 'varchar',
        length: 50,
        nullable: true,
        comment: '발신 주체 타입',
    })
    senderRefType!: string | null;

    /**
     * 발신 주체 외부 식별자
     */
    @Column({
        name: 'sender_ref_idx',
        type: 'integer',
        nullable: true,
        comment: '발신 주체 외부 식별자',
    })
    senderRefIdx!: number | null;

    /**
     * 알림 채널
     */
    @Column({
        type: 'varchar',
        length: 30,
        comment: '알림 채널',
    })
    channel!: NotificationChannel;

    /**
     * 알림 제목
     */
    @Column({
        type: 'varchar',
        length: 255,
        nullable: true,
        comment: '알림 제목',
    })
    title!: string | null;

    /**
     * 알림 내용
     */
    @Column({
        type: 'text',
        comment: '알림 내용',
    })
    content!: string;

    /**
     * 치환 변수 값
     * ex)
     * { "name": "홍길동", "quote": "..." }
     */
    @Column({
        name: 'template_variables',
        type: 'jsonb',
        nullable: true,
        comment: '템플릿 치환 변수 값',
    })
    templateVariables!: Record<string, unknown> | null;

    /**
     * 수신자 외부 식별자 목록
     * 요약 기록용
     */
    @Column({
        name: 'receiver_ref_idxs',
        type: 'integer',
        array: true,
        nullable: true,
        comment: '수신자 외부 식별자 목록',
    })
    receiverRefIdxs!: number[] | null;

    /**
     * 첨부 파일 UUID 목록
     */
    @Column({
        name: 'file_uuids',
        type: 'uuid',
        array: true,
        nullable: true,
        comment: '첨부 파일 UUID 목록',
    })
    fileUuids!: string[] | null;

    /**
     * 링크 URL
     */
    @Column({
        name: 'link_url',
        type: 'text',
        nullable: true,
        comment: '링크 URL',
    })
    linkUrl!: string | null;

    /**
     * 우선순위
     * 낮을수록 먼저 처리
     */
    @Column({
        type: 'integer',
        default: 100,
        comment: '우선순위',
    })
    priority!: number;

    /**
     * 시스템 알림 여부
     */
    @Column({
        name: 'is_system',
        type: 'boolean',
        default: false,
        comment: '시스템 알림 여부',
    })
    isSystem!: boolean;

    /**
     * 처리 상태
     */
    @Column({
        type: 'varchar',
        length: 30,
        default: NotificationLogStatus.PENDING,
        comment: '처리 상태',
    })
    status!: NotificationLogStatus;

    /**
     * 발송 대상 수
     */
    @Column({
        name: 'target_count',
        type: 'integer',
        default: 0,
        comment: '발송 대상 수',
    })
    targetCount!: number;

    /**
     * 발송 성공 수
     */
    @Column({
        name: 'success_count',
        type: 'integer',
        default: 0,
        comment: '발송 성공 수',
    })
    successCount!: number;

    /**
     * 발송 실패 수
     */
    @Column({
        name: 'failure_count',
        type: 'integer',
        default: 0,
        comment: '발송 실패 수',
    })
    failureCount!: number;

    /**
     * 실패 사유 요약
     */
    @Column({
        name: 'failure_reason',
        type: 'text',
        nullable: true,
        comment: '실패 사유 요약',
    })
    failureReason!: string | null;

    /**
     * 메타데이터
     */
    @Column({
        type: 'jsonb',
        nullable: true,
        comment: '메타데이터',
    })
    metadata!: Record<string, unknown> | null;

    /**
     * 생성일
     *
     * ! 파티셔닝 키
     */
    @PrimaryColumn({
        name: 'created_at',
        type: 'timestamptz',
        default: () => 'now()',
        comment: '생성일',
    })
    createdAt!: Date;
}