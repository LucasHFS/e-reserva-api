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
import EquipmentsRepository from '@modules/rentable-items/infra/typeorm/repositories/EquipmentsRepository';
import EquipmentReserveRepository from '@modules/reserves/infra/typeorm/repositories/EquipmentReservesRepository';

let connection: Connection;

let admin_token: string;

beforeAll(async () => {
  connection = await createConnection('test-connection');
  await connection.query('DELETE FROM users');
  await connection.query('DELETE FROM equipment_reserve');
  await connection.query('DELETE FROM bonds');
  await connection.query('DELETE FROM courses');
  await connection.query('DELETE FROM roles');
  await connection.query('DELETE FROM equipments');
  
  const token = await generateToken();

  admin_token = token;
});

afterAll(async () => {
  const mainConnection = getConnection();

  await connection.close();
  await mainConnection.close();
});

describe('EquipmentReserveController', () => {
  describe('all', () => {
    it('return all equipment reserves', async () => {
      const usersRepository = getCustomRepository(UsersRepository);
      const bondsRepository = getCustomRepository(BondsRepository);
      const rolesRepository = getCustomRepository(RolesRepository);
      const coursesRepository = getCustomRepository(CoursesRepository);
      const equipmentsRepository = getCustomRepository(EquipmentsRepository);
      const equipmentsReserveRepository = getCustomRepository(EquipmentReserveRepository);
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
    
      const equipment = await equipmentsRepository.create({
        name: 'equipment1',
        description: 'description',
      });

      const reserve = await equipmentsReserveRepository.create({
        user_id: user.id,
        equipment_id: equipment.id,
        starts_at: new Date(),
      });

      const response = await request(app)
        .get(`/reserves/equipments`)
        .set('authorization', `bearer ${admin_token}`);
  
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].id).toBe(reserve.id);
    });
  });

  describe('findOne', () => {
    it('when reserve is not found, return error', async () => {
      const response = await request(app)
        .get(`/reserves/equipments/1dcaceff-3a85-4a8d-a775-8b3ad5a4565b`)
        .set('authorization', `bearer ${admin_token}`);
  
      expect(response.status).toBe(404);
    });

    it('returns with succes', async () => {
      const usersRepository = getCustomRepository(UsersRepository);
      const bondsRepository = getCustomRepository(BondsRepository);
      const rolesRepository = getCustomRepository(RolesRepository);
      const coursesRepository = getCustomRepository(CoursesRepository);
      const equipmentsRepository = getCustomRepository(EquipmentsRepository);
      const equipmentsReserveRepository = getCustomRepository(EquipmentReserveRepository);
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
    
      const equipment = await equipmentsRepository.create({
        name: 'equipment1',
        description: 'description',
      });

      const reserve = await equipmentsReserveRepository.create({
        user_id: user.id,
        equipment_id: equipment.id,
        starts_at: new Date(),
      });

      const response = await request(app)
        .get(`/reserves/equipments/${reserve.id}`)
        .set('authorization', `bearer ${admin_token}`);
  
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(reserve.id);
    });
  });

  describe('create', () => {
    it('when equipment is not found, returns error', async () => {
      const date = new Date();
      date.setDate(date.getDate() - 1)

      const response = await request(app)
        .post(`/reserves/equipments`)
        .set('authorization', `bearer ${admin_token}`)
        .send({
          equipment_id: '1dcaceff-3a85-4a8d-a775-8b3ad5a4565b',
          starts_at: date,
        });

      expect(response.status).toBe(404);
    });

    it('when start_date is in the past, returns error', async () => {
      const equipmentsRepository = getCustomRepository(EquipmentsRepository);
    
      const equipment = await equipmentsRepository.create({
        name: 'equipment2',
        description: 'description',
      });

      const date = new Date();
      date.setDate(date.getDate() - 1)

      const response = await request(app)
        .post(`/reserves/equipments`)
        .set('authorization', `bearer ${admin_token}`)
        .send({
          equipment_id: equipment.id,
          starts_at: date,
        });

      expect(response.status).toBe(400);
    });

    it('when the start_date sent is already booked, returns error', async () => {
      const usersRepository = getCustomRepository(UsersRepository);
      const bondsRepository = getCustomRepository(BondsRepository);
      const rolesRepository = getCustomRepository(RolesRepository);
      const coursesRepository = getCustomRepository(CoursesRepository);
      const equipmentsRepository = getCustomRepository(EquipmentsRepository);
      const equipmentsReserveRepository = getCustomRepository(EquipmentReserveRepository);
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
  
      const equipment = await equipmentsRepository.create({
        name: 'equipment2',
        description: 'description',
      });

      const date = new Date();

      await equipmentsReserveRepository.create({
        user_id: user.id,
        equipment_id: equipment.id,
        starts_at: date,
      });

      const response = await request(app)
        .post(`/reserves/equipments`)
        .set('authorization', `bearer ${admin_token}`)
        .send({
          equipment_id: equipment.id,
          starts_at: date,
        });

      expect(response.status).toBe(400);
      
    });

    it('creates with success', async () => {
      const equipmentsRepository = getCustomRepository(EquipmentsRepository);
    
      const equipment = await equipmentsRepository.create({
        name: 'equipment3',
        description: 'description',
      });

      const date = new Date();
      date.setDate(date.getDate() + 1)

      const response = await request(app)
        .post(`/reserves/equipments`)
        .set('authorization', `bearer ${admin_token}`)
        .send({
          equipment_id: equipment.id,
          starts_at: date,
        });

      expect(response.status).toBe(201);
      expect(response.body.id).toEqual(expect.any(String));
    });
  });
});
