import { EntityRepository, getRepository, Repository } from 'typeorm';

import ISportCourtsRepository from '@modules/rentable-items/repositories/ISportCourtsRepository';

import ICreateSportCourtDTO from '@modules/rentable-items/dtos/ICreateSportCourtDTO';

import SportCourt from '../entities/SportCourt';

@EntityRepository(SportCourt)
class SportCourtsRepository implements ISportCourtsRepository {
  private ormRepository: Repository<SportCourt>;

  constructor() {
    this.ormRepository = getRepository(SportCourt);
  }

  public async first(): Promise<SportCourt | undefined> {
    return this.ormRepository.findOne();
  }

  public async find(): Promise<SportCourt[]> {
    return this.ormRepository.find();
  }

  public async findById(id: string): Promise<SportCourt | undefined> {
    const sportCourt = await this.ormRepository.findOne(id);

    return sportCourt;
  }

  public async findByName(name: string): Promise<SportCourt | undefined> {
    const sportCourt = await this.ormRepository.findOne({ where: { name } });

    return sportCourt;
  }

  public async create({
    name,
    description,
  }: ICreateSportCourtDTO): Promise<SportCourt> {
    const sportCourt = this.ormRepository.create({
      name,
      description,
    });

    await this.ormRepository.save(sportCourt);

    return sportCourt;
  }

  public async save(sportCourt: SportCourt): Promise<SportCourt> {
    return this.ormRepository.save(sportCourt);
  }

  public async delete(sportCourt: SportCourt): Promise<void> {
    await this.ormRepository.remove(sportCourt);
  }
}

export default SportCourtsRepository;
