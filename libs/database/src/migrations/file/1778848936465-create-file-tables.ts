import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFileTables1778848936465 implements MigrationInterface {
    name = 'CreateFileTables1778848936465'

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "file_schema"`);

        await queryRunner.query(`CREATE TABLE "file_schema"."file_contexts" ("idx" SERIAL NOT NULL, "is_public" boolean NOT NULL DEFAULT true, "is_editor" boolean NOT NULL DEFAULT false, "is_temp" boolean NOT NULL DEFAULT false, "uploader_idx" integer, "download_count" integer NOT NULL DEFAULT '0', "last_accessed_at" TIMESTAMP WITH TIME ZONE, "thumbnail_file_idx" uuid, "purpose" character varying(50), "access_level" character varying(30) NOT NULL DEFAULT 'public', "description" character varying(255), "expired_at" TIMESTAMP WITH TIME ZONE, "is_referenced" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "file_idx" uuid, CONSTRAINT "REL_fd4b133f3cd5629d2d93d349ec" UNIQUE ("file_idx"), CONSTRAINT "PK_474b56d578ca21c7a2e15b1f5f4" PRIMARY KEY ("idx")); COMMENT ON COLUMN "file_schema"."file_contexts"."idx" IS '컨텍스트 고유번호'; COMMENT ON COLUMN "file_schema"."file_contexts"."is_public" IS '공개 여부'; COMMENT ON COLUMN "file_schema"."file_contexts"."is_editor" IS '에디터 업로드 여부'; COMMENT ON COLUMN "file_schema"."file_contexts"."is_temp" IS '임시 파일 여부'; COMMENT ON COLUMN "file_schema"."file_contexts"."uploader_idx" IS '업로더 idx'; COMMENT ON COLUMN "file_schema"."file_contexts"."download_count" IS '다운로드 횟수'; COMMENT ON COLUMN "file_schema"."file_contexts"."last_accessed_at" IS '마지막 접근일'; COMMENT ON COLUMN "file_schema"."file_contexts"."thumbnail_file_idx" IS '썸네일 파일 UUID'; COMMENT ON COLUMN "file_schema"."file_contexts"."purpose" IS '파일 목적'; COMMENT ON COLUMN "file_schema"."file_contexts"."access_level" IS '접근 레벨'; COMMENT ON COLUMN "file_schema"."file_contexts"."description" IS '파일 설명'; COMMENT ON COLUMN "file_schema"."file_contexts"."expired_at" IS '만료일'; COMMENT ON COLUMN "file_schema"."file_contexts"."is_referenced" IS '실제 참조 여부'; COMMENT ON COLUMN "file_schema"."file_contexts"."created_at" IS '생성일'; COMMENT ON COLUMN "file_schema"."file_contexts"."updated_at" IS '수정일'; COMMENT ON COLUMN "file_schema"."file_contexts"."file_idx" IS '파일 UUID'`);
        await queryRunner.query(`CREATE INDEX "IDX_195e5149ccf57779fcb19086ab" ON "file_schema"."file_contexts" ("uploader_idx") `);
        await queryRunner.query(`CREATE INDEX "IDX_2c184fcf2f1d5487266be5df45" ON "file_schema"."file_contexts" ("purpose") `);
        await queryRunner.query(`CREATE INDEX "IDX_394c9745dd16526b2d2d0d9ce3" ON "file_schema"."file_contexts" ("expired_at") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "uq_file_contexts_file_idx" ON "file_schema"."file_contexts" ("file_idx") `);
        await queryRunner.query(`COMMENT ON TABLE "file_schema"."file_contexts" IS '파일 정책/사용 메타데이터'`);
        await queryRunner.query(`CREATE TABLE "file_schema"."file_references" ("idx" SERIAL NOT NULL, "target_type" character varying(100) NOT NULL, "target_idx" character varying(100) NOT NULL, "field_name" character varying(100), "sort_order" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "file_idx" uuid, CONSTRAINT "PK_c77487b318d6e651d44c5db0412" PRIMARY KEY ("idx")); COMMENT ON COLUMN "file_schema"."file_references"."idx" IS '참조 고유번호'; COMMENT ON COLUMN "file_schema"."file_references"."target_type" IS '참조 대상 타입'; COMMENT ON COLUMN "file_schema"."file_references"."target_idx" IS '참조 대상 idx'; COMMENT ON COLUMN "file_schema"."file_references"."field_name" IS '필드명'; COMMENT ON COLUMN "file_schema"."file_references"."sort_order" IS '정렬 순서'; COMMENT ON COLUMN "file_schema"."file_references"."created_at" IS '생성일'; COMMENT ON COLUMN "file_schema"."file_references"."file_idx" IS '파일 UUID'`);
        await queryRunner.query(`CREATE INDEX "idx_file_references_target" ON "file_schema"."file_references" ("target_type", "target_idx") `);
        await queryRunner.query(`CREATE INDEX "idx_file_references_file" ON "file_schema"."file_references" ("file_idx") `);
        await queryRunner.query(`COMMENT ON TABLE "file_schema"."file_references" IS '파일 참조 테이블'`);
        await queryRunner.query(`CREATE TABLE "file_schema"."files" ("idx" uuid NOT NULL DEFAULT uuid_generate_v4(), "project" character varying(50) NOT NULL, "storage_type" character varying(30) NOT NULL DEFAULT 'local', "bucket" character varying(100) NOT NULL DEFAULT 'local', "key" character varying(500) NOT NULL, "original_name" character varying(255) NOT NULL, "stored_name" character varying(255) NOT NULL, "mime_type" character varying(100) NOT NULL, "extension" character varying(20) NOT NULL, "file_size" bigint NOT NULL, "checksum" character varying(255), "is_exists" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_0d29d02d356754d4410f8691d2a" PRIMARY KEY ("idx")); COMMENT ON COLUMN "file_schema"."files"."idx" IS '파일 UUID'; COMMENT ON COLUMN "file_schema"."files"."project" IS '프로젝트명'; COMMENT ON COLUMN "file_schema"."files"."storage_type" IS '스토리지 타입'; COMMENT ON COLUMN "file_schema"."files"."bucket" IS 'bucket 이름'; COMMENT ON COLUMN "file_schema"."files"."key" IS 'object key'; COMMENT ON COLUMN "file_schema"."files"."original_name" IS '원본 파일명'; COMMENT ON COLUMN "file_schema"."files"."stored_name" IS '저장 파일명'; COMMENT ON COLUMN "file_schema"."files"."mime_type" IS 'MIME 타입'; COMMENT ON COLUMN "file_schema"."files"."extension" IS '파일 확장자'; COMMENT ON COLUMN "file_schema"."files"."file_size" IS '파일 크기(byte)'; COMMENT ON COLUMN "file_schema"."files"."checksum" IS '파일 checksum'; COMMENT ON COLUMN "file_schema"."files"."is_exists" IS '실제 storage 존재 여부'; COMMENT ON COLUMN "file_schema"."files"."created_at" IS '생성일'; COMMENT ON COLUMN "file_schema"."files"."updated_at" IS '수정일'; COMMENT ON COLUMN "file_schema"."files"."deleted_at" IS 'soft delete 시각'`);
        await queryRunner.query(`CREATE INDEX "IDX_83abfc71bed40cb2c59041ee1d" ON "file_schema"."files" ("project") `);
        await queryRunner.query(`CREATE INDEX "IDX_ff4eea6d60b82eb318b79ac0a6" ON "file_schema"."files" ("checksum") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "uq_files_project_bucket_key" ON "file_schema"."files" ("project", "bucket", "key") `);
        await queryRunner.query(`COMMENT ON TABLE "file_schema"."files" IS '순수 파일 스토리지 메타데이터'`);
        await queryRunner.query(`CREATE TABLE "file_schema"."file_logs" ("idx" BIGSERIAL NOT NULL, "file_idx" uuid NOT NULL, "type" character varying(50) NOT NULL, "user_idx" integer, "message" text, "metadata" jsonb, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_9100926bbb666c34ec790f7a72f" PRIMARY KEY ("idx", "created_at")) PARTITION BY RANGE ("created_at"); COMMENT ON COLUMN "file_schema"."file_logs"."idx" IS '로그 고유번호'; COMMENT ON COLUMN "file_schema"."file_logs"."file_idx" IS '파일 UUID'; COMMENT ON COLUMN "file_schema"."file_logs"."type" IS '로그 타입'; COMMENT ON COLUMN "file_schema"."file_logs"."user_idx" IS '실행 유저 idx'; COMMENT ON COLUMN "file_schema"."file_logs"."message" IS '로그 메시지'; COMMENT ON COLUMN "file_schema"."file_logs"."metadata" IS '메타데이터(JSON)'; COMMENT ON COLUMN "file_schema"."file_logs"."created_at" IS '생성일'`);

        // 2. 기본 파티션 생성
        await queryRunner.query(`
            CREATE TABLE "file_schema"."file_logs_default"
            PARTITION OF "file_schema"."file_logs"
            DEFAULT
            `);

        await queryRunner.query(`CREATE INDEX "idx_file_logs_file_idx_created_at" ON "file_schema"."file_logs" ("file_idx", "created_at") `);
        await queryRunner.query(`CREATE INDEX "idx_file_logs_created_at" ON "file_schema"."file_logs" ("created_at") `);
        await queryRunner.query(`COMMENT ON TABLE "file_schema"."file_logs" IS '파일 로그 테이블'`);
        await queryRunner.query(`ALTER TABLE "file_schema"."file_contexts" ADD CONSTRAINT "FK_fd4b133f3cd5629d2d93d349ec5" FOREIGN KEY ("file_idx") REFERENCES "file_schema"."files"("idx") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "file_schema"."file_references" ADD CONSTRAINT "FK_5cfaf8a1fcebcf453f16bbd03c7" FOREIGN KEY ("file_idx") REFERENCES "file_schema"."files"("idx") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file_schema"."file_references" DROP CONSTRAINT "FK_5cfaf8a1fcebcf453f16bbd03c7"`);
        await queryRunner.query(`ALTER TABLE "file_schema"."file_contexts" DROP CONSTRAINT "FK_fd4b133f3cd5629d2d93d349ec5"`);
        await queryRunner.query(`COMMENT ON TABLE "file_schema"."file_logs" IS NULL`);
        await queryRunner.query(`DROP INDEX "file_schema"."idx_file_logs_created_at"`);
        await queryRunner.query(`DROP INDEX "file_schema"."idx_file_logs_file_idx_created_at"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "file_schema"."file_logs_default"`);
        await queryRunner.query(`DROP TABLE "file_schema"."file_logs"`);
        await queryRunner.query(`COMMENT ON TABLE "file_schema"."files" IS NULL`);
        await queryRunner.query(`DROP INDEX "file_schema"."uq_files_project_bucket_key"`);
        await queryRunner.query(`DROP INDEX "file_schema"."IDX_ff4eea6d60b82eb318b79ac0a6"`);
        await queryRunner.query(`DROP INDEX "file_schema"."IDX_83abfc71bed40cb2c59041ee1d"`);
        await queryRunner.query(`DROP TABLE "file_schema"."files"`);
        await queryRunner.query(`COMMENT ON TABLE "file_schema"."file_references" IS NULL`);
        await queryRunner.query(`DROP INDEX "file_schema"."idx_file_references_file"`);
        await queryRunner.query(`DROP INDEX "file_schema"."idx_file_references_target"`);
        await queryRunner.query(`DROP TABLE "file_schema"."file_references"`);
        await queryRunner.query(`COMMENT ON TABLE "file_schema"."file_contexts" IS NULL`);
        await queryRunner.query(`DROP INDEX "file_schema"."uq_file_contexts_file_idx"`);
        await queryRunner.query(`DROP INDEX "file_schema"."IDX_394c9745dd16526b2d2d0d9ce3"`);
        await queryRunner.query(`DROP INDEX "file_schema"."IDX_2c184fcf2f1d5487266be5df45"`);
        await queryRunner.query(`DROP INDEX "file_schema"."IDX_195e5149ccf57779fcb19086ab"`);
        await queryRunner.query(`DROP TABLE "file_schema"."file_contexts"`);
    }

}
