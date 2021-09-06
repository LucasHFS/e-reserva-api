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

describe('RoomReserveController', () => {
  describe('all', () => {
    it('return all room reserves', async () => {
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
    
      const room = await roomsRepository.create({
        name: 'room1',
        description: 'description',
        type: 'room'
      });

      const reserve = await roomsReserveRepository.create({
        user_id: user.id,
        room_id: room.id,
        starts_at: new Date(),
        status: 'accepted',
      });

      const response = await request(app)
        .get(`/reserves/rooms`)
        .set('authorization', `bearer ${admin_token}`);
  
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].id).toBe(reserve.id);
    });
  });

  describe('findOne', () => {
    it('when reserve is not found, return error', async () => {
      const response = await request(app)
        .get(`/reserves/rooms/1dcaceff-3a85-4a8d-a775-8b3ad5a4565b`)
        .set('authorization', `bearer ${admin_token}`);
  
      expect(response.status).toBe(404);
    });

    it('returns with succes', async () => {
      const usersRepository = getCustomRepository(UsersRepository);
      const bondsRepository = getCustomRepository(BondsRepository);
      const rolesRepository = getCustomRepository(RolesRepository);
      const coursesRepository = getCustomRepository(CoursesRepository);
      const roomsRepository = getCustomRepository(RoomsRepository);
      const roomsReserveRepository = getCustomRepository(RoomReserveRepository);
      const hashProvider = new BCryptHashProvider();
      const bond = await bondsRepository.create({ name: 'bond1' });
      const role = await rolesRepository.create({ name: 'Admin1', description: 'abc' });
      const course = await coursesRepository.create({ name: 'course1' });

      const user = await usersRepository.create({
        name: 'Lucas Silva',
        email: 'lucas3332@gmail.com',
        cpf: '70142411882',
        phone: '62991431044',
        password: await hashProvider.generateHash('123456'),
        bond,
        role,
        courses: [course],
      });
    
      const room = await roomsRepository.create({
        name: 'room1',
        description: 'description',
        type: 'room'
      });
      
      const reserve = await roomsReserveRepository.create({
        user_id: user.id,
        room_id: room.id,
        starts_at: new Date(),
        status: 'accepted',
      });

      const response = await request(app)
        .get(`/reserves/rooms/${reserve.id}`)
        .set('authorization', `bearer ${admin_token}`);
  
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(reserve.id);
    });
  });

  describe('create', () => {
    it('when room is not found, returns error', async () => {
      const date = new Date();
      date.setDate(date.getDate() - 1)

      const response = await request(app)
        .post(`/reserves/rooms`)
        .set('authorization', `bearer ${admin_token}`)
        .send({
          room_id: '1dcaceff-3a85-4a8d-a775-8b3ad5a4565b',
          starts_at: date,
        });

      expect(response.status).toBe(404);
    });

    it('when start_date is in the past, returns error', async () => {
      const roomsRepository = getCustomRepository(RoomsRepository);
    
      const room = await roomsRepository.create({
        name: 'room2',
        description: 'description',
        type: 'room'
      });
      
      const date = new Date();
      date.setDate(date.getDate() - 1)
      
      const response = await request(app)
      .post(`/reserves/rooms`)
      .set('authorization', `bearer ${admin_token}`)
      .send({
        room_id: room.id,
        starts_at: date,
        });

      expect(response.status).toBe(400);
    });

    it('when the start_date sent is already booked, returns error', async () => {
      const usersRepository = getCustomRepository(UsersRepository);
      const bondsRepository = getCustomRepository(BondsRepository);
      const rolesRepository = getCustomRepository(RolesRepository);
      const coursesRepository = getCustomRepository(CoursesRepository);
      const roomsRepository = getCustomRepository(RoomsRepository);
      const roomsReserveRepository = getCustomRepository(RoomReserveRepository);
      const hashProvider = new BCryptHashProvider();
      const bond = await bondsRepository.create({ name: 'bond4' });
      const role = await rolesRepository.create({ name: 'Admin4', description: 'abc' });
      const course = await coursesRepository.create({ name: 'course4' });
    
      const user = await usersRepository.create({
        name: 'Lucas Silva',
        email: 'luc33331@gmail.com',
        cpf: '70142411885',
        phone: '62991431044',
        password: await hashProvider.generateHash('123456'),
        bond,
        role,
        courses: [course],
      });
  
      const room = await roomsRepository.create({
        name: 'room2',
        description: 'description',
        type: 'room'
      });

      const date = new Date();

      await roomsReserveRepository.create({
        user_id: user.id,
        room_id: room.id,
        starts_at: date,
        status: 'accepted'
      });

      const response = await request(app)
        .post(`/reserves/rooms`)
        .set('authorization', `bearer ${admin_token}`)
        .send({
          room_id: room.id,
          starts_at: date,
        });

      expect(response.status).toBe(400);
      
    });

    it('creates with success', async () => {
      const roomsRepository = getCustomRepository(RoomsRepository);
    
      const room = await roomsRepository.create({
        name: 'room3',
        description: 'description',
        type: 'room'
      });

      const date = new Date();
      date.setDate(date.getDate() + 1)

      const response = await request(app)
        .post(`/reserves/rooms`)
        .set('authorization', `bearer ${admin_token}`)
        .send({
          room_id: room.id,
          starts_at: date,
        });

      expect(response.status).toBe(201);
      expect(response.body.id).toEqual(expect.any(String));
    });
  });
});
