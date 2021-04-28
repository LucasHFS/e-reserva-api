import request from 'supertest';
import { Connection, getConnection, getCustomRepository } from 'typeorm';
import app from '@shared/infra/http/app';

import createConnection from '@shared/infra/typeorm';
import RolesRepository from '@modules/users/infra/typeorm/repositories/RolesRepository';
import Role from '@modules/users/infra/typeorm/entities/Role';

let connection: Connection;

let rolesRepository: RolesRepository;

beforeAll(async () => {
  connection = await createConnection('test-connection');
  await connection.query('DELETE FROM roles');

  rolesRepository = getCustomRepository(RolesRepository);
});

afterAll(async () => {
  const mainConnection = getConnection();

  await connection.close();
  await mainConnection.close();
});

describe('CreateSurvivor', () => {
  it('adds a role to the database', async () => {
    const response = await request(app).post('/roles').send({
      name: 'Manager',
      description: 'manage things',
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Manager',
        description: 'manage things',
        created_at: expect.any(String),
        updated_at: expect.any(String),
      }),
    );
  });
});

describe('UpdateRole', () => {
  it('updates a role of the database', async () => {
    const newRole = new Role();
    newRole.name = 'Manageer';
    newRole.description = 'manage things';

    const role = await rolesRepository.save(newRole);

    const response = await request(app).put(`/roles/${role.id}`).send({
      name: 'manager updated',
      description: 'manage things',
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'manager updated',
        description: role.description,
        created_at: expect.any(String),
        updated_at: expect.any(String),
      }),
    );
  });
});

describe('DeleteRole', () => {
  it('deletes a role', async () => {
    const newRole = new Role();
    newRole.name = 'Manageer';
    newRole.description = 'manage things';

    const role = await rolesRepository.save(newRole);

    const response = await request(app).delete(`/roles/${role.id}`).send();

    expect(response.status).toBe(204);
    const deletedRole = await rolesRepository.findById(role.id);
    expect(deletedRole).toBeFalsy();
  });
});
