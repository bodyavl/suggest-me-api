import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1694269485578 implements MigrationInterface {
    name = 'NewMigration1694269485578'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "hash" character varying NOT NULL, "name" character varying NOT NULL, "refresh_tokens" text array NOT NULL DEFAULT '{}', CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "stat" ("id" SERIAL NOT NULL, "movies" integer NOT NULL DEFAULT '0', "tv_shows" integer NOT NULL DEFAULT '0', "suggestions" integer NOT NULL DEFAULT '0', "man_suggestions" integer NOT NULL DEFAULT '0', "userId" integer, CONSTRAINT "REL_0d79ac0534255a3b34a834c570" UNIQUE ("userId"), CONSTRAINT "PK_132de903d366f4c06cd586c43c0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "movie" ("id" integer NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "type" character varying NOT NULL, "tagline" character varying NOT NULL, "poster" character varying NOT NULL, "backdrop" character varying NOT NULL, "genres" text NOT NULL, "date" TIMESTAMP WITH TIME ZONE, "rating" double precision NOT NULL, "runtime" integer NOT NULL, CONSTRAINT "PK_cb3bb4d61cf764dc035cbedd422" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "stat" ADD CONSTRAINT "FK_0d79ac0534255a3b34a834c5709" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stat" DROP CONSTRAINT "FK_0d79ac0534255a3b34a834c5709"`);
        await queryRunner.query(`DROP TABLE "movie"`);
        await queryRunner.query(`DROP TABLE "stat"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
