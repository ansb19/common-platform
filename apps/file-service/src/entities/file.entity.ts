// apps/file-service/src/entities/file.entity.ts

import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { DATABASE_SCHEMA } from 'libs/common/const/database.const';

import { FileContext } from './file-context.entity';
import { FileReference } from './file-reference.entity';
import { FileStorageType } from '../enum/file.enum';
import { PROJECT_NAME } from 'libs/common/enum/project.enum';

@Index('uq_files_project_bucket_key', ['project', 'bucket', 'key'], {
    unique: true,
})
@Entity({
    schema: DATABASE_SCHEMA.FILE,
    name: 'files',
    comment: '순수 파일 스토리지 메타데이터',
})
export class File {
    /**
     * 파일 UUID
     */
    @PrimaryGeneratedColumn('uuid', {
        comment: '파일 UUID',
    })
    idx!: string;

    /**
     * 프로젝트명
     * ex)
     * mindpush
     * commerce
     */
    @Index()
    @Column({
        type: 'varchar',
        length: 50,
        comment: '프로젝트명',
    })
    project!: PROJECT_NAME;

    /**
     * 스토리지 타입
     * ex)
     * local
     * s3
     * r2
     */
    @Column({
        name: 'storage_type',
        type: 'varchar',
        length: 30,
        default: FileStorageType.LOCAL,
        comment: '스토리지 타입',
    })
    storageType!: FileStorageType;

    /**
     * bucket 이름
     */
    @Column({
        type: 'varchar',
        length: 100,
        default: 'local',
        comment: 'bucket 이름',
    })
    bucket!: string;

    /**
     * object key
     * ex)
     * profile/uuid.png
     */
    @Column({
        type: 'varchar',
        length: 500,
        comment: 'object key',
    })
    key!: string;

    /**
     * 원본 파일명
     */
    @Column({
        name: 'original_name',
        type: 'varchar',
        length: 255,
        comment: '원본 파일명',
    })
    originalName!: string;

    /**
     * 저장 파일명
     */
    @Column({
        name: 'stored_name',
        type: 'varchar',
        length: 255,
        comment: '저장 파일명',
    })
    storedName!: string;

    /**
     * MIME 타입
     */
    @Column({
        name: 'mime_type',
        type: 'varchar',
        length: 100,
        comment: 'MIME 타입',
    })
    mimeType!: string;

    /**
     * 파일 확장자
     */
    @Column({
        type: 'varchar',
        length: 20,
        comment: '파일 확장자',
    })
    extension!: string;

    /**
     * 파일 크기(byte)
     */
    @Column({
        name: 'file_size',
        type: 'bigint',
        comment: '파일 크기(byte)',
    })
    fileSize!: number;

    /**
     * checksum
     * 중복 파일 검증용
     */
    @Index()
    @Column({
        type: 'varchar',
        length: 255,
        nullable: true,
        comment: '파일 checksum',
    })
    checksum!: string | null;

    /**
     * 실제 storage 존재 여부
     */
    @Column({
        name: 'is_exists',
        type: 'boolean',
        default: true,
        comment: '실제 storage 존재 여부',
    })
    isExists!: boolean;

    /**
     * 파일 컨텍스트
     */
    @OneToOne(() => FileContext, (context) => context.file)
    context!: FileContext;

    @OneToMany(() => FileReference, (reference) => reference.file)
    references!: FileReference[];


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
     * soft delete 시각
     */
    @DeleteDateColumn({
        name: 'deleted_at',
        type: 'timestamptz',
        nullable: true,
        comment: 'soft delete 시각',
    })
    deletedAt!: Date | null;
}