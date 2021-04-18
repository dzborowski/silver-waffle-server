import {MigrationInterface, QueryRunner} from "typeorm";

export class addVars1618753985926 implements MigrationInterface {
    name = 'addVars1618753985926'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game" ADD "size" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "move" ADD "x" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "move" DROP COLUMN "x"`);
        await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "size"`);
    }

}
