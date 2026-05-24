import { Column, Entity, Generated, Index, PrimaryColumn } from 'typeorm';

import { CommonLength } from 'libs/common/const/common-length.const';
import { DATABASE_SCHEMA } from 'libs/common/const/database.const';

import { NotificationChannel } from '../../notification/enum/notification-channel.enum';
import { NotificationDeliveryStatus } from '../../notification/enum/notification-delivery-status.enum';

/**
 * ! PostgreSQL 파티셔닝 설정
 * ! 실제 파티션 생성은 migration raw SQL에서 진행
 *
 * created_at 기준 월별 파티셔닝을 전제로 한다.
 * PostgreSQL 파티션 테이블에서는 PK/UNIQUE 제약에 파티션 키가 포함되어야 하므로
 * idx + created_at 복합 PrimaryColumn 구조를 유지한다.
 */
@Index('idx_notification_delivery_logs_created_at', ['createdAt'])
@Index('idx_notification_delivery_logs_log_idx_created_at', [
  'notificationLogIdx',
  'createdAt',
])
@Index('idx_notification_delivery_logs_receiver_created_at', [
  'receiverRefIdx',
  'createdAt',
])
@Index('idx_notification_delivery_logs_status_created_at', [
  'status',
  'createdAt',
])
@Entity({
  schema: DATABASE_SCHEMA.NOTIFICATION,
  name: 'notification_delivery_logs',
  comment: '수신자별 알림 발송 결과 로그 테이블',
})
export class NotificationDeliveryLog {
  /**
   * 발송 결과 로그 고유번호
   */
  @PrimaryColumn({
    type: 'bigint',
    comment: '발송 결과 로그 고유번호',
  })
  @Generated('increment')
  readonly idx!: number;

  /**
   * 알림 요청 로그 idx
   */
  @Column({
    name: 'notification_log_idx',
    type: 'bigint',
    comment: '알림 요청 로그 idx',
  })
  notificationLogIdx!: number;

  /**
   * 알림 요청 로그 생성일
   *
   * notification_logs가 created_at 기준 파티셔닝이면
   * 부모 로그를 추적하기 위해 같이 저장한다.
   */
  @Column({
    name: 'notification_log_created_at',
    type: 'timestamptz',
    comment: '알림 요청 로그 생성일',
  })
  notificationLogCreatedAt!: Date;

  /**
   * 프로젝트 이름
   */
  @Column({
    name: 'project_name',
    type: 'varchar',
    length: CommonLength.CODE,
    comment: '프로젝트 이름',
  })
  projectName!: string;

  /**
   * 수신자 타입
   * ex)
   * USER
   * ADMIN
   * COMPANY
   */
  @Column({
    name: 'receiver_ref_type',
    type: 'varchar',
    length: CommonLength.CODE,
    comment: '수신자 타입',
  })
  receiverRefType!: string;

  /**
   * 수신자 외부 식별자
   */
  @Column({
    name: 'receiver_ref_idx',
    type: 'integer',
    nullable: true,
    comment: '수신자 외부 식별자',
  })
  receiverRefIdx!: number | null;

  /**
   * 수신 주소
   * SMS: 전화번호
   * EMAIL: 이메일
   * PUSH: FCM token 또는 token hash
   */
  @Column({
    name: 'receiver_contact',
    type: 'varchar',
    length: CommonLength.URL,
    nullable: true,
    comment: '수신 주소',
  })
  receiverContact!: string | null;

  /**
   * 알림 채널
   */
  @Column({
    type: 'varchar',
    length: CommonLength.CODE,
    comment: '알림 채널',
  })
  channel!: NotificationChannel;

  /**
   * 발송 상태
   */
  @Column({
    type: 'varchar',
    length: CommonLength.CODE,
    default: NotificationDeliveryStatus.PENDING,
    comment: '발송 상태',
  })
  status!: NotificationDeliveryStatus;

  /**
   * 외부 provider 메시지 ID
   * ex)
   * FCM messageId
   * SMS messageId
   */
  @Column({
    name: 'provider_message_id',
    type: 'varchar',
    length: CommonLength.CODE,
    nullable: true,
    comment: '외부 provider 메시지 ID',
  })
  providerMessageId!: string | null;

  /**
   * 실패 코드
   */
  @Column({
    name: 'failure_code',
    type: 'varchar',
    length: CommonLength.CODE,
    nullable: true,
    comment: '실패 코드',
  })
  failureCode!: string | null;

  /**
   * 실패 사유
   */
  @Column({
    name: 'failure_reason',
    type: 'text',
    nullable: true,
    comment: '실패 사유',
  })
  failureReason!: string | null;

  /**
   * 재시도 횟수
   */
  @Column({
    name: 'retry_count',
    type: 'integer',
    default: 0,
    comment: '재시도 횟수',
  })
  retryCount!: number;

  /**
   * 마지막 발송 시도일
   */
  @Column({
    name: 'last_attempted_at',
    type: 'timestamptz',
    nullable: true,
    comment: '마지막 발송 시도일',
  })
  lastAttemptedAt!: Date | null;

  /**
   * 발송 완료일
   */
  @Column({
    name: 'sent_at',
    type: 'timestamptz',
    nullable: true,
    comment: '발송 완료일',
  })
  sentAt!: Date | null;

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
