// apps/file-service/src/entities/file-reference.entity.ts

import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    RelationId,
} from 'typeorm';

import { DATABASE_SCHEMA } from 'libs/common/const/database.const';
import { File } from './file.entity';

@Index('idx_file_references_file', ['file'])
@Index('idx_file_references_target', ['targetType', 'targetIdx'])
@Entity({
    schema: DATABASE_SCHEMA.FILE,
    name: 'file_references',
    comment: '파일 참조 테이블',
})
export class FileReference {
    /**
     * 참조 고유번호
     */
    @PrimaryGeneratedColumn({
        comment: '참조 고유번호',
    })
    idx!: number;

    /**
     * 파일 UUID
     */
    @ManyToOne(() => File, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'file_idx',
    })
    file!: File;

    /**
     * 파일 UUID
     */
    @RelationId((reference: FileReference) => reference.file)
    fileIdx!: string;

    /**
     * 참조 대상 타입
     * ex)
     * user
     * quote
     * product
     */
    @Column({
        name: 'target_type',
        type: 'varchar',
        length: 100,
        comment: '참조 대상 타입',
    })
    targetType!: string;

    /**
     * 참조 대상 idx
     */
    @Column({
        name: 'target_idx',
        type: 'varchar',
        length: 100,
        comment: '참조 대상 idx',
    })
    targetIdx!: string;

    /**
     * 필드명
     * ex)
     * profileImage
     * thumbnail
     */
    @Column({
        name: 'field_name',
        type: 'varchar',
        length: 100,
        nullable: true,
        comment: '필드명',
    })
    fieldName!: string | null;

    @Column({
        name: 'sort_order',
        type: 'integer',
        default: 0,
        comment: '정렬 순서',
    })
    sortOrder!: number;

    /**
     * 생성일
     */
    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamptz',
        comment: '생성일',
    })
    createdAt!: Date;
}