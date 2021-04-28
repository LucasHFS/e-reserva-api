import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class CreateUsersFKs1619214013039 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('users', [
      new TableColumn({
        name: 'roleId',
        type: 'uuid',
      }),
      new TableColumn({
        name: 'bondId',
        type: 'uuid',
      }),
    ]);

    const foreignKey1 = new TableForeignKey({
      name: 'fk_user_role',
      columnNames: ['roleId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'roles',
      onDelete: 'CASCADE',
    });

    const foreignKey2 = new TableForeignKey({
      name: 'fk_user_bond',
      columnNames: ['bondId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'bonds',
      onDelete: 'CASCADE',
    });
    await queryRunner.createForeignKey('users', foreignKey1);
    await queryRunner.createForeignKey('users', foreignKey2);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('users', 'fk_user_role');
    await queryRunner.dropForeignKey('users', 'fk_user_bond');
    await queryRunner.dropColumn('users', 'roleId');
    await queryRunner.dropColumn('users', 'bondId');
  }
}
