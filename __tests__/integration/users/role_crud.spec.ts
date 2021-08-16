import request from 'supertest';
import { Connection, getConnection, getCustomRepository } from 'typeorm';
import app from '@shared/infra/http/app';

import createConnection from '@shared/infra/typeorm';
import RolesRepository from '@modules/users/infra/typeorm/repositories/RolesRepository';
import Role from '@modules/users/infra/typeorm/entities/Role';

import generateToken from '@shared/helpers/generateToken';

let connection: Connection;

let admin_token: string;

beforeAll(async () => {
  connection = await createConnection('test-connection');
  await connection.query('DELETE FROM user_courses');
  await connection.query('DELETE FROM users');
  await connection.query('DELETE FROM courses');
  await connection.query('DELETE FROM bonds');
  await connection.query('DELETE FROM roles');

  const token = await generateToken();

  admin_token = token;
});

afterAll(async () => {
  const mainConnection = getConnection();

  await connection.close();
  await mainConnection.close();
});

describe('CreateRole', () => {
  it('adds a role to the database', async () => {
    const response = await request(app)
      .post('/roles')
      .set('authorization', `bearer ${admin_token}`)
      .send({
        name: 'Role A',
        description: 'description role A',
      });

    // expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Role A',
        description: 'description role A',
        created_at: expect.any(String),
        updated_at: expect.any(String),
      }),
    );
  });
});

describe('UpdateRole', () => {
  it('updates a role of the database', async () => {
    const newRole = new Role();
    newRole.name = 'Role B';
    newRole.description = 'D B';
    const rolesRepository = getCustomRepository(RolesRepository);
    const role = await rolesRepository.save(newRole);

    const response = await request(app)
      .put(`/roles/${role.id}`)
      .set('authorization', `bearer ${admin_token}`)
      .send({
        name: 'Role updated',
        description: 'description role A',
      });

    // expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Role updated',
        description: 'description role A',
        created_at: expect.any(String),
        updated_at: expect.any(String),
      }),
    );
  });
});

describe('DeleteRole', () => {
  it('deletes a role', async () => {
    const newRole = new Role();
    newRole.name = 'Role C';
    newRole.description = 'Desc';
    const rolesRepository = getCustomRepository(RolesRepository);
    const role = await rolesRepository.save(newRole);
    const response = await request(app)
      .delete(`/roles/${role.id}`)
      .set('authorization', `bearer ${admin_token}`)
      .send();

    // expect(response.status).toBe(204);
    const deletedRole = await rolesRepository.findById(role.id);
    expect(deletedRole).toBeFalsy();
  });
});
