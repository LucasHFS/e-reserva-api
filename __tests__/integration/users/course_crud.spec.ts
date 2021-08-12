import request from 'supertest';
import { Connection, getConnection, getCustomRepository } from 'typeorm';
import app from '@shared/infra/http/app';

import createConnection from '@shared/infra/typeorm';
import CoursesRepository from '@modules/users/infra/typeorm/repositories/CoursesRepository';
import Course from '@modules/users/infra/typeorm/entities/Course';

import generateToken from '@shared/helpers/generateToken';

let admin_token: string;

let connection: Connection;

let coursesRepository: CoursesRepository;

beforeAll(async () => {
  connection = await createConnection('test-connection');
  await connection.query('DELETE FROM user_courses');
  await connection.query('DELETE FROM users');
  await connection.query('DELETE FROM courses');
  await connection.query('DELETE FROM bonds');

  coursesRepository = getCustomRepository(CoursesRepository);

  const token = await generateToken();

  admin_token = token;
});

afterAll(async () => {
  const mainConnection = getConnection();

  await connection.close();
  await mainConnection.close();
});

describe('CreateCourse', () => {
  it('adds a course to the database', async () => {
    const response = await request(app)
      .post('/courses')
      .set('authorization', `bearer ${admin_token}`)
      .send({
        name: 'Course A',
      });

    // expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Course A',
        created_at: expect.any(String),
        updated_at: expect.any(String),
      }),
    );
  });
});

describe('UpdateCourse', () => {
  it('updates a course of the database', async () => {
    const newCourse = new Course();
    newCourse.name = 'Course B';

    const course = await coursesRepository.save(newCourse);

    const response = await request(app)
      .put(`/courses/${course.id}`)
      .set('authorization', `bearer ${admin_token}`)
      .send({
        name: 'Course updated',
      });

    // expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Course updated',
        created_at: expect.any(String),
        updated_at: expect.any(String),
      }),
    );
  });
});

describe('DeleteCourse', () => {
  it('deletes a course', async () => {
    const newCourse = new Course();
    newCourse.name = 'Course C';

    const course = await coursesRepository.save(newCourse);
    const response = await request(app)
      .delete(`/courses/${course.id}`)
      .set('authorization', `bearer ${admin_token}`)
      .send();

    expect(response.status).toBe(204);
    const deletedCourse = await coursesRepository.findById(course.id);
    expect(deletedCourse).toBeFalsy();
  });
});
