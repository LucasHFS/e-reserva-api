import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class CreateUserCourses1618441183325
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_courses',
        columns: [
          {
            name: 'userId',
            type: 'uuid',
          },
          {
            name: 'courseId',
            type: 'uuid',
          },
        ],
      }),
    );

    const foreignKey1 = new TableForeignKey({
      columnNames: ['userId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'users',
      onDelete: 'CASCADE',
    });

    const foreignKey2 = new TableForeignKey({
      columnNames: ['courseId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'courses',
      onDelete: 'CASCADE',
    });
    await queryRunner.createForeignKey('user_courses', foreignKey1);
    await queryRunner.createForeignKey('user_courses', foreignKey2);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_courses');
  }
}
