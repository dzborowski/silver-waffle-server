import {MigrationInterface, QueryRunner} from "typeorm";

export class addGameMove1618750239840 implements MigrationInterface {
    name = "addGameMove1618750239840";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "game" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "creator_id" uuid, "oponent_id" uuid, CONSTRAINT "PK_352a30652cd352f552fef73dec5" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "move" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0befa9c6b3a216e49c494b4acc5" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `ALTER TABLE "game" ADD CONSTRAINT "FK_1f085438e7c67754389f6b459f7" FOREIGN KEY ("creator_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "game" ADD CONSTRAINT "FK_b4f2befda894e520d9623a55841" FOREIGN KEY ("oponent_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "FK_b4f2befda894e520d9623a55841"`);
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "FK_1f085438e7c67754389f6b459f7"`);
        await queryRunner.query(`DROP TABLE "move"`);
        await queryRunner.query(`DROP TABLE "game"`);
    }
}
