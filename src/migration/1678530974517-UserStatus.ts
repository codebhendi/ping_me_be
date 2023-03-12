import {MigrationInterface, QueryRunner} from "typeorm";

export class UserStatus1678530974517 implements MigrationInterface {
    name = 'UserStatus1678530974517'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_status_current_status_enum" AS ENUM('call', 'instagram', 'whatsapp', 'text', 'star')`);
        await queryRunner.query(`CREATE TABLE "user_status" ("id" character varying NOT NULL, "current_status" "public"."user_status_current_status_enum", "created_at" TIMESTAMP NOT NULL DEFAULT now(), "udpated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_892a2061d6a04a7e2efe4c26d6f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "is_active" SET DEFAULT 'true'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "is_active" SET DEFAULT true`);
        await queryRunner.query(`DROP TABLE "user_status"`);
        await queryRunner.query(`DROP TYPE "public"."user_status_current_status_enum"`);
    }

}
