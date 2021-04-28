import { MigrationInterface, QueryRunner } from 'typeorm';

export default class RoleSeeder1619209613392 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.getRepository('roles').save([
      {
        name: 'Usuário Comum',
        description: 'Solicita as Reservas',
      },
      {
        name: 'Gestor',
        description:
          'Gerencia o Cadastro de Locais e Equipamentos, aprova ou nega as Reservas',
      },
      {
        name: 'Administrador',
        description: 'Possui todas as permissões de acessos',
      },
    ]);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async down(queryRunner: QueryRunner): Promise<void> {
    // do nothing
  }
}
