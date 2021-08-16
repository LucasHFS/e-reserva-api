import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import Role from '../../infra/typeorm/entities/Role';
import IRolesRepository from '../../repositories/IRolesRepository';
import roleValidator from '@modules/users/validators/roleValidators';

interface IRequest {
  name: string;
  description: string;
}

@injectable()
class CreateRoleService {
  constructor(
    @inject('RolesRepository')
    private rolesRepository: IRolesRepository,
  ) {}

  public async execute({ name, description }: IRequest): Promise<Role> {
    
    await roleValidator({name, description})

    const checkRoleExists = await this.rolesRepository.findByName(name);

    if (checkRoleExists) {
      throw new AppError('Papel já existente', 400);
    }

    const role = await this.rolesRepository.create({
      name,
      description,
    });

    return role;
  }
}

export default CreateRoleService;
