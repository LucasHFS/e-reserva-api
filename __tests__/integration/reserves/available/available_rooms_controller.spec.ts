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
  await connection.query('DELETE FROM room_reserve');
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

beforeEach(async () => {
  connection = await getConnection('test-connection');
  await connection.query('DELETE FROM rooms');

  const roomsRepository = getCustomRepository(RoomsRepository);

  await roomsRepository.create({
    name: 'room1',
    type: 'room',
    description: 'description',
  });

  await roomsRepository.create({
    name: 'room2',
    type: 'room',
    description: 'description',
  });
});

describe('AvailableRoomsController', () => {
  describe('when valid fields sent', () => {
    it('when all rooms are available returns all room', async () => {
      const response = await request(app)
        .get(`/reserves/rooms/available`)
        .query({
          date: 1630853759388,
          hour: 19,
          minute: 0
        })
        .set('authorization', `bearer ${admin_token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });

    it('when one room is booked returns other room', async () => {
      const usersRepository = getCustomRepository(UsersRepository);
      const bondsRepository = getCustomRepository(BondsRepository);
      const rolesRepository = getCustomRepository(RolesRepository);
      const coursesRepository = getCustomRepository(CoursesRepository);
      const roomsRepository = getCustomRepository(RoomsRepository);
      const roomsReserveRepository = getCustomRepository(RoomReserveRepository);
      const hashProvider = new BCryptHashProvider();
      const bond = await bondsRepository.create({ name: 'bondx' });
      const role = await rolesRepository.create({ name: 'Admin', description: 'abc' });
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
    
      const room = await roomsRepository.first();

      const date = new Date()
      date.setHours(19);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);

      const reserve = await roomsReserveRepository.create({
        user_id: user.id,
        room_id: room!.id,
        starts_at: date,
        status: 'accepted',
      });

      const response = await request(app)
        .get(`/reserves/rooms/available`)
        .query({
          date: date.getTime(),
          hour: date.getHours(),
          minute: date.getMinutes()
        })
        .set('authorization', `bearer ${admin_token}`);
        
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).not.toBe(reserve.id);
    });

    describe('when invalid fields sent', () => {
      it('returns error', async () => {
        const response = await request(app)
          .get(`/reserves/rooms/available`)
          .set('authorization', `bearer ${admin_token}`);
    
        expect(response.status).toBe(400);
      });
    });
  });
});
