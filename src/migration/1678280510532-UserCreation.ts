import {MigrationInterface, QueryRunner} from "typeorm";

export class UserCreation1678280510532 implements MigrationInterface {
    name = 'UserCreation1678280510532'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" integer GENERATED BY DEFAULT AS IDENTITY NOT NULL, "username" character varying NOT NULL, "email" character varying, "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "udpated_at" TIMESTAMP NOT NULL DEFAULT now(), "is_active" boolean NOT NULL DEFAULT 'true', CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
