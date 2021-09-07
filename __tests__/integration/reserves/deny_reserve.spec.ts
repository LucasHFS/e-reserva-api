import request from 'supertest';
import { Connection, getConnection, getCustomRepository } from 'typeorm';
import app from '@shared/infra/http/app';

import createConnection from '@shared/infra/typeorm';
import generateToken from '@shared/helpers/generateToken';
import BondsRepository from '@modules/users/infra/typeorm/repositories/BondsRepository';
import RolesRepository from '@modules/users/infra/typeorm/repositories/RolesRepository';
import CoursesRepository from '@modules/users/infra/typeorm/repositories/CoursesRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import BCryptHashProvider from '@modules/users/providers/HashProvider/implementations/BCryptHashProvider';
import RoomsRepository from '@modules/rentable-items/infra/typeorm/repositories/RoomsRepository';
import RoomReserveRepository from '@modules/reserves/infra/typeorm/repositories/RoomReservesRepository';

let connection: Connection;

let admin_token: string;

beforeAll(async () => {
  connection = await createConnection('test-connection');
  await connection.query('DELETE FROM users');
  await connection.query('DELETE FROM bonds');
  await connection.query('DELETE FROM courses');
  await connection.query('DELETE FROM roles');
  await connection.query('DELETE FROM rooms');
  
  const token = await generateToken();

  admin_token = token;
});

afterAll(async () => {
  const mainConnection = getConnection();

  await connection.close();
  await mainConnection.close();
});

describe('AcceptsReserve', () => {
  it('accepts reserve', async () => {
    const usersRepository = getCustomRepository(UsersRepository);
    const bondsRepository = getCustomRepository(BondsRepository);
    const rolesRepository = getCustomRepository(RolesRepository);
    const coursesRepository = getCustomRepository(CoursesRepository);
    const roomsRepository = getCustomRepository(RoomsRepository);
    const roomsReserveRepository = getCustomRepository(RoomReserveRepository);
    const hashProvider = new BCryptHashProvider();
  
    const bond = await bondsRepository.create({ name: 'bondx' });
    const role = await rolesRepository.create({ name: 'AD', description: 'abc' });
    const course = await coursesRepository.create({ name: 'coursex' });
  
    const user = await usersRepository.create({
      name: 'Lucas Silva',
      email: 'lucas3331@gmail.com',
      cpf: '70142411881',
      phone: '62991431044',
      password: await hashProvider.generateHash('123456'),
      bond,
      role,
      courses: [course],
    });

    const room = await roomsRepository.create({
      name: 'room1',
      description: 'description',
      type: 'auditorium'
    });

    const reserve = await roomsReserveRepository.create({
      user_id: user.id,
      room_id: room.id,
      status: 'pending',
      starts_at: new Date(),
    });

    const response = await request(app)
      .put(`/reserves/${reserve.id}/deny`)
      .set('authorization', `bearer ${admin_token}`);

    expect(response.status).toBe(204);
    // expect(response.body).toEqual(
    //   expect.objectContaining({
    //     user_id: user.id,
    //     room_id: room.id,
    //     status: 'denied',
    //     starts_at: expect.any(String),
    //   }),
    // );
  });


  it("doesn't find the reserve id", async () => {
    
    const response = await request(app)
      .put(`/reserves/non-existing-reserve-id/deny`)
      .set('authorization', `bearer ${admin_token}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'Erro ao localizar reserva', 
        status: 'erro'
      })
    );
  });
});
