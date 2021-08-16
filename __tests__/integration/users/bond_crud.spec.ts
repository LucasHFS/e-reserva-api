import request from 'supertest';
import { Connection, getConnection, getCustomRepository } from 'typeorm';
import app from '@shared/infra/http/app';

import createConnection from '@shared/infra/typeorm';
import BondsRepository from '@modules/users/infra/typeorm/repositories/BondsRepository';
import Bond from '@modules/users/infra/typeorm/entities/Bond';

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

describe('CreateBond', () => {
  it('adds a bond to the database', async () => {
    const response = await request(app)
      .post('/bonds')
      .set('authorization', `bearer ${admin_token}`)
      .send({
        name: 'Bond A',
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Bond A',
        created_at: expect.any(String),
        updated_at: expect.any(String),
      }),
    );
  });
});

describe('UpdateBond', () => {
  it('updates a bond of the database', async () => {
    const newBond = new Bond();
    newBond.name = 'Bond B';
    const bondsRepository = getCustomRepository(BondsRepository);
    const bond = await bondsRepository.save(newBond);

    const response = await request(app)
      .put(`/bonds/${bond.id}`)
      .set('authorization', `bearer ${admin_token}`)
      .send({
        name: 'Bond updated',
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Bond updated',
        created_at: expect.any(String),
        updated_at: expect.any(String),
      }),
    );
  });
});

describe('DeleteBond', () => {
  it('deletes a bond', async () => {
    const newBond = new Bond();
    newBond.name = 'Bond C';
    const bondsRepository = getCustomRepository(BondsRepository);
    const bond = await bondsRepository.save(newBond);
    const response = await request(app)
      .delete(`/bonds/${bond.id}`)
      .set('authorization', `bearer ${admin_token}`)
      .send();

    // expect(response.status).toBe(204);
    const deletedBond = await bondsRepository.findById(bond.id);
    expect(deletedBond).toBeFalsy();
  });
});
