import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export default class CreateSportCourtReserves1627306300792 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
          new Table({
            name: 'sport_court_reserve',
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
                name: 'sport_court_id',
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
          'sport_court_reserve',
          new TableForeignKey({
            name: 'ReserveSportCourtUserFK',
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          }),
        );
    
        await queryRunner.createForeignKey(
          'sport_court_reserve',
          new TableForeignKey({
            name: 'ReserveSportCourtFK',
            columnNames: ['sport_court_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'sport_courts',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          }),
        );
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('sport_court_reserve', 'ReserveSportCourtFK');
        await queryRunner.dropForeignKey('sport_court_reserve', 'ReserveSportCourtUserFK');
        await queryRunner.dropTable('sport_court_reserve');
      }

}
