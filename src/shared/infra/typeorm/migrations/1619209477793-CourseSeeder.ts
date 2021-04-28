import { MigrationInterface, QueryRunner } from 'typeorm';

export default class CourseSeeder1619209477793 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .getRepository('courses')
      .save([
        { name: 'Sem Vínculo de Curso com a UEG' },
        { name: 'Arquitetura e Urbanismo' },
        { name: 'Ciências Biológicas' },
        { name: 'Engenharia Agrícoila' },
        { name: 'Engenharia Civil' },
        { name: 'Farmácia' },
        { name: 'Física' },
        { name: 'Matemática' },
        { name: 'Química' },
        { name: 'Sistemas de Informação' },
      ]);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async down(queryRunner: QueryRunner): Promise<void> {
    // do nothing
  }
}
