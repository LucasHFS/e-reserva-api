import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IRolesRepository from '../../repositories/IRolesRepository';

@injectable()
class DeleteRoleService {
  constructor(
    @inject('RolesRepository')
    private rolesRepository: IRolesRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    const role = await this.rolesRepository.findById(id);

    if (!role) {
      throw new AppError('Papel não encontrado', 404);
    }

    await this.rolesRepository.delete(role);
  }
}

export default DeleteRoleService;
