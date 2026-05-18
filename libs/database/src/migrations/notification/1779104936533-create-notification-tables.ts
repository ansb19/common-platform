import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateNotificationTables1779104936533 implements MigrationInterface {
    name = 'CreateNotificationTables1779104936533'

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "notification_schema"`);

        await queryRunner.query(`CREATE TABLE "notification_schema"."notification_templates" ("idx" SERIAL NOT NULL, "project_name" character varying(50) NOT NULL, "code" character varying(100) NOT NULL, "channel" character varying(30) NOT NULL, "title" character varying(255), "content" text NOT NULL, "variables" jsonb, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_7d81b1caa5f1c4a630cc8291531" PRIMARY KEY ("idx")); COMMENT ON COLUMN "notification_schema"."notification_templates"."idx" IS '템플릿 고유번호'; COMMENT ON COLUMN "notification_schema"."notification_templates"."project_name" IS '프로젝트 이름'; COMMENT ON COLUMN "notification_schema"."notification_templates"."code" IS '템플릿 코드'; COMMENT ON COLUMN "notification_schema"."notification_templates"."channel" IS '알림 채널'; COMMENT ON COLUMN "notification_schema"."notification_templates"."title" IS '템플릿 제목'; COMMENT ON COLUMN "notification_schema"."notification_templates"."content" IS '템플릿 내용'; COMMENT ON COLUMN "notification_schema"."notification_templates"."variables" IS '템플릿 변수 목록'; COMMENT ON COLUMN "notification_schema"."notification_templates"."is_active" IS '활성 여부'; COMMENT ON COLUMN "notification_schema"."notification_templates"."created_at" IS '생성일'; COMMENT ON COLUMN "notification_schema"."notification_templates"."updated_at" IS '수정일'`);
        await queryRunner.query(`CREATE INDEX "idx_notification_templates_project_active" ON "notification_schema"."notification_templates" ("project_name", "is_active") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_notification_templates_project_code_channel" ON "notification_schema"."notification_templates" ("project_name", "code", "channel") `);
        await queryRunner.query(`COMMENT ON TABLE "notification_schema"."notification_templates" IS '알림 템플릿 테이블'`);
        await queryRunner.query(`CREATE TABLE "notification_schema"."notification_logs" ("idx" BIGSERIAL NOT NULL, "project_name" character varying(50) NOT NULL, "template_idx" integer, "sender_ref_type" character varying(50), "sender_ref_idx" integer, "channel" character varying(30) NOT NULL, "title" character varying(255), "content" text NOT NULL, "template_variables" jsonb, "receiver_ref_idxs" integer array, "file_uuids" uuid array, "link_url" text, "priority" integer NOT NULL DEFAULT '100', "is_system" boolean NOT NULL DEFAULT false, "status" character varying(30) NOT NULL DEFAULT 'PENDING', "target_count" integer NOT NULL DEFAULT '0', "success_count" integer NOT NULL DEFAULT '0', "failure_count" integer NOT NULL DEFAULT '0', "failure_reason" text, "metadata" jsonb, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_a826b4ec862309a6c97e89717a4" PRIMARY KEY ("idx", "created_at")) PARTITION BY RANGE ("created_at"); COMMENT ON COLUMN "notification_schema"."notification_logs"."idx" IS '알림 로그 고유번호'; COMMENT ON COLUMN "notification_schema"."notification_logs"."project_name" IS '프로젝트 이름'; COMMENT ON COLUMN "notification_schema"."notification_logs"."template_idx" IS '템플릿 idx'; COMMENT ON COLUMN "notification_schema"."notification_logs"."sender_ref_type" IS '발신 주체 타입'; COMMENT ON COLUMN "notification_schema"."notification_logs"."sender_ref_idx" IS '발신 주체 외부 식별자'; COMMENT ON COLUMN "notification_schema"."notification_logs"."channel" IS '알림 채널'; COMMENT ON COLUMN "notification_schema"."notification_logs"."title" IS '알림 제목'; COMMENT ON COLUMN "notification_schema"."notification_logs"."content" IS '알림 내용'; COMMENT ON COLUMN "notification_schema"."notification_logs"."template_variables" IS '템플릿 치환 변수 값'; COMMENT ON COLUMN "notification_schema"."notification_logs"."receiver_ref_idxs" IS '수신자 외부 식별자 목록'; COMMENT ON COLUMN "notification_schema"."notification_logs"."file_uuids" IS '첨부 파일 UUID 목록'; COMMENT ON COLUMN "notification_schema"."notification_logs"."link_url" IS '링크 URL'; COMMENT ON COLUMN "notification_schema"."notification_logs"."priority" IS '우선순위'; COMMENT ON COLUMN "notification_schema"."notification_logs"."is_system" IS '시스템 알림 여부'; COMMENT ON COLUMN "notification_schema"."notification_logs"."status" IS '처리 상태'; COMMENT ON COLUMN "notification_schema"."notification_logs"."target_count" IS '발송 대상 수'; COMMENT ON COLUMN "notification_schema"."notification_logs"."success_count" IS '발송 성공 수'; COMMENT ON COLUMN "notification_schema"."notification_logs"."failure_count" IS '발송 실패 수'; COMMENT ON COLUMN "notification_schema"."notification_logs"."failure_reason" IS '실패 사유 요약'; COMMENT ON COLUMN "notification_schema"."notification_logs"."metadata" IS '메타데이터'; COMMENT ON COLUMN "notification_schema"."notification_logs"."created_at" IS '생성일'`);

        await queryRunner.query(`
            CREATE TABLE "notification_schema"."notification_logs_default"
            PARTITION OF "notification_schema"."notification_logs"
            DEFAULT
            `);

        await queryRunner.query(`CREATE INDEX "idx_notification_logs_channel_created_at" ON "notification_schema"."notification_logs" ("channel", "created_at") `);
        await queryRunner.query(`CREATE INDEX "idx_notification_logs_status_created_at" ON "notification_schema"."notification_logs" ("status", "created_at") `);
        await queryRunner.query(`CREATE INDEX "idx_notification_logs_project_name_created_at" ON "notification_schema"."notification_logs" ("project_name", "created_at") `);
        await queryRunner.query(`CREATE INDEX "idx_notification_logs_created_at" ON "notification_schema"."notification_logs" ("created_at") `);
        await queryRunner.query(`COMMENT ON TABLE "notification_schema"."notification_logs" IS '알림 발송 요청 로그 테이블'`);
        await queryRunner.query(`CREATE TABLE "notification_schema"."notification_device_tokens" ("idx" SERIAL NOT NULL, "project_name" character varying(50) NOT NULL, "user_ref_idx" integer NOT NULL, "device_id" character varying(255), "token" text NOT NULL, "platform" character varying(30) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "last_used_at" TIMESTAMP WITH TIME ZONE, "inactive_reason" character varying(255), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_c393ad182eb5a06978065449a1c" PRIMARY KEY ("idx")); COMMENT ON COLUMN "notification_schema"."notification_device_tokens"."idx" IS '디바이스 토큰 고유번호'; COMMENT ON COLUMN "notification_schema"."notification_device_tokens"."project_name" IS '프로젝트 이름'; COMMENT ON COLUMN "notification_schema"."notification_device_tokens"."user_ref_idx" IS '사용자 외부 식별자'; COMMENT ON COLUMN "notification_schema"."notification_device_tokens"."device_id" IS '디바이스 ID'; COMMENT ON COLUMN "notification_schema"."notification_device_tokens"."token" IS 'FCM 토큰'; COMMENT ON COLUMN "notification_schema"."notification_device_tokens"."platform" IS '플랫폼'; COMMENT ON COLUMN "notification_schema"."notification_device_tokens"."is_active" IS '활성 여부'; COMMENT ON COLUMN "notification_schema"."notification_device_tokens"."last_used_at" IS '마지막 사용일'; COMMENT ON COLUMN "notification_schema"."notification_device_tokens"."inactive_reason" IS '비활성화 사유'; COMMENT ON COLUMN "notification_schema"."notification_device_tokens"."created_at" IS '생성일'; COMMENT ON COLUMN "notification_schema"."notification_device_tokens"."updated_at" IS '수정일'; COMMENT ON COLUMN "notification_schema"."notification_device_tokens"."deleted_at" IS '삭제일'`);
        await queryRunner.query(`CREATE INDEX "idx_notification_device_tokens_project_active" ON "notification_schema"."notification_device_tokens" ("project_name", "is_active") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_notification_device_tokens_token" ON "notification_schema"."notification_device_tokens" ("token") `);
        await queryRunner.query(`CREATE INDEX "idx_notification_device_tokens_project_user" ON "notification_schema"."notification_device_tokens" ("project_name", "user_ref_idx") `);
        await queryRunner.query(`COMMENT ON TABLE "notification_schema"."notification_device_tokens" IS '알림 FCM 디바이스 토큰 테이블'`);
        await queryRunner.query(`CREATE TABLE "notification_schema"."notification_delivery_logs" ("idx" BIGSERIAL NOT NULL, "notification_log_idx" bigint NOT NULL, "notification_log_created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "project_name" character varying(50) NOT NULL, "receiver_ref_type" character varying(50) NOT NULL, "receiver_ref_idx" integer, "receiver_contact" character varying(500), "channel" character varying(30) NOT NULL, "status" character varying(30) NOT NULL DEFAULT 'PENDING', "provider_message_id" character varying(255), "failure_code" character varying(100), "failure_reason" text, "retry_count" integer NOT NULL DEFAULT '0', "sent_at" TIMESTAMP WITH TIME ZONE, "metadata" jsonb, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_d6787e0f4d9b51d985f515552cb" PRIMARY KEY ("idx", "created_at")) PARTITION BY RANGE ("created_at"); COMMENT ON COLUMN "notification_schema"."notification_delivery_logs"."idx" IS '발송 결과 로그 고유번호'; COMMENT ON COLUMN "notification_schema"."notification_delivery_logs"."notification_log_idx" IS '알림 요청 로그 idx'; COMMENT ON COLUMN "notification_schema"."notification_delivery_logs"."notification_log_created_at" IS '알림 요청 로그 생성일'; COMMENT ON COLUMN "notification_schema"."notification_delivery_logs"."project_name" IS '프로젝트 이름'; COMMENT ON COLUMN "notification_schema"."notification_delivery_logs"."receiver_ref_type" IS '수신자 타입'; COMMENT ON COLUMN "notification_schema"."notification_delivery_logs"."receiver_ref_idx" IS '수신자 외부 식별자'; COMMENT ON COLUMN "notification_schema"."notification_delivery_logs"."receiver_contact" IS '수신 주소'; COMMENT ON COLUMN "notification_schema"."notification_delivery_logs"."channel" IS '알림 채널'; COMMENT ON COLUMN "notification_schema"."notification_delivery_logs"."status" IS '발송 상태'; COMMENT ON COLUMN "notification_schema"."notification_delivery_logs"."provider_message_id" IS '외부 provider 메시지 ID'; COMMENT ON COLUMN "notification_schema"."notification_delivery_logs"."failure_code" IS '실패 코드'; COMMENT ON COLUMN "notification_schema"."notification_delivery_logs"."failure_reason" IS '실패 사유'; COMMENT ON COLUMN "notification_schema"."notification_delivery_logs"."retry_count" IS '재시도 횟수'; COMMENT ON COLUMN "notification_schema"."notification_delivery_logs"."sent_at" IS '발송 완료일'; COMMENT ON COLUMN "notification_schema"."notification_delivery_logs"."metadata" IS '메타데이터'; COMMENT ON COLUMN "notification_schema"."notification_delivery_logs"."created_at" IS '생성일'`);

        await queryRunner.query(`
            CREATE TABLE "notification_schema"."notification_delivery_logs_default"
            PARTITION OF "notification_schema"."notification_delivery_logs"
            DEFAULT
            `);

        await queryRunner.query(`CREATE INDEX "idx_notification_delivery_logs_status_created_at" ON "notification_schema"."notification_delivery_logs" ("status", "created_at") `);
        await queryRunner.query(`CREATE INDEX "idx_notification_delivery_logs_receiver_created_at" ON "notification_schema"."notification_delivery_logs" ("receiver_ref_idx", "created_at") `);
        await queryRunner.query(`CREATE INDEX "idx_notification_delivery_logs_log_idx_created_at" ON "notification_schema"."notification_delivery_logs" ("notification_log_idx", "created_at") `);
        await queryRunner.query(`CREATE INDEX "idx_notification_delivery_logs_created_at" ON "notification_schema"."notification_delivery_logs" ("created_at") `);
        await queryRunner.query(`COMMENT ON TABLE "notification_schema"."notification_delivery_logs" IS '수신자별 알림 발송 결과 로그 테이블'`);




    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON TABLE "notification_schema"."notification_delivery_logs" IS NULL`);
        await queryRunner.query(`DROP INDEX "notification_schema"."idx_notification_delivery_logs_created_at"`);
        await queryRunner.query(`DROP INDEX "notification_schema"."idx_notification_delivery_logs_log_idx_created_at"`);
        await queryRunner.query(`DROP INDEX "notification_schema"."idx_notification_delivery_logs_receiver_created_at"`);
        await queryRunner.query(`DROP INDEX "notification_schema"."idx_notification_delivery_logs_status_created_at"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "notification_schema"."notification_delivery_logs_default"`);
        await queryRunner.query(`DROP TABLE "notification_schema"."notification_delivery_logs"`);
        await queryRunner.query(`COMMENT ON TABLE "notification_schema"."notification_device_tokens" IS NULL`);
        await queryRunner.query(`DROP INDEX "notification_schema"."idx_notification_device_tokens_project_user"`);
        await queryRunner.query(`DROP INDEX "notification_schema"."idx_notification_device_tokens_token"`);
        await queryRunner.query(`DROP INDEX "notification_schema"."idx_notification_device_tokens_project_active"`);
        await queryRunner.query(`DROP TABLE "notification_schema"."notification_device_tokens"`);
        await queryRunner.query(`COMMENT ON TABLE "notification_schema"."notification_logs" IS NULL`);
        await queryRunner.query(`DROP INDEX "notification_schema"."idx_notification_logs_created_at"`);
        await queryRunner.query(`DROP INDEX "notification_schema"."idx_notification_logs_project_name_created_at"`);
        await queryRunner.query(`DROP INDEX "notification_schema"."idx_notification_logs_status_created_at"`);
        await queryRunner.query(`DROP INDEX "notification_schema"."idx_notification_logs_channel_created_at"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "notification_schema"."notification_logs_default"`);
        await queryRunner.query(`DROP TABLE "notification_schema"."notification_logs"`);
        await queryRunner.query(`COMMENT ON TABLE "notification_schema"."notification_templates" IS NULL`);
        await queryRunner.query(`DROP INDEX "notification_schema"."idx_notification_templates_project_code_channel"`);
        await queryRunner.query(`DROP INDEX "notification_schema"."idx_notification_templates_project_active"`);
        await queryRunner.query(`DROP TABLE "notification_schema"."notification_templates"`);
    }

}
