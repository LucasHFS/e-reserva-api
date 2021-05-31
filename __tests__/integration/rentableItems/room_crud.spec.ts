import request from 'supertest';
import { Connection, getConnection, getCustomRepository } from 'typeorm';
import app from '@shared/infra/http/app';

import createConnection from '@shared/infra/typeorm';
import RoomsRepository from '@modules/rentable-items/infra/typeorm/repositories/RoomsRepository';
import Room from '@modules/rentable-items/infra/typeorm/entities/Room';
import generateToken from '@shared/helpers/generateToken';

let connection: Connection;

let roomsRepository: RoomsRepository;
let admin_token: string;

beforeAll(async () => {
  connection = await createConnection('test-connection');
  await connection.query('DELETE FROM courses');
  await connection.query('DELETE FROM users');
  await connection.query('DELETE FROM bonds');
  await connection.query('DELETE FROM rooms');

  const token = await generateToken();
  admin_token = token;
  roomsRepository = getCustomRepository(RoomsRepository);
});

afterAll(async () => {
  const mainConnection = getConnection();

  await connection.close();
  await mainConnection.close();
});

describe('CreateSurvivor', () => {
  it('adds a room to the database', async () => {
    const response = await request(app)
      .post('/rooms')
      .set('authorization', `bearer ${admin_token}`)
      .send({
        name: '101',
        description: 'default classroom',
        type: 'classroom',
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: '101',
        description: 'default classroom',
        type: 'classroom',
        created_at: expect.any(String),
        updated_at: expect.any(String),
      }),
    );
  });
});

describe('UpdateRoom', () => {
  it('updates a room of the database', async () => {
    const newRoom = new Room();
    newRoom.name = '102';
    newRoom.description = 'new descriptions';
    newRoom.type = 'classroom';

    const room = await roomsRepository.save(newRoom);

    const response = await request(app)
      .put(`/rooms/${room.id}`)
      .set('authorization', `bearer ${admin_token}`)
      .send({
        name: '102',
        description: 'new descriptions',
        type: 'classroom',
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: '102',
        description: 'new descriptions',
        type: 'classroom',
        created_at: expect.any(String),
        updated_at: expect.any(String),
      }),
    );
  });
});

describe('DeleteRoom', () => {
  it('deletes a room', async () => {
    const newRoom = new Room();
    newRoom.name = '101';
    newRoom.description = 'description';
    newRoom.type = 'classroom';

    const room = await roomsRepository.save(newRoom);

    const response = await request(app)
      .delete(`/rooms/${room.id}`)
      .set('authorization', `bearer ${admin_token}`)
      .send();

    expect(response.status).toBe(204);
    const deletedRoom = await roomsRepository.findById(room.id);
    expect(deletedRoom).toBeFalsy();
  });
});
