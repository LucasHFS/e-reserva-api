import request from 'supertest';
import { Connection, getConnection, getCustomRepository } from 'typeorm';
import app from '@shared/infra/http/app';

import createConnection from '@shared/infra/typeorm';
import SportCourtsRepository from '@modules/rentable-items/infra/typeorm/repositories/SportCourtsRepository';
import SportCourt from '@modules/rentable-items/infra/typeorm/entities/SportCourt';
import generateToken from '@shared/helpers/generateToken';

let sportCourtsRepository: SportCourtsRepository;

let admin_token: string;

let connection: Connection;

beforeAll(async () => {
  connection = await createConnection('test-connection');
  await connection.query('DELETE FROM sport_courts');
  await connection.query('DELETE FROM user_courses');
  await connection.query('DELETE FROM users');
  await connection.query('DELETE FROM courses');
  await connection.query('DELETE FROM roles');
  await connection.query('DELETE FROM bonds');
  const token = await generateToken();
  admin_token = token;

  sportCourtsRepository = getCustomRepository(SportCourtsRepository);
});

afterAll(async () => {
  const mainConnection = getConnection();

  await connection.close();
  await mainConnection.close();
});


beforeEach(async () => {
  connection = await getConnection('test-connection');
  await connection.query('DELETE FROM sport_courts');
});

describe('ListSportCourts', () => {
  it('shows sport_courts', async () => {
    const newSportCourt = new SportCourt();
    newSportCourt.name = '102';
    newSportCourt.description = 'new descriptions';

    const sport_court = await sportCourtsRepository.save(newSportCourt);

    const response = await request(app)
      .get(`/sportcourts`)
      .set('authorization', `bearer ${admin_token}`)

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining([{
        id: sport_court.id,
        name: sport_court.name,
        description: sport_court.description,
        created_at: expect.any(String),
        updated_at: expect.any(String),
      }]),
    );
  });
});

describe('FindOneSportCourt', () => {
  it('shows one sport_court', async () => {
    const newSportCourt = new SportCourt();
    newSportCourt.name = '102';
    newSportCourt.description = 'new descriptions';

    const sport_court = await sportCourtsRepository.save(newSportCourt);

    const response = await request(app)
      .get(`/sportcourts/${sport_court.id}`)
      .set('authorization', `bearer ${admin_token}`)

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: sport_court.id,
        name: sport_court.name,
        description: sport_court.description,
        created_at: expect.any(String),
        updated_at: expect.any(String),
      }),
    );
  });

  it('return error when equipoment not found', async () => {
    const response = await request(app)
      .get(`/sportcourts/400bf39a-aa98-4e9c-aee4-0deace5e8ab2`)
      .set('authorization', `bearer ${admin_token}`)

    expect(response.status).toBe(404);
  });
});

describe('CreateSportCourt', () => {
  it('adds a sportCourt to the database', async () => {
    const response = await request(app)
      .post('/sportcourts')
      .set('authorization', `bearer ${admin_token}`)
      .send({
        name: 'Test',
        description: 'description',
      });

    // expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Test',
        description: 'description',
        created_at: expect.any(String),
        updated_at: expect.any(String),
      }),
    );
  });
});

describe('UpdateSportCourt', () => {
  it('updates a sportCourt of the database', async () => {
    const newSportCourt = new SportCourt();
    newSportCourt.name = 'test';
    newSportCourt.description = 'description';

    const sportCourtsRepository = getCustomRepository(SportCourtsRepository);

    const sportCourt = await sportCourtsRepository.save(newSportCourt);

    const response = await request(app)
      .put(`/sportcourts/${sportCourt.id}`)
      .set('authorization', `bearer ${admin_token}`)
      .send({
        name: 'test updated',
        description: 'description things',
      });

    // expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'test updated',
        description: 'description things',
        created_at: expect.any(String),
        updated_at: expect.any(String),
      }),
    );
  });
});

describe('DeleteSportCourt', () => {
  it('deletes a sportCourt', async () => {
    const newSportCourt = new SportCourt();
    newSportCourt.name = 'Test';
    newSportCourt.description = 'description';
    const sportCourtsRepository = getCustomRepository(SportCourtsRepository);
    const sportCourt = await sportCourtsRepository.save(newSportCourt);

    const response = await request(app)
      .delete(`/sportcourts/${sportCourt.id}`)
      .set('authorization', `bearer ${admin_token}`)
      .send();

    // expect(response.status).toBe(204);
    const deletedSportCourt = await sportCourtsRepository.findById(
      sportCourt.id,
    );
    expect(deletedSportCourt).toBeFalsy();
  });
});
