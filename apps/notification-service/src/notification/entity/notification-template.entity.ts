import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { DATABASE_SCHEMA } from 'libs/common/const/database.const';

import { NotificationChannel } from '../enum/notification-channel.enum';

@Index('idx_notification_templates_project_code_channel', [
    'projectName',
    'code',
    'channel',
], {
    unique: true,
})
@Index('idx_notification_templates_project_active', [
    'projectName',
    'isActive',
])
@Entity({
    schema: DATABASE_SCHEMA.NOTIFICATION,
    name: 'notification_templates',
    comment: '알림 템플릿 테이블',
})
export class NotificationTemplate {
    /**
     * 템플릿 고유번호
     */
    @PrimaryGeneratedColumn({
        type: 'integer',
        comment: '템플릿 고유번호',
    })
    idx!: number;

    /**
     * 프로젝트 이름
     * ex)
     * MIND_PUSH
     * CAFE_RYNN
     */
    @Column({
        name: 'project_name',
        type: 'varchar',
        length: 50,
        comment: '프로젝트 이름',
    })
    projectName!: string;

    /**
     * 템플릿 코드
     * ex)
     * WELCOME
     * PASSWORD_RESET
     * DAILY_QUOTE
     */
    @Column({
        type: 'varchar',
        length: 100,
        comment: '템플릿 코드',
    })
    code!: string;

    /**
     * 알림 채널
     * ex)
     * SMS
     * EMAIL
     * PUSH
     */
    @Column({
        type: 'varchar',
        length: 30,
        comment: '알림 채널',
    })
    channel!: NotificationChannel;

    /**
     * 템플릿 제목
     * SMS는 nullable 가능
     */
    @Column({
        type: 'varchar',
        length: 255,
        nullable: true,
        comment: '템플릿 제목',
    })
    title!: string | null;

    /**
     * 템플릿 내용
     * ex)
     * 안녕하세요 {name}님.
     */
    @Column({
        type: 'text',
        comment: '템플릿 내용',
    })
    content!: string;

    /**
     * 템플릿 변수 목록
     * ex)
     * ["name", "quote", "orderNumber"]
     */
    @Column({
        type: 'jsonb',
        nullable: true,
        comment: '템플릿 변수 목록',
    })
    variables!: string[] | null;

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
}