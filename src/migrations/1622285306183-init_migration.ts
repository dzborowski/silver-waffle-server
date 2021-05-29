import {MigrationInterface, QueryRunner} from "typeorm";

export class initMigration1622285306183 implements MigrationInterface {
    name = 'initMigration1622285306183'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "move" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "position" integer NOT NULL, "user_id" uuid NOT NULL, "game_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0befa9c6b3a216e49c494b4acc5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "game" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "size" integer NOT NULL, "state" "game_state_enum" NOT NULL DEFAULT 'CREATED', "creator_id" uuid NOT NULL, "oponent_id" uuid, "winner_id" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_352a30652cd352f552fef73dec5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying(255) NOT NULL, "last_name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "move" ADD CONSTRAINT "FK_5e441bb17d851d220519a9f3900" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "move" ADD CONSTRAINT "FK_c155edcf8233bb7ed4d8c0283ee" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "FK_1f085438e7c67754389f6b459f7" FOREIGN KEY ("creator_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "FK_b4f2befda894e520d9623a55841" FOREIGN KEY ("oponent_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "FK_298112532dfebf0f4bb788b3274" FOREIGN KEY ("winner_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "FK_298112532dfebf0f4bb788b3274"`);
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "FK_b4f2befda894e520d9623a55841"`);
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "FK_1f085438e7c67754389f6b459f7"`);
        await queryRunner.query(`ALTER TABLE "move" DROP CONSTRAINT "FK_c155edcf8233bb7ed4d8c0283ee"`);
        await queryRunner.query(`ALTER TABLE "move" DROP CONSTRAINT "FK_5e441bb17d851d220519a9f3900"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "game"`);
        await queryRunner.query(`DROP TABLE "move"`);
    }

}
