import { uuid } from 'uuidv4';

import IRolesRepository from '@modules/users/repositories/IRolesRepository';

import ICreateRoleDTO from '@modules/users/dtos/ICreateRoleDTO';

import Role from '../../infra/typeorm/entities/Role';

class FakeRolesRepository implements IRolesRepository {
  private roles: Role[] = [];

  public async findById(id: string): Promise<Role | undefined> {
    const findRole = this.roles.find(role => role.id === id);

    return findRole;
  }

  public async create({ name, description }: ICreateRoleDTO): Promise<Role> {
    const role = new Role();

    Object.assign(role, { id: uuid(), name, description });

    this.roles.push(role);

    return role;
  }

  public async save(role: Role): Promise<Role> {
    const findIndex = this.roles.findIndex(findRole => findRole.id === role.id);

    this.roles[findIndex] = role;

    return role;
  }
}

export default FakeRolesRepository;
