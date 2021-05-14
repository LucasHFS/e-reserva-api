import request from 'supertest';
import {
  Connection,
  getConnection,
  getCustomRepository,
  getRepository,
} from 'typeorm';
import app from '@shared/infra/http/app';

import createConnection from '@shared/infra/typeorm';
import User from '@modules/users/infra/typeorm/entities/User';
import BCryptHashProvider from '@modules/users/providers/HashProvider/implementations/BCryptHashProvider';
import RolesRepository from '@modules/users/infra/typeorm/repositories/RolesRepository';
import BondsRepository from '@modules/users/infra/typeorm/repositories/BondsRepository';

let connection: Connection;
let rolesRepository: RolesRepository;
let bondsRepository: BondsRepository;

// Todo: first() change it

beforeAll(async () => {
  connection = await createConnection('test-connection');
  await connection.query('DELETE FROM user_courses');
  await connection.query('DELETE FROM user_tokens');
  await connection.query('DELETE FROM users');
  rolesRepository = getCustomRepository(RolesRepository);
  bondsRepository = getCustomRepository(BondsRepository);
});

afterAll(async () => {
  const mainConnection = getConnection();

  await connection.close();
  await mainConnection.close();
});

describe('CreateSession', () => {
  it('logs in to the system', async () => {
    const hashProvider = new BCryptHashProvider();
    const userRepository = getRepository(User);
    const role = await rolesRepository.first();
    const bond = await bondsRepository.first();

    const user = await userRepository.save({
      name: 'Lucas Silva',
      email: 'lucas@gmail.com',
      cpf: '70142411175',
      phone: '62991431044',
      password: await hashProvider.generateHash('123456'),
      roleId: role!.id,
      bondId: bond!.id,
    });

    const response = await request(app).post('/sessions').send({
      cpf: user.cpf,
      password: '123456',
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        user: expect.any(Object),
        token: expect.any(String),
      }),
    );
  });

  it("doesn't log in to the system with wrong credentials", async () => {
    const hashProvider = new BCryptHashProvider();
    const userRepository = getRepository(User);
    const role = await rolesRepository.first();
    const bond = await bondsRepository.first();

    const user = await userRepository.save({
      name: 'Lucas Silva',
      email: 'lucas2@gmail.com',
      cpf: '70142411177',
      phone: '62991431044',
      password: await hashProvider.generateHash('123456'),
      roleId: role!.id,
      bondId: bond!.id,
    });
    const response = await request(app).post('/sessions').send({
      cpf: user.cpf,
      password: '123456',
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        user: expect.any(Object),
        token: expect.any(String),
      }),
    );
  });
});
