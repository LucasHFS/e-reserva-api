import request from 'supertest';
import { Connection, getConnection, getCustomRepository } from 'typeorm';
import app from '@shared/infra/http/app';

import createConnection from '@shared/infra/typeorm';
import BondsRepository from '@modules/users/infra/typeorm/repositories/BondsRepository';
import RolesRepository from '@modules/users/infra/typeorm/repositories/RolesRepository';
import CoursesRepository from '@modules/users/infra/typeorm/repositories/CoursesRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';
import BCryptHashProvider from '@modules/users/providers/HashProvider/implementations/BCryptHashProvider';

let connection: Connection;

let bondsRepository: BondsRepository;
let rolesRepository: RolesRepository;
let coursesRepository: CoursesRepository;
let usersRepository: UsersRepository;

beforeAll(async () => {
  connection = await createConnection('test-connection');
  await connection.query('DELETE FROM user_courses');
  await connection.query('DELETE FROM users');

  bondsRepository = getCustomRepository(BondsRepository);
  rolesRepository = getCustomRepository(RolesRepository);
  coursesRepository = getCustomRepository(CoursesRepository);
  usersRepository = getCustomRepository(UsersRepository);
});

afterAll(async () => {
  const mainConnection = getConnection();

  await connection.close();
  await mainConnection.close();
});

