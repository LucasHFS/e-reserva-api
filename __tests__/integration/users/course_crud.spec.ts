import request from 'supertest';
import { Connection, getConnection, getCustomRepository } from 'typeorm';
import app from '@shared/infra/http/app';

import createConnection from '@shared/infra/typeorm';
import CoursesRepository from '@modules/users/infra/typeorm/repositories/CoursesRepository';
import Course from '@modules/users/infra/typeorm/entities/Course';

let connection: Connection;

let coursesRepository: CoursesRepository;

beforeAll(async () => {
  connection = await createConnection('test-connection');
  await connection.query('DELETE FROM courses');

  coursesRepository = getCustomRepository(CoursesRepository);
});

afterAll(async () => {
  const mainConnection = getConnection();

  await connection.close();
  await mainConnection.close();
});

describe('CreateSurvivor', () => {
  it('adds a course to the database', async () => {
    const response = await request(app).post('/courses').send({
      name: 'Manager',
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Manager',
        created_at: expect.any(String),
        updated_at: expect.any(String),
      }),
    );
  });
});

describe('UpdateCourse', () => {
  it('updates a course of the database', async () => {
    const newCourse = new Course();
    newCourse.name = 'Manageer';

    const course = await coursesRepository.save(newCourse);

    const response = await request(app).put(`/courses/${course.id}`).send({
      name: 'manager updated',
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'manager updated',
        created_at: expect.any(String),
        updated_at: expect.any(String),
      }),
    );
  });
});

describe('DeleteCourse', () => {
  it('deletes a course', async () => {
    const newCourse = new Course();
    newCourse.name = 'Manageer';

    const course = await coursesRepository.save(newCourse);
    const response = await request(app).delete(`/courses/${course.id}`).send();

    expect(response.status).toBe(204);
    const deletedCourse = await coursesRepository.findById(course.id);
    expect(deletedCourse).toBeFalsy();
  });
});
