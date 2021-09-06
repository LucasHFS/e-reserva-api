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

beforeEach(async () => {
  connection = await getConnection('test-connection');
  await connection.query('DELETE FROM equipments');

  const equipmentsRepository = getCustomRepository(EquipmentsRepository);

  await equipmentsRepository.create({
    name: 'equipment1',
    description: 'description',
  });

  await equipmentsRepository.create({
    name: 'equipment2',
    description: 'description',
  });
});

describe('AvailableEquipmentsController', () => {
  describe('when valid fields sent', () => {
    it('when all equipments are available returns all equipment', async () => {
      const response = await request(app)
        .get(`/reserves/equipments/available`)
        .query({
          date: 1630853759388,
          hour: 19,
          minute: 0
        })
        .set('authorization', `bearer ${admin_token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });

    it('when one equipment is booked returns other equipment', async () => {
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
    
      const equipment = await equipmentsRepository.first();

      const date = new Date()
      date.setHours(19);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);

      const reserve = await equipmentsReserveRepository.create({
        user_id: user.id,
        equipment_id: equipment!.id,
        starts_at: date,
      });

      const response = await request(app)
        .get(`/reserves/equipments/available`)
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
          .get(`/reserves/equipments/available`)
          .set('authorization', `bearer ${admin_token}`);
    
        expect(response.status).toBe(400);
      });
    });
  });
});
