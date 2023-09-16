import { MigrationInterface, QueryRunner } from "typeorm";

export class MovieGenresMigration1694439444526 implements MigrationInterface {
    name = 'MovieGenresMigration1694439444526'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "genres"`);
        await queryRunner.query(`ALTER TABLE "movie" ADD "genres" text array NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "genres"`);
        await queryRunner.query(`ALTER TABLE "movie" ADD "genres" text NOT NULL`);
    }

}
