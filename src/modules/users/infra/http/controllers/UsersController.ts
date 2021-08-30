import { Request, Response } from 'express';
import { container } from 'tsyringe';

import DeleteUserService from '@modules/users/services/userServices/DeleteUserService';
import CreateUserService from '@modules/users/services/userServices/CreateUserService';
import UpdateUserService from '@modules/users/services/userServices/UpdateUserService';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import AppError from '@shared/errors/AppError';

export default class UsersController {
  public async all(request: Request, response: Response): Promise<Response> {
    const usersRepository = new UsersRepository();
    const users = await usersRepository.find();
    return response.status(200).json(users);
  }

  public async findOne(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.params;

    if (!id) {
      throw new AppError('campo id é obrigatório', 400);
    }

    const usersRepository = new UsersRepository();
    const user = await usersRepository.findById(id);

    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }
    delete user.password;

    return response.status(200).json(user);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const {
      name,
      email,
      cpf,
      phone,
      password,
      bondId,
      courseId,
    } = request.body;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({
      name,
      email,
      cpf,
      phone,
      password,
      bondId,
      courseId,
    });

    delete user.password;

    return response.status(201).json(user);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const {
      name,
      email,
      cpf,
      phone,
      password,
      oldPassword,
      roleId,
      bondId,
      courseId,
    } = request.body;

    if (!id) {
      throw new AppError('campo id é obrigatório', 400);
    }

    const updateUser = container.resolve(UpdateUserService);

    const user = await updateUser.execute({
      id,
      name,
      email,
      cpf,
      phone,
      password,
      oldPassword,
      roleId,
      bondId,
      courseId,
    });

    delete user.password;

    return response.status(200).json(user);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    if (!id) {
      throw new AppError('campo id é obrigatório', 400);
    }

    const deleteUser = container.resolve(DeleteUserService);

    await deleteUser.execute(id);

    return response.status(204).send();
  }
}
