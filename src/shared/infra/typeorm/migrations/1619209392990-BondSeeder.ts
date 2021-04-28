import { MigrationInterface, QueryRunner } from 'typeorm';

export default class BondSeeder1619209392990 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .getRepository('bonds')
      .save([
        { name: 'Visitante' },
        { name: 'Discente' },
        { name: 'Docente' },
        { name: 'Colaborador' },
      ]);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async down(queryRunner: QueryRunner): Promise<void> {
    // do nothing
  }
}
