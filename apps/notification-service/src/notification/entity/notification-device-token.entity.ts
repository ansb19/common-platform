import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { DATABASE_SCHEMA } from 'libs/common/const/database.const';

import { NotificationDevicePlatform } from '../enum/notification-device-platform.enum';

@Index('idx_notification_device_tokens_project_user', [
    'projectName',
    'userRefIdx',
])
@Index('idx_notification_device_tokens_token', ['token'], {
    unique: true,
})
@Index('idx_notification_device_tokens_project_active', [
    'projectName',
    'isActive',
])
@Entity({
    schema: DATABASE_SCHEMA.NOTIFICATION,
    name: 'notification_device_tokens',
    comment: '알림 FCM 디바이스 토큰 테이블',
})
export class NotificationDeviceToken {
    /**
     * 디바이스 토큰 고유번호
     */
    @PrimaryGeneratedColumn({
        type: 'integer',
        comment: '디바이스 토큰 고유번호',
    })
    idx!: number;

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
     * 사용자 외부 식별자
     */
    @Column({
        name: 'user_ref_idx',
        type: 'integer',
        comment: '사용자 외부 식별자',
    })
    userRefIdx!: number;

    /**
     * 디바이스 ID
     * 앱 또는 웹에서 관리하는 기기 식별자
     */
    @Column({
        name: 'device_id',
        type: 'varchar',
        length: 255,
        nullable: true,
        comment: '디바이스 ID',
    })
    deviceId!: string | null;

    /**
     * FCM 토큰
     */
    @Column({
        type: 'text',
        comment: 'FCM 토큰',
    })
    token!: string;

    /**
     * 플랫폼
     * ex)
     * ANDROID
     * IOS
     * WEB
     */
    @Column({
        type: 'varchar',
        length: 30,
        comment: '플랫폼',
    })
    platform!: NotificationDevicePlatform;

    /**
     * 활성 여부
     */
    @Column({
        name: 'is_active',
        type: 'boolean',
        default: true,
        comment: '활성 여부',
    })
    isActive!: boolean;

    /**
     * 마지막 사용일
     */
    @Column({
        name: 'last_used_at',
        type: 'timestamptz',
        nullable: true,
        comment: '마지막 사용일',
    })
    lastUsedAt!: Date | null;

    /**
     * 비활성화 사유
     */
    @Column({
        name: 'inactive_reason',
        type: 'varchar',
        length: 255,
        nullable: true,
        comment: '비활성화 사유',
    })
    inactiveReason!: string | null;

    /**
     * 생성일
     */
    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamptz',
        comment: '생성일',
    })
    createdAt!: Date;

    /**
     * 수정일
     */
    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamptz',
        comment: '수정일',
    })
    updatedAt!: Date;

    /**
     * 삭제일
     */
    @DeleteDateColumn({
        name: 'deleted_at',
        type: 'timestamptz',
        nullable: true,
        comment: '삭제일',
    })
    deletedAt!: Date | null;
}