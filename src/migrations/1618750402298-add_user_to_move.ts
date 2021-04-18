import {MigrationInterface, QueryRunner} from "typeorm";

export class addUserToMove1618750402298 implements MigrationInterface {
    name = 'addUserToMove1618750402298'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "move" ADD "user_id" uuid`);
        await queryRunner.query(`ALTER TABLE "move" ADD CONSTRAINT "FK_5e441bb17d851d220519a9f3900" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "move" DROP CONSTRAINT "FK_5e441bb17d851d220519a9f3900"`);
        await queryRunner.query(`ALTER TABLE "move" DROP COLUMN "user_id"`);
    }

}
