import { Request, Response } from 'express';
import { container } from 'tsyringe';

import DeleteRoleService from '@modules/users/services/roleServices/DeleteRoleService';
import CreateRoleService from '@modules/users/services/roleServices/CreateRoleService';
import UpdateRoleService from '@modules/users/services/roleServices/UpdateRoleService';
import RolesRepository from '@modules/users/infra/typeorm/repositories/RolesRepository';
import AppError from '@shared/errors/AppError';

export default class RolesController {
  public async all(request: Request, response: Response): Promise<Response> {
    const rolesRepository = new RolesRepository();
    const roles = await rolesRepository.find();
    return response.status(200).json(roles);
  }

  public async findOne(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.params;

    if (!id) {
      throw new AppError('campo id é obrigatório', 400);
    }

    const rolesRepository = new RolesRepository();
    const role = await rolesRepository.findById(id);

    if (!role) {
      throw new AppError('Papel não encontrado', 404);
    }

    return response.status(200).json(role);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, description } = request.body;

    const createRole = container.resolve(CreateRoleService);

    const role = await createRole.execute({
      name,
      description,
    });

    return response.status(201).json(role);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { name, description } = request.body;

    if (!id) {
      throw new AppError('campo id é obrigatório', 404);
    }

    const updateRole = container.resolve(UpdateRoleService);

    const role = await updateRole.execute({
      id,
      name,
      description,
    });

    return response.status(200).json(role);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    if (!id) {
      throw new AppError('campo id é obrigatório', 404);
    }

    const deleteRole = container.resolve(DeleteRoleService);

    await deleteRole.execute(id);

    return response.status(204).send();
  }
}
