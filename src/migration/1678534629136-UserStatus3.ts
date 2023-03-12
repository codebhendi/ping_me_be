import {MigrationInterface, QueryRunner} from "typeorm";

export class UserStatus31678534629136 implements MigrationInterface {
    name = 'UserStatus31678534629136'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_status" DROP CONSTRAINT "PK_573dd09f0c80f3018ce2cf98e37"`);
        await queryRunner.query(`ALTER TABLE "user_status" ADD CONSTRAINT "PK_9bab6c49e02f517fd2efd6c1a91" PRIMARY KEY ("user_id")`);
        await queryRunner.query(`ALTER TABLE "user_status" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "is_active" SET DEFAULT 'true'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "is_active" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "user_status" ADD "id" integer GENERATED BY DEFAULT AS IDENTITY NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_status" DROP CONSTRAINT "PK_9bab6c49e02f517fd2efd6c1a91"`);
        await queryRunner.query(`ALTER TABLE "user_status" ADD CONSTRAINT "PK_573dd09f0c80f3018ce2cf98e37" PRIMARY KEY ("user_id", "id")`);
    }

}
