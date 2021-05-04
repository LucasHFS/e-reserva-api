import request from 'supertest';
import { Connection, getConnection, getCustomRepository } from 'typeorm';
import app from '@shared/infra/http/app';

import createConnection from '@shared/infra/typeorm';
import BondsRepository from '@modules/users/infra/typeorm/repositories/BondsRepository';
import Bond from '@modules/users/infra/typeorm/entities/Bond';

let connection: Connection;

let bondsRepository: BondsRepository;

beforeAll(async () => {
  connection = await createConnection('test-connection');
  await connection.query('DELETE FROM bonds');

  bondsRepository = getCustomRepository(BondsRepository);
});

afterAll(async () => {
  const mainConnection = getConnection();

  await connection.close();
  await mainConnection.close();
});

describe('CreateSurvivor', () => {
  it('adds a bond to the database', async () => {
    const response = await request(app).post('/bonds').send({
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
    newBond.name = 'Bond a';

    const bond = await bondsRepository.save(newBond);

    const response = await request(app).put(`/bonds/${bond.id}`).send({
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
    newBond.name = 'Bond a';

    const bond = await bondsRepository.save(newBond);
    const response = await request(app).delete(`/bonds/${bond.id}`).send();

    expect(response.status).toBe(204);
    const deletedBond = await bondsRepository.findById(bond.id);
    expect(deletedBond).toBeFalsy();
  });
});
