import {MigrationInterface, QueryRunner} from "typeorm";

export class addWinner1619864217005 implements MigrationInterface {
    name = 'addWinner1619864217005'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "move" DROP COLUMN "x"`);
        await queryRunner.query(`ALTER TABLE "move" ADD "position" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "move" ADD "game_id" uuid`);
        await queryRunner.query(`CREATE TYPE "game_state_enum" AS ENUM('CREATED', 'STARTED', 'FINISHED')`);
        await queryRunner.query(`ALTER TABLE "game" ADD "state" "game_state_enum" NOT NULL DEFAULT 'CREATED'`);
        await queryRunner.query(`ALTER TABLE "game" ADD "winner_id" uuid`);
        await queryRunner.query(`ALTER TABLE "move" ADD CONSTRAINT "FK_c155edcf8233bb7ed4d8c0283ee" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "FK_298112532dfebf0f4bb788b3274" FOREIGN KEY ("winner_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "FK_298112532dfebf0f4bb788b3274"`);
        await queryRunner.query(`ALTER TABLE "move" DROP CONSTRAINT "FK_c155edcf8233bb7ed4d8c0283ee"`);
        await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "winner_id"`);
        await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "state"`);
        await queryRunner.query(`DROP TYPE "game_state_enum"`);
        await queryRunner.query(`ALTER TABLE "move" DROP COLUMN "game_id"`);
        await queryRunner.query(`ALTER TABLE "move" DROP COLUMN "position"`);
        await queryRunner.query(`ALTER TABLE "move" ADD "x" integer NOT NULL`);
    }

}
