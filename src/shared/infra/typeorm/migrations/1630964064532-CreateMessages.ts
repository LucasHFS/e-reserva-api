import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class CreateMessages1630964064532 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    
        await queryRunner.createTable(
          new Table({
            name: 'messages',
            columns: [
              {
                name: 'id',
                type: 'uuid',
                isPrimary: true,
                generationStrategy: 'uuid',
                default: 'uuid_generate_v4()',
              },
              {
                name: 'userId',
                type: 'uuid',
                isNullable: true,
              },
              {
                name: 'body',
                type: 'text',
              },
              {
                name: 'to',
                type: 'varchar',
              },
              {
                name: 'read',
                type: 'boolean',
                default: false,
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

        const foreignKey1 = new TableForeignKey({
            columnNames: ['userId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
          });
        await queryRunner.createForeignKey('messages', foreignKey1);
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('messages');
      }

}
