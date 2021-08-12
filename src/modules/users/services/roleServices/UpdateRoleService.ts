import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import Role from '../../infra/typeorm/entities/Role';
import IRolesRepository from '../../repositories/IRolesRepository';
import roleValidator from '@modules/users/validators/roleValidators';

interface IRequest {
  id: string;
  name: string;
  description: string;
}

@injectable()
class UpdateRoleService {
  constructor(
    @inject('RolesRepository')
    private rolesRepository: IRolesRepository,
  ) {}

  public async execute({ id, name, description }: IRequest): Promise<Role> {
    await roleValidator({name, description})

    const thisRole = await this.rolesRepository.findById(id);

    if (!thisRole) {
      throw new AppError('Papel não encontrado', 404);
    }

    if (thisRole.name !== name) {
      const checkRoleExistsByMail = await this.rolesRepository.findByName(name);
      if (checkRoleExistsByMail) {
        throw new AppError('Email já utilizado', 400);
      }
    }

    thisRole.name = name;
    thisRole.description = description;

    const role = await this.rolesRepository.save(thisRole);

    return role;
  }
}

export default UpdateRoleService;