describe('CreateUser', () => {
  it('adds a user to the database', async () => {
    const bond = await bondsRepository.first();
    const role = await rolesRepository.first();
    const course = await coursesRepository.first();

    const response = await request(app).post('/users').send({
      name: 'Lucas Silva',
      email: 'lucas@gmail.com',
      cpf: '70142411175',
      phone: '62991431044',
      password: '123456',
      bondId: bond?.id,
      roleId: role?.id,
      courseId: course?.id,
    });

    // expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        name: 'Lucas Silva',
        email: 'lucas@gmail.com',
        cpf: '70142411175',
        phone: '62991431044',
        bond: {
          id: bond?.id,
          name: expect.any(String),
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
        courses: [
          {
            id: course?.id,
            name: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
          },
        ],
        role: {
          id: role?.id,
          name: expect.any(String),
          description: expect.any(String),
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
        roleId: role?.id,
        bondId: bond?.id,
        id: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
      }),
    );
  });

  it("doesn't add a user to the database with invalid data", async () => {
    const bond = await bondsRepository.first();
    const role = await rolesRepository.first();
    const course = await coursesRepository.first();

    const response = await request(app).post('/users').send({
      name: 'Lucas Silva',
      email: 'lucas1@gmail.com',
      phone: '62991431044',
      password: '123456',
      bondId: bond?.id,
      roleId: role?.id,
      courseId: course?.id,
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual(
      expect.objectContaining({
        status: 'erro',
        message: 'Validação falhou.',
        errors: expect.any(Object),
      }),
    );
  });

  it("doesn't add a user to the database with repeated cpf", async () => {
    const bond = await bondsRepository.first();
    const role = await rolesRepository.first();
    const course = await coursesRepository.first();

    const newUser = new User();
    Object.assign(newUser, {
      name: 'Lucas Silva',
      email: 'lucasd1@gmail.com',
      cpf: '77777777777',
      phone: '62991431044',
      password: '123456',
      bondId: bond?.id,
      roleId: role?.id,
      courses: [course],
    });

    await usersRepository.save(newUser);

    const response = await request(app).post('/users').send({
      name: 'Lucas Silva',
      cpf: '77777777777',
      email: 'lucas13@gmail.com',
      phone: '62991431044',
      password: '123456',
      bondId: bond?.id,
      roleId: role?.id,
      courseId: course?.id,
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual(
      expect.objectContaining({
        status: 'erro',
        message: 'Cpf já existente',
      }),
    );
  });

  it("doesn't add a user to the database with repeated email", async () => {
    const bond = await bondsRepository.first();
    const role = await rolesRepository.first();
    const course = await coursesRepository.first();

    const newUser = new User();
    Object.assign(newUser, {
      name: 'Lucas Silva',
      email: 'lucas77@gmail.com',
      cpf: '70142411133',
      phone: '62991431044',
      password: '123456',
      bondId: bond?.id,
      roleId: role?.id,
      courses: [course],
    });

    await usersRepository.save(newUser);

    const response = await request(app).post('/users').send({
      name: 'Lucas Silva',
      cpf: '70142413370',
      email: 'lucas77@gmail.com',
      phone: '62991431044',
      password: '123456',
      bondId: bond?.id,
      roleId: role?.id,
      courseId: course?.id,
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual(
      expect.objectContaining({
        status: 'erro',
        message: 'Email já existente',
      }),
    );
  });
});

describe('UpdateUser', () => {
  it('updates a user to the database without change password', async () => {
    const bond = await bondsRepository.first();
    const role = await rolesRepository.first();
    const course = await coursesRepository.first();
    if (!bond || !role || !course) return;
    const newUser = new User();
    Object.assign(newUser, {
      name: 'Lucas Silva',
      email: 'lucas1@gmail.com',
      cpf: '70142411176',
      phone: '62991431044',
      password: '123456',
      bondId: bond?.id,
      roleId: role?.id,
      courses: [course],
    });

    const user = await usersRepository.save(newUser);

    const response = await request(app).put(`/users/${user.id}`).send({
      name: 'Lucas Silva updated',
      email: user.email,
      cpf: user.cpf,
      phone: user.phone,
      bondId: bond?.id,
      roleId: role?.id,
      courseId: course?.id,
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        name: 'Lucas Silva updated',
        email: user.email,
        cpf: user.cpf,
        phone: user.phone,
        bond: {
          id: bond?.id,
          name: expect.any(String),
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
        courses: [
          {
            id: course?.id,
            name: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
          },
        ],
        role: {
          id: role?.id,
          name: expect.any(String),
          description: expect.any(String),
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
        id: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
      }),
    );
  });

  it('updates a user to the database changing the password', async () => {
    const hashProvider = new BCryptHashProvider();
    const bond = await bondsRepository.first();
    const role = await rolesRepository.first();
    const course = await coursesRepository.first();
    if (!bond || !role || !course) return;
    const newUser = new User();
    const pass = '123456';
    Object.assign(newUser, {
      name: 'Lucas Silva',
      email: 'lucas2@gmail.com',
      cpf: '70142411177',
      phone: '62991431044',
      password: await hashProvider.generateHash(pass),
      bondId: bond?.id,
      roleId: role?.id,
      courses: [course],
    });

    const user = await usersRepository.save(newUser);
    const response = await request(app).put(`/users/${user.id}`).send({
      name: 'Lucas Silva updated',
      email: user.email,
      cpf: user.cpf,
      phone: user.phone,
      bondId: bond?.id,
      roleId: role?.id,
      courseId: course?.id,
      password: 'newPassword',
      oldPassword: pass,
    });

    // expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        name: 'Lucas Silva updated',
        email: user.email,
        cpf: user.cpf,
        phone: user.phone,
        bond: {
          id: bond?.id,
          name: expect.any(String),
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
        courses: [
          {
            id: course?.id,
            name: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
          },
        ],
        role: {
          id: role?.id,
          name: expect.any(String),
          description: expect.any(String),
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
        id: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
      }),
    );
    const updatedUser = await usersRepository.findById(user.id);
    expect(updatedUser?.password).not.toEqual(user.password);
  });
});

describe('DeleteUser', () => {
  it('deletes a user', async () => {
    const bond = await bondsRepository.first();
    const role = await rolesRepository.first();
    const course = await coursesRepository.first();
    if (!bond || !role || !course) return;
    const newUser = new User();
    Object.assign(newUser, {
      name: 'Lucas Silva',
      email: 'lucas3@gmail.com',
      cpf: '70142411178',
      phone: '62991431044',
      password: '123456',
      bondId: bond?.id,
      roleId: role?.id,
      courses: [course],
    });

    const user = await usersRepository.save(newUser);
    const response = await request(app).delete(`/users/${user.id}`).send();

    expect(response.status).toBe(204);
    const deletedUser = await usersRepository.findById(user.id);
    expect(deletedUser).toBeFalsy();
  });
});
