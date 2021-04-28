import { uuid } from 'uuidv4';

import IBondsRepository from '@modules/users/repositories/IBondsRepository';

import ICreateBondDTO from '@modules/users/dtos/ICreateBondDTO';

import Bond from '../../infra/typeorm/entities/Bond';

class FakeBondsRepository implements IBondsRepository {
  private bonds: Bond[] = [];

  public async findById(id: string): Promise<Bond | undefined> {
    const findBond = this.bonds.find(bond => bond.id === id);

    return findBond;
  }

  public async create({ name }: ICreateBondDTO): Promise<Bond> {
    const bond = new Bond();

    Object.assign(bond, { id: uuid(), name });

    this.bonds.push(bond);

    return bond;
  }

  public async save(bond: Bond): Promise<Bond> {
    const findIndex = this.bonds.findIndex(findBond => findBond.id === bond.id);

    this.bonds[findIndex] = bond;

    return bond;
  }
}

export default FakeBondsRepository;
