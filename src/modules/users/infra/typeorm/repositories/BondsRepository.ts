import { EntityRepository, getRepository, Repository } from 'typeorm';

import IBondsRepository from '@modules/users/repositories/IBondsRepository';

import ICreateBondDTO from '@modules/users/dtos/ICreateBondDTO';

import Bond from '../entities/Bond';

@EntityRepository(Bond)
class BondsRepository implements IBondsRepository {
  private ormRepository: Repository<Bond>;

  constructor() {
    this.ormRepository = getRepository(Bond);
  }

  public async first(): Promise<Bond | undefined> {
    return this.ormRepository.findOne();
  }

  public async find(): Promise<Bond[]> {
    return this.ormRepository.find();
  }

  public async findById(id: string): Promise<Bond | undefined> {
    const bond = await this.ormRepository.findOne(id);

    return bond;
  }

  public async findByName(name: string): Promise<Bond | undefined> {
    const role = await this.ormRepository.findOne({ where: { name } });

    return role;
  }

  public async create({ name }: ICreateBondDTO): Promise<Bond> {
    const bond = this.ormRepository.create({
      name,
    });

    await this.ormRepository.save(bond);

    return bond;
  }

  public async save(bond: Bond): Promise<Bond> {
    return this.ormRepository.save(bond);
  }

  public async delete(bond: Bond): Promise<void> {
    await this.ormRepository.remove(bond);
  }
}

export default BondsRepository;
