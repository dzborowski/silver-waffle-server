import {MigrationInterface, QueryRunner} from "typeorm";

export class addKey1622229628914 implements MigrationInterface {
    name = 'addKey1622229628914'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "FK_1f085438e7c67754389f6b459f7"`);
        await queryRunner.query(`ALTER TABLE "game" ALTER COLUMN "creator_id" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "game"."creator_id" IS NULL`);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "FK_1f085438e7c67754389f6b459f7" FOREIGN KEY ("creator_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "FK_1f085438e7c67754389f6b459f7"`);
        await queryRunner.query(`COMMENT ON COLUMN "game"."creator_id" IS NULL`);
        await queryRunner.query(`ALTER TABLE "game" ALTER COLUMN "creator_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "FK_1f085438e7c67754389f6b459f7" FOREIGN KEY ("creator_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
