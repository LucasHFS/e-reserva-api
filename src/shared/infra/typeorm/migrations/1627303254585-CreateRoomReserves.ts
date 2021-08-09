import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export default class CreateRoomReserves1627303254585 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
          new Table({
            name: 'room_reserve',
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
                name: 'room_id',
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
                name: 'ends_at',
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
          'room_reserve',
          new TableForeignKey({
            name: 'ReserveRoomUserFK',
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          }),
        );
    
        await queryRunner.createForeignKey(
          'room_reserve',
          new TableForeignKey({
            name: 'ReserveRoomFK',
            columnNames: ['room_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'rooms',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          }),
        );
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('room_reserve', 'ReserveRoomFK');
        await queryRunner.dropForeignKey('room_reserve', 'ReserveRoomUserFK');
        await queryRunner.dropTable('room_reserve');
      }
}
