import { EntityRepository, getRepository, Repository } from 'typeorm';

import IEquipmentsRepository from '@modules/rentable-items/repositories/IEquipmentsRepository';

import ICreateEquipmentDTO from '@modules/rentable-items/dtos/ICreateEquipmentDTO';

import Equipment from '../entities/Equipment';

@EntityRepository(Equipment)
class EquipmentsRepository implements IEquipmentsRepository {
  private ormRepository: Repository<Equipment>;

  constructor() {
    this.ormRepository = getRepository(Equipment);
  }

  public async first(): Promise<Equipment | undefined> {
    return this.ormRepository.findOne();
  }

  public async find(): Promise<Equipment[]> {
    return this.ormRepository.find();
  }

  public async findById(id: string): Promise<Equipment | undefined> {
    const equipment = await this.ormRepository.findOne(id);

    return equipment;
  }

  public async findByName(name: string): Promise<Equipment | undefined> {
    const equipment = await this.ormRepository.findOne({ where: { name } });

    return equipment;
  }

  public async create({ name, description }: ICreateEquipmentDTO): Promise<Equipment> {
    const equipment = this.ormRepository.create({
      name,
      description,
    });

    await this.ormRepository.save(equipment);

    return equipment;
  }

  public async save(equipment: Equipment): Promise<Equipment> {
    return this.ormRepository.save(equipment);
  }

  public async delete(equipment: Equipment): Promise<void> {
    await this.ormRepository.remove(equipment);
  }
}

export default EquipmentsRepository;
