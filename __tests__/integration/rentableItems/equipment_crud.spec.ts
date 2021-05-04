import request from 'supertest';
import { Connection, getConnection, getCustomRepository } from 'typeorm';
import app from '@shared/infra/http/app';

import createConnection from '@shared/infra/typeorm';
import EquipmentsRepository from '@modules/rentable-items/infra/typeorm/repositories/EquipmentsRepository';
import Equipment from '@modules/rentable-items/infra/typeorm/entities/Equipment';

let connection: Connection;

let equipmentsRepository: EquipmentsRepository;

beforeAll(async () => {
  connection = await createConnection('test-connection');
  await connection.query('DELETE FROM equipments');

  equipmentsRepository = getCustomRepository(EquipmentsRepository);
});

afterAll(async () => {
  const mainConnection = getConnection();

  await connection.close();
  await mainConnection.close();
});

describe('CreateSurvivor', () => {
  it('adds a equipment to the database', async () => {
    const response = await request(app).post('/equipments').send({
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
      .send();

    expect(response.status).toBe(204);
    const deletedEquipment = await equipmentsRepository.findById(equipment.id);
    expect(deletedEquipment).toBeFalsy();
  });
});
