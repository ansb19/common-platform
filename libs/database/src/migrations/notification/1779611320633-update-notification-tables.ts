import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateNotificationTables1779611320633 implements MigrationInterface {
    name = 'UpdateNotificationTables1779611320633'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification_schema"."notification_logs" ADD "request_id" character varying(36)`);
        await queryRunner.query(`COMMENT ON COLUMN "notification_schema"."notification_logs"."request_id" IS '요청 추적 ID'`);
        await queryRunner.query(`ALTER TABLE "notification_schema"."notification_delivery_logs" ADD "last_attempted_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`COMMENT ON COLUMN "notification_schema"."notification_delivery_logs"."last_attempted_at" IS '마지막 발송 시도일'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "notification_schema"."notification_delivery_logs"."last_attempted_at" IS '마지막 발송 시도일'`);
        await queryRunner.query(`ALTER TABLE "notification_schema"."notification_delivery_logs" DROP COLUMN "last_attempted_at"`);
        await queryRunner.query(`COMMENT ON COLUMN "notification_schema"."notification_logs"."request_id" IS '요청 추적 ID'`);
        await queryRunner.query(`ALTER TABLE "notification_schema"."notification_logs" DROP COLUMN "request_id"`);
    }

}
