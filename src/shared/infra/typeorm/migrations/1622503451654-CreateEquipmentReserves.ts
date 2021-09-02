import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class CreateEquipmentReserves1622503451654 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'equipment_reserve',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()', // generate uuid automaticaly
          },
          {
            name: 'status',
            type: 'varchar',
          },
          {
            name: 'equipment_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'starts_at',
            type: 'timestamp',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'equipment_reserve',
      new TableForeignKey({
        name: 'ReserveEquipmentUserFK',
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'equipment_reserve',
      new TableForeignKey({
        name: 'ReserveEquipmentFK',
        columnNames: ['equipment_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'equipments',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('equipment_reserve', 'ReserveEquipmentFK');
    await queryRunner.dropForeignKey('equipment_reserve', 'ReserveEquipmentUserFK');
    await queryRunner.dropTable('equipment_reserve');
  }
}
