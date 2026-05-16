// apps/file-service/src/entities/file-context.entity.ts

import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    RelationId,
    UpdateDateColumn,
} from 'typeorm';

import { DATABASE_SCHEMA } from 'libs/common/const/database.const';

import { File } from './file.entity';
import { FileAccessLevel, FilePurpose } from '../enum/file-context.enum';

@Index('uq_file_contexts_file_idx', ['file'], { unique: true })
@Entity({
    schema: DATABASE_SCHEMA.FILE,
    name: 'file_contexts',
    comment: '파일 정책/사용 메타데이터',
})
export class FileContext {
    /**
     * 컨텍스트 고유번호
     */
    @PrimaryGeneratedColumn({
        comment: '컨텍스트 고유번호',
    })
    idx!: number;



    /**
     * 공개 여부
     */
    @Column({
        name: 'is_public',
        type: 'boolean',
        default: true,
        comment: '공개 여부',
    })
    isPublic!: boolean;

    /**
     * 에디터 업로드 여부
     */
    @Column({
        name: 'is_editor',
        type: 'boolean',
        default: false,
        comment: '에디터 업로드 여부',
    })
    isEditor!: boolean;

    /**
     * 임시 파일 여부
     */
    @Column({
        name: 'is_temp',
        type: 'boolean',
        default: false,
        comment: '임시 파일 여부',
    })
    isTemp!: boolean;

    /**
     * 업로더 idx
     *
     * MSA 환경이라 relation 안 맺음
     */
    @Index()
    @Column({
        name: 'uploader_idx',
        type: 'integer',
        nullable: true,
        comment: '업로더 idx',
    })
    uploaderIdx!: number | null;

    /**
     * 다운로드 횟수
     */
    @Column({
        name: 'download_count',
        type: 'integer',
        default: 0,
        comment: '다운로드 횟수',
    })
    downloadCount!: number;

    /**
     * 마지막 접근일
     */
    @Column({
        name: 'last_accessed_at',
        type: 'timestamptz',
        nullable: true,
        comment: '마지막 접근일',
    })
    lastAccessedAt!: Date | null;

    /**
     * 썸네일 파일 UUID
     */
    @Column({
        name: 'thumbnail_file_idx',
        type: 'uuid',
        nullable: true,
        comment: '썸네일 파일 UUID',
    })
    thumbnailFileIdx!: string | null;

    /**
     * 파일 목적
     * ex)
     * profile
     * editor
     * quote
     * push
     */
    @Index()
    @Column({
        type: 'varchar',
        length: 50,
        nullable: true,
        comment: '파일 목적',
    })
    purpose!: FilePurpose | null;

    /**
     * 접근 레벨
     * ex)
     * public
     * private
     * signed
     */
    @Column({
        name: 'access_level',
        type: 'varchar',
        length: 30,
        default: FileAccessLevel.PUBLIC,
        comment: '접근 레벨',
    })
    accessLevel!: FileAccessLevel;

    /**
     * 파일 설명
     */
    @Column({
        type: 'varchar',
        length: 255,
        nullable: true,
        comment: '파일 설명',
    })
    description!: string | null;

    /**
     * 만료일
     * temp file 자동 삭제용
     */
    @Index()
    @Column({
        name: 'expired_at',
        type: 'timestamptz',
        nullable: true,
        comment: '만료일',
    })
    expiredAt!: Date | null;

    /**
     * 실제 참조 여부
     * orphan file 판별용
     */
    @Column({
        name: 'is_referenced',
        type: 'boolean',
        default: false,
        comment: '실제 참조 여부',
    })
    isReferenced!: boolean;

    /**
     * 파일
     */
    @OneToOne(() => File, (file) => file.context, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'file_idx',
        // foreignKeyConstraintName: 'fk_file_context_file_idx',
    })
    file!: File;

    /**
     * 파일 UUID
     */
    @RelationId((context: FileContext) => context.file)
    fileIdx!: string;

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