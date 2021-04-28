import { EntityRepository, getRepository, Repository } from 'typeorm';

import IRolesRepository from '@modules/users/repositories/IRolesRepository';

import ICreateRoleDTO from '@modules/users/dtos/ICreateRoleDTO';

import Role from '../entities/Role';

@EntityRepository(Role)
class RolesRepository implements IRolesRepository {
  private ormRepository: Repository<Role>;

  constructor() {
    this.ormRepository = getRepository(Role);
  }

  public async first(): Promise<Role | undefined> {
    return this.ormRepository.findOne();
  }

  public async find(): Promise<Role[]> {
    return this.ormRepository.find();
  }

  public async findById(id: string): Promise<Role | undefined> {
    const role = await this.ormRepository.findOne(id);

    return role;
  }

  public async findByName(name: string): Promise<Role | undefined> {
    const role = await this.ormRepository.findOne({ where: { name } });

    return role;
  }

  public async create({ name, description }: ICreateRoleDTO): Promise<Role> {
    const role = this.ormRepository.create({
      name,
      description,
    });

    await this.ormRepository.save(role);

    return role;
  }

  public async save(role: Role): Promise<Role> {
    return this.ormRepository.save(role);
  }

  public async delete(role: Role): Promise<void> {
    await this.ormRepository.remove(role);
  }
}

export default RolesRepository;
