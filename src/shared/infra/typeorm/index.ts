import { createConnection, Connection } from 'typeorm';

require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.testing' : '.env',
});

export default async (name?: string): Promise<Connection> => {
  return createConnection({
    name: name || 'default',
    type: 'postgres',
    host: process.env.TYPEORM_HOST,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    port: Number(process.env.TYPEORM_PORT || '5434'),
    entities: ['src/modules/**/infra/typeorm/entities/*.ts'],
    migrations: ['src/shared/infra/typeorm/migrations/*.ts'],
    cli: {
      migrationsDir: 'src/shared/infra/typeorm/migrations',
      entitiesDir: 'src/modules/**/infra/typeorm/entities',
    },
  });
};
