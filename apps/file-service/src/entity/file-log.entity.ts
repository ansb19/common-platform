// apps/file-service/src/entities/file-log.entity.ts

import {
    Column,
    Entity,
    Generated,
    Index,
    PrimaryColumn,
} from 'typeorm';

import { DATABASE_SCHEMA } from 'libs/common/const/database.const';
import { FileLogType } from '../enum/file-log.enum';

/**
 * ! PostgreSQL 파티셔닝 설정
 * ! 실제 파티션 생성은 migration raw SQL에서 진행
 */
@Index('idx_file_logs_created_at', ['createdAt'])
@Index('idx_file_logs_file_idx_created_at', ['fileIdx', 'createdAt'])
@Entity({
    schema: DATABASE_SCHEMA.FILE,
    name: 'file_logs',
    comment: '파일 로그 테이블',
})
export class FileLog {
    /**
     * 로그 고유번호
     */
    @PrimaryColumn({
        type: 'bigint',
        comment: '로그 고유번호',
    })
    @Generated('increment')
    readonly idx!: number;

    /**
     * 파일 UUID
     */
    @Column({
        name: 'file_idx',
        type: 'uuid',
        comment: '파일 UUID',
    })
    fileIdx!: string;

    /**
     * 로그 타입
     * ex)
     * upload
     * delete
     * restore
     * download
     */
    @Column({
        type: 'varchar',
        length: 50,
        comment: '로그 타입',
    })
    type!: FileLogType;

    /**
     * 실행 유저 idx
     */
    @Column({
        name: 'user_idx',
        type: 'integer',
        nullable: true,
        comment: '실행 유저 idx',
    })
    userIdx!: number | null;

    /**
     * 로그 메시지
     */
    @Column({
        type: 'text',
        nullable: true,
        comment: '로그 메시지',
    })
    message!: string | null;

    /**
     * 메타데이터(JSON)
     */
    @Column({
        type: 'jsonb',
        nullable: true,
        comment: '메타데이터(JSON)',
    })
    metadata!: Record<string, unknown> | null;

    /**
     * 생성일
     */
    @PrimaryColumn({
        name: 'created_at',
        type: 'timestamptz',
        default: () => 'now()',
        comment: '생성일',
    })
    createdAt!: Date;
}