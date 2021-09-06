import request from 'supertest';
import { Connection, getConnection, getCustomRepository } from 'typeorm';
import app from '@shared/infra/http/app';

import createConnection from '@shared/infra/typeorm';
import EquipmentsRepository from '@modules/rentable-items/infra/typeorm/repositories/EquipmentsRepository';
import Equipment from '@modules/rentable-items/infra/typeorm/entities/Equipment';
import generateToken from '@shared/helpers/generateToken';

let connection: Connection;

let equipmentsRepository: EquipmentsRepository;
let admin_token: string;

beforeAll(async () => {
  connection = await createConnection('test-connection');
  await connection.query('DELETE FROM equipments');
  await connection.query('DELETE FROM user_courses');
  await connection.query('DELETE FROM users');
  await connection.query('DELETE FROM roles');
  await connection.query('DELETE FROM courses');
  await connection.query('DELETE FROM bonds');

  const token = await generateToken();

  admin_token = token;

  equipmentsRepository = getCustomRepository(EquipmentsRepository);
});

afterAll(async () => {
  const mainConnection = getConnection();

  await connection.close();
  await mainConnection.close();
});


beforeEach(async () => {
  connection = await getConnection('test-connection');
  await connection.query('DELETE FROM equipments');
});


describe('ListEquipments', () => {
  it('shows equipments', async () => {
    const newEquipment = new Equipment();
    newEquipment.name = '102';
    newEquipment.description = 'new descriptions';

    const equipment = await equipmentsRepository.save(newEquipment);

    const response = await request(app)
      .get(`/equipments`)
      .set('authorization', `bearer ${admin_token}`)

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining([{
        id: equipment.id,
        name: equipment.name,
        description: equipment.description,
        created_at: expect.any(String),
        updated_at: expect.any(String),
      }]),
    );
  });
});

describe('FindOneEquipment', () => {
  it('shows one equipment', async () => {
    const newEquipment = new Equipment();
    newEquipment.name = '102';
    newEquipment.description = 'new descriptions';

    const equipment = await equipmentsRepository.save(newEquipment);

    const response = await request(app)
      .get(`/equipments/${equipment.id}`)
      .set('authorization', `bearer ${admin_token}`)

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: equipment.id,
        name: equipment.name,
        description: equipment.description,
        created_at: expect.any(String),
        updated_at: expect.any(String),
      }),
    );
  });

  it('return error when equipoment not found', async () => {
    const response = await request(app)
      .get(`/equipments/400bf39a-aa98-4e9c-aee4-0deace5e8ab2`)
      .set('authorization', `bearer ${admin_token}`)

    expect(response.status).toBe(404);
  });
});


describe('CreateEquipment', () => {
  it('adds a equipment to the database', async () => {
    const response = await request(app)
      .post('/equipments')
      .set('authorization', `bearer ${admin_token}`)
      .send({
        name: '101',
        description: 'default classequipment',
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: '101',
        description: 'default classequipment',
        created_at: expect.any(String),
        updated_at: expect.any(String),
      }),
    );
  });
});

describe('UpdateEquipment', () => {
  it('updates a equipment of the database', async () => {
    const newEquipment = new Equipment();
    newEquipment.name = '102';
    newEquipment.description = 'new descriptions';

    const equipment = await equipmentsRepository.save(newEquipment);

    const response = await request(app)
      .put(`/equipments/${equipment.id}`)
      .set('authorization', `bearer ${admin_token}`)
      .send({
        name: '102',
        description: 'new descriptions',
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: '102',
        description: 'new descriptions',
        created_at: expect.any(String),
        updated_at: expect.any(String),
      }),
    );
  });
});

describe('DeleteEquipment', () => {
  it('deletes a equipment', async () => {
    const newEquipment = new Equipment();
    newEquipment.name = '101';
    newEquipment.description = 'description';

    const equipment = await equipmentsRepository.save(newEquipment);

    const response = await request(app)
      .delete(`/equipments/${equipment.id}`)
      .set('authorization', `bearer ${admin_token}`)
      .send();

    expect(response.status).toBe(204);
    const deletedEquipment = await equipmentsRepository.findById(equipment.id);
    expect(deletedEquipment).toBeFalsy();
  });
});
